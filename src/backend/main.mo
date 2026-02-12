import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Migration "migration";

(with migration = Migration.run)
actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let upiId = "stake2h@upi";
  let supportedUpiApps = ["Google Pay", "PhonePe", "Paytm", "BHIM", "Amazon Pay"];

  // Map UTR to submission data with owner principal
  let utrSubmissions = Map.empty<Text, UTRSubmissionWithOwner>();

  public type UTRSubmission = {
    utr : Text;
    timestamp : Time.Time;
  };

  type UTRSubmissionWithOwner = {
    utr : Text;
    timestamp : Time.Time;
    owner : Principal;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public read-only data - accessible to everyone including guests
  public query ({ caller }) func getUpiId() : async Text {
    upiId;
  };

  public query ({ caller }) func getSupportedUpiApps() : async [Text] {
    supportedUpiApps;
  };

  // Submit UTR - requires user authentication to prevent spam
  public shared ({ caller }) func submitUtr(utr : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit UTR");
    };

    // Validate UTR is not empty
    if (utr.size() == 0) {
      Runtime.trap("Invalid UTR: UTR cannot be empty");
    };

    let submission : UTRSubmissionWithOwner = {
      utr;
      timestamp = Time.now();
      owner = caller;
    };
    utrSubmissions.add(utr, submission);
  };

  // Get specific UTR submission - owner or admin only
  public query ({ caller }) func getUtrSubmission(utr : Text) : async ?UTRSubmission {
    switch (utrSubmissions.get(utr)) {
      case null { null };
      case (?submission) {
        // Allow access if caller is the owner or an admin
        if (submission.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own UTR submissions");
        };
        ?{
          utr = submission.utr;
          timestamp = submission.timestamp;
        };
      };
    };
  };

  // Get all submissions - admin only (sensitive financial data)
  public query ({ caller }) func getAllSubmissions() : async [UTRSubmission] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };

    utrSubmissions.values().toArray().map(
      func(submission) {
        {
          utr = submission.utr;
          timestamp = submission.timestamp;
        };
      }
    );
  };

  // Get caller's own submissions
  public query ({ caller }) func getMySubmissions() : async [UTRSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their submissions");
    };

    let filtered = utrSubmissions.values().toArray().filter(
      func(submission) {
        submission.owner == caller;
      }
    );

    filtered.map(
      func(submission) {
        {
          utr = submission.utr;
          timestamp = submission.timestamp;
        };
      }
    );
  };
};


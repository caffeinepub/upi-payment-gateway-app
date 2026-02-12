import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type OldUTRSubmission = {
    id : Text;
    utr : Text;
    timestamp : Time.Time;
    sender : Principal;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    utrSubmissions : Map.Map<Text, OldUTRSubmission>;
    utrLog : Map.Map<Text, OldUTRSubmission>;
    upiAppsBlob : Text;
  };

  type UTRSubmissionWithOwner = {
    utr : Text;
    timestamp : Time.Time;
    owner : Principal;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    utrSubmissions : Map.Map<Text, UTRSubmissionWithOwner>;
  };

  public func run(old : OldActor) : NewActor {
    let newUtrSubmissions = old.utrSubmissions.map<Text, OldUTRSubmission, UTRSubmissionWithOwner>(
      func(_utr, oldSubmission) {
        {
          utr = oldSubmission.utr;
          timestamp = oldSubmission.timestamp;
          owner = oldSubmission.sender;
        };
      }
    );
    {
      userProfiles = old.userProfiles;
      utrSubmissions = newUtrSubmissions;
    };
  };
};

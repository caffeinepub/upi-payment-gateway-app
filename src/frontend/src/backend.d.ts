import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface UTRSubmission {
    utr: string;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllSubmissions(): Promise<Array<UTRSubmission>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMySubmissions(): Promise<Array<UTRSubmission>>;
    getSupportedUpiApps(): Promise<Array<string>>;
    getUpiId(): Promise<string>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUtrSubmission(utr: string): Promise<UTRSubmission | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitUtr(utr: string): Promise<void>;
}

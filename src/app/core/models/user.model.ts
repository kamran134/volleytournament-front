export interface UserData {
    data: User[];
    totalCount: number;
}

export enum UserRole {
    SUPERADMIN = "superadmin",
    ADMIN = "admin",
    Coach = "coach",
    Captain = "captain",
    User = "user",
}

export interface User {
    _id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    isApproved: boolean;
}

export interface UserEdit {
    _id: string;
    email: string;
    password?: string;
    role: UserRole;
    isApproved: boolean;
}
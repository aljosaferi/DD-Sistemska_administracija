import { SetStateAction, createContext, Dispatch } from 'react';

export type ProfilePhoto = {
    _id: string;
    imagePath: string;
    __v: number;
}

export type User = {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    profilePhoto: ProfilePhoto;
    userType: string;
    pendingApproval: boolean;
    __v: number;
    id: string;
}

export interface UserContextInterface {
    user: User | null;
    setUserContext: (user: User | null) => void;
}

export const UserContext = createContext<UserContextInterface>({
    user: null,
    setUserContext: (user: User | null) => {}
});
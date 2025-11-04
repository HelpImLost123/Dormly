import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'guest' | 'user' | 'dormowner';

export interface AuthContextType {
    role: UserRole;
    loginAsUser: () => void;
    loginAsDormOwner: () => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<UserRole>('guest');

    const loginAsUser = () => {
        setRole('user');
    };

    const loginAsDormOwner = () => {
        setRole('dormowner');
    };

    const logout = () => {
        setRole('guest');
    };

    return (
        <AuthContext.Provider value={{ role, loginAsUser, loginAsDormOwner, logout }}>
        {children}
        </AuthContext.Provider>
    );
}
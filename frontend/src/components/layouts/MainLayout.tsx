import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useState } from 'react';
import NotLoginSidebar from './NotLoginSidebar';
import UserSidebar from './UserSidebar';
import DormOwnerSidebar from './DormOwnerSidebar';

interface MainLayoutProps {
    children: ReactNode;
    }

    export default function MainLayout({ children }: MainLayoutProps) {
    const { role } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const renderSidebar = () => {
        switch (role) {
        case 'user':
            return <UserSidebar />;
        case 'dormowner':
            return <DormOwnerSidebar />;
        default:
            return <NotLoginSidebar />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
        {/* Mobile Menu Button */}
        <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
            </svg>
        </button>

        {/* Sidebar - Hidden on mobile, shown on lg+ */}
        <div className={`
            fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            {renderSidebar()}
        </div>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
            <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto w-full">
            {children}
        </main>
        </div>
    );
}
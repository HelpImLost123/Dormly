import { useAuth } from '../hooks/use-auth';
import RequireAuth from '../components/common/NeedLogin';
import NotAvailable from '../components/common/NotAvailable';

export default function ChatPage() {
    const { role } = useAuth();

    if (role === 'guest') {
        return <RequireAuth />;
    }

    return (
        <NotAvailable />
        // <div className="p-8">
        // <h1 className="text-3xl font-bold mb-6">Chat</h1>
        // <p className="text-gray-600">Chat functionality coming soon...</p>
        // </div>
    );
}
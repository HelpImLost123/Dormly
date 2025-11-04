import { useAuth } from '../hooks/use-auth';
import RequireAuth from '../components/common/NeedLogin';

export default function SearchPage() {
    const { role } = useAuth();

    if (role === 'guest') {
        return <RequireAuth />;
    }

    return (
        <div className="p-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>
        <p className="text-gray-600">Search functionality coming soon...</p>
        </div>
    );
}
import { useAuth } from '../hooks/use-auth';
import NotAvailable from '../components/common/NotAvailable';

export default function NotificationsPage() {
    const { role } = useAuth();

    if (role === 'guest') {
        return <NotAvailable />;
    }

    return <NotAvailable />;
}
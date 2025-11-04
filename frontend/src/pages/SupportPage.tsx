import { useAuth } from '../hooks/use-auth';
// import RequireAuth from '../components/common/NeedLogin';
import NotAvailable from '../components/common/NotAvailable';

export default function SupportPage() {
    const { role } = useAuth();

    // ถ้ายังไม่ได้ login ให้แสดงหน้า "You need to log in"
    if (role === 'guest') {
        return <NotAvailable />;
    }

    // ถ้า login แล้วให้แสดงหน้า "Not available"
    return (
        <NotAvailable />
        // <div className="flex items-center justify-center min-h-screen bg-white">
        //     <div className="text-center">
        //         <h1 className="text-5xl font-bold text-gray-900">Not available</h1>
        //     </div>
        // </div>
    );
}
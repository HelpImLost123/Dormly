// import { useAuth } from '../hooks/use-auth';
// import RequireAuth from '../components/common/NeedLogin';

// export default function ReservedPage() {
//     const { role } = useAuth();

//     if (role === 'guest') {
//         return <RequireAuth />;
//     }

//     return (
//         <div className="p-8">
//         <h1 className="text-3xl font-bold mb-6">Reserved</h1>
//         <p className="text-gray-600">Your reservations will appear here...</p>
//         </div>
//     );
// }

import { useAuth } from '../hooks/use-auth';
import RequireAuth from '../components/common/NeedLogin';

export default function ReservedPage() {
    const { role } = useAuth();
    
    console.log('Current role:', role); // เพิ่มบรรทัดนี้เพื่อ debug
    
    if (role === 'guest') {
        return <RequireAuth />;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Reserved</h1>
            <p className="text-gray-600">Your reservations will appear here...</p>
        </div>
    );
}
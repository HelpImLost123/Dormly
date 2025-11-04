// import { useNavigate } from 'react-router-dom';

// export default function RequireAuth() {
//     const navigate = useNavigate();

//     return (
//         <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="text-center max-w-md px-4">
//             <h1 className="text-4xl sm:text-5xl font-bold mb-6">
//             You need to log in to use this feature
//             </h1>
//             <p className="text-gray-600 mb-8">
//             Please click "Login for User" on the left sidebar to sign in.
//             </p>
//             <button
//             onClick={() => navigate('/login')}
//             className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transition"
//             >
//             Login Now
//             </button>
//         </div>
//         </div>
//     );
// }

// src/components/common/NeedLogin.tsx
export default function RequireAuth() {
    return (
        <div className="flex items-center justify-center w-full h-full min-h-[calc(100vh-4rem)] bg-white">
        <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            You need to log in to use this feature
            </h1>
            <p className="text-base md:text-lg text-gray-600">
            Please click "Login for User" on the left sidebar to sign in.
            </p>
        </div>
        </div>
    );
}
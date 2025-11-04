import { useNavigate } from 'react-router-dom';
import NotLoginSidebar from '../components/layouts/NotLoginSidebar';

export default function RegisterDormOwnerPage() {
    const navigate = useNavigate();

    const handleRegister = () => {
        // ไปหน้า Multi-step Form
        navigate('/register-dormowner-form');
    };

    return (
        <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="hidden lg:block">
            <NotLoginSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
            <div className="max-w-4xl mx-auto p-6 sm:p-8">
            {/* Header with Image Placeholder */}
            <div className="text-center mb-8">
                <div className="w-32 h-32 bg-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold">
                Pic
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold">Register For DormOwner</h1>
            </div>

            {/* Subscription Plans Info (ไม่ให้เลือก) */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-6">Subscription Details</h2>

                <div className="space-y-6">
                {/* Basic Plan */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">1. Basic Plan (รายเดือน)</h3>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• แสดงหอพักบน Dormly 30 วัน</li>
                    <li>• แก้ไขข้อมูลหอพักได้ไม่จำกัด</li>
                    <li>• รองรับรูปภาพหอพัก 10 รูป</li>
                    <li>• ไม่มีการโปรโมตหน้าแรก</li>
                    </ul>
                    <div className="text-sm text-gray-600 mb-2">
                    เหมาะสำหรับหอพักขนาดเล็ก หรือหากต้องการลงทดลองในระบบของ Dormly
                    </div>
                    <div className="text-xl font-bold text-purple-600">ราคา : 599 บาท/เดือน</div>
                </div>

                {/* Premium Plan */}
                <div className="border-2 border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">2. Premium Plan (รายปี)</h3>
                    <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li>• แสดงหอพัก 12 เดือนเต็ม</li>
                    <li>• Badge "Verified Premium" บนหน้าหอพัก</li>
                    <li>• หอพักถูกโปรโมตบนหน้าแนะนำ search</li>
                    <li>• รองรับการโฆษณาบ้าง</li>
                    <li>• รองรับรูปภาพหอพัก 30 รูป</li>
                    </ul>
                    <div className="text-sm text-gray-600 mb-2">
                    เหมาะสำหรับหอพักขนาดกลางถึงใหญ่ที่ต้องการสร้างแบรนด์และเพิ่มโอกาสเพื่อหาลูกค้า
                    </div>
                    <div className="text-xl font-bold text-purple-600">ราคา : 5,999 บาท/ปี</div>
                </div>
                </div>
            </div>

            {/* Privacy Policy */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mb-8">
                <h2 className="text-xl font-bold mb-4">Dormly Privacy Policy & Terms of Service</h2>
                <div className="text-sm text-gray-700 space-y-4 max-h-96 overflow-y-auto">
                <p>
                    Dormly ให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของผู้ใช้ทั้งหมดทั้ง ผู้มีหาหอพัก ("User") 
                    และเจ้าของหอพัก ("DormOwner") โดยเฉพาะข้อมูลที่อยู่บนเว็บ Dormly นี้ แน่นปึกจึ่งปลอดภัยจากการพิพากษา 
                    รวมถึงสร้างการป้องกันในการใช้งานระบบ
                </p>

                <h3 className="font-bold mt-4">1. ข้อมูลที่ Dormly รวบรวม</h3>
                <p>เมื่อคุณเข้าใช้งานเว็บไซต์ Dormly เราจะรวบรวมข้อมูลดังต่อไปนี้:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>ข้อมูลส่วนบุคคล: ชื่อ-นามสกุล, อีเมล, เบอร์โทรศัพท์, Line ID</li>
                    <li>ข้อมูลการสร้างผู้ใช้งาน: ให้ไว้ (username), รหัสผ่าน</li>
                    <li>ข้อมูลหอพัก: ชื่อหอพัก, ที่อยู่, ราคา, รูปภาพ</li>
                </ul>

                <h3 className="font-bold mt-4">2. วัตถุประสงค์การรวบรวมข้อมูล</h3>
                <p>Dormly ใช้ข้อมูลของคุณเพื่อ:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>สร้างบัญชีผู้ใช้สำหรับเข้าถึงบริการ</li>
                    <li>ตรวจสอบสิทธิ์และความปลอดภัย</li>
                    <li>ปรับปรุงประสบการณ์การใช้งาน</li>
                </ul>

                <h3 className="font-bold mt-4">3. การรักษาความปลอดภัย</h3>
                <p>
                    Dormly ใช้มาตรการรักษาความปลอดภัยที่เหมาะสม เช่น การเข้ารหัสข้อมูล (Encrypted Database) 
                    และการสำรองข้อมูล (Backup)
                </p>

                <h3 className="font-bold mt-4">Terms & Policy</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>สมาชิกต้องให้ข้อมูลที่ถูกต้องและเป็นจริง</li>
                    <li>Dormly ไม่รับผิดชอบต่อความเสียหายจากการใช้บริการ</li>
                    <li>การละเมิดเงื่อนไขอาจถูกระงับบัญชี</li>
                </ul>
                </div>
            </div>

            {/* Register Button */}
            <div className="text-center">
                <button
                onClick={handleRegister}
                className="px-12 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition shadow-md hover:shadow-lg"
                >
                dormly register
                </button>
            </div>
            </div>
        </div>
        </div>
    );
}
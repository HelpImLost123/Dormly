import { useState } from 'react';

// Mocked dependencies for a single-file environment
// In a real application, you would use actual hooks from react-router-dom and your auth context.
const mockLoginAsDormOwner = () => {
    console.log('Dorm Owner Registration & Mock Login Successful!');
};
const mockNavigate = (path: string) => { // แก้ไข: เพิ่ม type string ให้กับ path
    console.log(`Simulating navigation to: ${path}`);
    // No actual navigation in this single file component
};

type Step = 'account' | 'document' | 'location' | 'details' | 'payment';

export default function App() {
    const [currentStep, setCurrentStep] = useState<Step>('account');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        selectedPlan: null as 'basic' | 'premium' | null,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // New state for custom alerts
    const [isProcessing, setIsProcessing] = useState(false); // New state for loading

    const steps: { id: Step; label: string }[] = [
        { id: 'account', label: 'Account' },
        { id: 'document', label: 'Dormitory Document' },
        { id: 'location', label: 'Dorm Location' },
        { id: 'details', label: 'Dorm Detail&Facilities' },
        { id: 'payment', label: 'Subscription Payment' },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    // Custom Error Message Toast Component (replaces alert)
    const MessageToast = () => {
        if (!errorMessage) return null;
        return (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-red-600 text-white rounded-lg shadow-xl transition-all duration-300 ease-out" role="alert">
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')} className="ml-4 font-bold text-lg leading-none p-1 hover:bg-red-700 rounded-full">&times;</button>
                </div>
            </div>
        );
    };

    const handleNext = () => {
        setErrorMessage(''); // Clear error on step change attempt

        if (currentStep === 'account') {
            if (!formData.email || !formData.password || !formData.confirmPassword) {
                setErrorMessage('Please fill all fields (Email, Password, Confirm Password).');
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setErrorMessage('Passwords do not match. Please check and try again.');
                return;
            }
            setCurrentStep('document');
        } else if (currentStep === 'document') {
             // Mock validation: In a real app, you would check if a document file state is set here.
            setCurrentStep('location');
        } else if (currentStep === 'location') {
            // Mock validation: Check if location data (lat/lng, address) is available.
            setCurrentStep('details');
        } else if (currentStep === 'details') {
            // Mock validation: Check if required detail fields are filled.
            setCurrentStep('payment');
        } else if (currentStep === 'payment') {
            if (!formData.selectedPlan) {
                setErrorMessage('Please select a subscription plan before proceeding to payment.');
                return;
            }
            handlePayment();
        }
    };

    const handleBack = () => {
        setErrorMessage('');
        if (currentStep === 'document') setCurrentStep('account');
        else if (currentStep === 'location') setCurrentStep('document');
        else if (currentStep === 'details') setCurrentStep('location');
        else if (currentStep === 'payment') setCurrentStep('details');
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        setErrorMessage('');

        const paymentData = {
            email: formData.email,
            plan: formData.selectedPlan,
            amount: formData.selectedPlan === 'basic' ? 599 : 5999,
        };

        try {
            // --- MOCKING API CALL: Simulate payment process ---
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network latency

            console.log('Attempting mock payment with:', paymentData);

            // Simulate successful registration and login after payment
            mockLoginAsDormOwner();
            mockNavigate('/');

            setErrorMessage('Registration complete! Redirecting to Dashboard...');
            setTimeout(() => setErrorMessage(''), 3000); 

        } catch (error) {
            console.error('Payment simulation error:', error);
            setErrorMessage('An unexpected error occurred during payment. Please check console.');
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Helper components for steps 2, 3, 4 with mock UI for better presentation

    const DormDocumentStep = () => (
        <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">2. Insert Dormitory Document</h1>
            <p className="text-center text-gray-500 mb-6">Please upload the official license or registration documents for your dormitory.</p>
            
            <div className="max-w-xl mx-auto border-4 border-dashed border-purple-200 rounded-xl p-8 bg-purple-50">
                <div className="flex flex-col items-center justify-center h-48">
                    <svg className="w-16 h-16 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    <p className="text-lg font-semibold text-purple-600 mb-4">Drag and drop file here or click to upload</p>
                    <input type="file" id="document-upload" className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
                    <label htmlFor="document-upload" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg transition duration-300 transform hover:scale-105 cursor-pointer">
                        Select File
                    </label>
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">Accepted formats: PDF, PNG, JPG (Max 5MB)</p>
            </div>
        </div>
    );

    const DormLocationStep = () => (
        <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">3. Select Dorm Location</h1>
            <p className="text-center text-gray-500 mb-6">Pinpoint the exact location of your dormitory on the map.</p>
            
            <div className="max-w-2xl mx-auto aspect-video bg-gray-200 rounded-xl overflow-hidden border-4 border-gray-300">
                {/* Mock Map Area */}
                <div className="w-full h-full flex items-center justify-center bg-gray-100 relative">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full text-5xl text-red-500 animate-bounce">
                        📍
                    </div>
                    <div className="text-center">
                        <p className="text-xl font-bold text-gray-500">Google Maps Simulation</p>
                        <p className="text-sm text-gray-400 mt-1">Click to drop pin to confirm location</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 max-w-xl mx-auto">
                <label className="block text-sm font-medium mb-2 text-gray-700">Address Confirmation</label>
                <input
                    type="text"
                    defaultValue="123/4 Moo 5, Khlong Luang, Pathum Thani, Thailand (Mock Data)"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full address"
                />
            </div>
        </div>
    );

    const DormDetailsStep = () => (
        <div className="bg-white p-8 rounded-xl shadow-2xl">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">4. Enter Dorm Details & Facilities</h1>
            <p className="text-center text-gray-500 mb-6">Provide key information, facilities, and room types for your dormitory.</p>

            <div className="space-y-6 max-w-xl mx-auto">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Dormitory Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="e.g., The Cozy Residence"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                    <textarea
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Tell potential renters about your dorm..."
                    ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <h3 className="col-span-2 text-lg font-semibold pt-2 border-t border-gray-100 text-gray-700">Key Facilities</h3>
                    <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                        <input type="checkbox" id="wifi" className="rounded text-purple-600 focus:ring-purple-500" defaultChecked={true} />
                        <label htmlFor="wifi" className="text-sm font-medium text-gray-700">Free Wi-Fi</label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                        <input type="checkbox" id="parking" className="rounded text-purple-600 focus:ring-purple-500" />
                        <label htmlFor="parking" className="text-sm font-medium text-gray-700">Parking</label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                        <input type="checkbox" id="laundry" className="rounded text-purple-600 focus:ring-purple-500" />
                        <label htmlFor="laundry" className="text-sm font-medium text-gray-700">Laundry Service</label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg">
                        <input type="checkbox" id="security" className="rounded text-purple-600 focus:ring-purple-500" defaultChecked={true} />
                        <label htmlFor="security" className="text-sm font-medium text-gray-700">24/7 Security</label>
                    </div>
                </div>
            </div>
        </div>
    );


    const StepContent = () => {
        switch (currentStep) {
            case 'account':
                return (
                    <div className="bg-white p-8 rounded-xl shadow-2xl">
                        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-800">1. Create Dorm Account</h1>

                        <div className="space-y-6 max-w-xl mx-auto">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 p-1 rounded-full hover:bg-gray-200 transition"
                                    >
                                        {/* Eye Icon SVG */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 p-1 rounded-full hover:bg-gray-200 transition"
                                    >
                                        {/* Eye Icon SVG */}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" : "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"} />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'document':
                return <DormDocumentStep />;
            case 'location':
                return <DormLocationStep />;
            case 'details':
                return <DormDetailsStep />;
            case 'payment':
                return (
                    <div className="bg-white p-8 rounded-xl shadow-2xl">
                        <h1 className="text-4xl font-extrabold mb-6 text-center text-gray-800">5. Dorm Subscription</h1>
                        
                        <p className="text-center mb-8 text-gray-500 max-w-2xl mx-auto">
                            Dormly จะช่วยให้ผู้เช่าหอพักของคุณได้ง่ายขึ้นในหน้าแนะนำและผลการค้นหา
                            เลือกแผนที่เหมาะกับคุณแล้วเริ่มสร้างโปรไฟล์หอพักของคุณวันนี้!
                        </p>

                        <div className="max-w-2xl mx-auto space-y-4">
                            {/* Basic Plan */}
                            <div
                                onClick={() => setFormData({ ...formData, selectedPlan: 'basic' })}
                                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                                    formData.selectedPlan === 'basic' ? 'border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-100' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl mb-3 text-gray-800">Basic Plan (รายเดือน)</h3>
                                        <ul className="text-sm space-y-1 text-gray-600 list-inside">
                                            <li>• แสดงหอพักบน Dormly <span className="font-semibold text-purple-600">30 วัน</span></li>
                                            <li>• แก้ไขข้อมูลหอพักได้ไม่จำกัด</li>
                                            <li>• รองรับรูปภาพหอพัก 10 รูป</li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col items-end ml-6">
                                        <div
                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 ${
                                                formData.selectedPlan === 'basic' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                            }`}
                                        >
                                            {formData.selectedPlan === 'basic' && (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold text-purple-600">599฿</p>
                                        <p className="text-base text-gray-500">/ เดือน</p>
                                    </div>
                                </div>
                            </div>

                            {/* Premium Plan */}
                            <div
                                onClick={() => setFormData({ ...formData, selectedPlan: 'premium' })}
                                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                                    formData.selectedPlan === 'premium' ? 'border-purple-500 bg-purple-50 shadow-lg ring-4 ring-purple-100' : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-xl mb-3 text-gray-800">Premium Plan (รายปี)</h3>
                                        <ul className="text-sm space-y-1 text-gray-600 list-inside">
                                            <li>• แสดงหอพัก <span className="font-semibold text-purple-600">12 เดือนเต็ม</span></li>
                                            <li>• <span className="font-semibold text-green-600">Badge "Verified Premium"</span> บนหน้าหอพัก</li>
                                            <li>• หอพักถูกโปรโมตบนหน้าแนะนำ search</li>
                                            <li>• รายงานสถิติการเข้าชม</li>
                                            <li>• รองรับรูปภาพหอพัก <span className="font-semibold text-purple-600">30 รูป</span></li>
                                        </ul>
                                        <p className="text-xs text-gray-500 mt-2">
                                            เหมาะสำหรับเจ้าของหอพักที่ต้องการสร้างความน่าเชื่อถือ
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end ml-6">
                                        <div
                                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-3 ${
                                                formData.selectedPlan === 'premium' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                                            }`}
                                        >
                                            {formData.selectedPlan === 'premium' && (
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <p className="text-3xl font-bold text-purple-600">5,999฿</p>
                                        <p className="text-base text-gray-500">/ ปี</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* Custom Error Message Toast (Replaces alert) */}
            <MessageToast />
            <script src="https://cdn.tailwindcss.com"></script>

            {/* Progress Stepper - Fixed and Centered */}
            <div className="bg-white border-b py-6 px-4 shadow-md sticky top-0 z-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex-1 flex items-center">
                                <div className="flex flex-col items-center justify-center z-10">
                                    {/* Circle */}
                                    <div
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold transition-all duration-500 ease-in-out text-sm sm:text-base ${
                                            index < currentStepIndex
                                                ? 'bg-green-500'
                                                : index === currentStepIndex
                                                ? 'bg-purple-600 ring-4 ring-purple-200 shadow-xl'
                                                : 'bg-gray-300'
                                        }`}
                                    >
                                        {index < currentStepIndex ? '✓' : index + 1}
                                    </div>
                                    {/* Label */}
                                    <p
                                        className={`mt-2 text-xs sm:text-sm font-medium text-center transition-all ${
                                            index <= currentStepIndex ? 'text-purple-600 font-semibold' : 'text-gray-500'
                                        }`}
                                        style={{ minWidth: '80px' }}
                                    >
                                        {step.label}
                                    </p>
                                </div>

                                {/* Line (hidden for the last step) */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 transition-all duration-500 ease-in-out ${
                                            index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                        style={{ minWidth: '40px' }}
                                    ></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex items-start justify-center p-4 sm:p-10">
                <div className="w-full max-w-4xl pt-8">
                    {/* Render current step content */}
                    <div className="mb-10">
                        <StepContent />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                        {currentStep !== 'account' && (
                            <button
                                onClick={handleBack}
                                className="px-8 py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-medium transition duration-300 shadow-md transform hover:scale-105"
                                disabled={isProcessing}
                            >
                                ← Back
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            disabled={isProcessing || (currentStep === 'payment' && !formData.selectedPlan)}
                            className={`px-12 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg transform hover:scale-105 ${
                                currentStep === 'payment' && !formData.selectedPlan
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-xl'
                            } ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {isProcessing
                                ? (currentStep === 'payment' ? 'Processing Payment...' : 'Loading...')
                                : (currentStep === 'payment'
                                    ? `Pay ${formData.selectedPlan ? (formData.selectedPlan === 'basic' ? '599฿' : '5,999฿') : ''}`
                                    : 'Next →')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

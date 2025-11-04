import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/use-auth';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './pages/HomePage';
import DormDetailPage from './pages/DormDetailPage';
import LoginPage from './pages/LoginPage';
import LoginDormOwnerPage from './pages/LoginDormOwnerPage';
import RegisterPage from './pages/RegisterPage';
import RegisterDormOwnerPage from './pages/RegisterDormOwnerPage';
import RegisterDormOwnerFormPage from './pages/RegisterDormOwnerFormPage';
import DormOwnerDashboard from './pages/DormOwnerDashboard';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import ChatPage from './pages/ChatPage';
import ReservedPage from './pages/ReservedPage';
import ReviewPage from './pages/ReviewPage';
import SupportPage from './pages/SupportPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import Checkout from './pages/payment/checkOut';
import PaymentByCreditCard from './pages/payment/paymentByCreditCard';
import MobileBanking from './pages/payment/MobileBanking';
import ThankYou from './pages/payment/ThankYou';
import './App.css';

export type Page = 'checkout' | 'paymentCard' | 'mobileBanking' | 'thankYou';

export interface DormDataForPayment {
  dorm_id: number;
  dorm_name: string;
  medias: string[];
  room_types?: { rent_per_month: number }[];
}

function PaymentFlow() {
  const [currentPage, setCurrentPage] = useState<Page>('checkout');

  const location = useLocation();
  const navigate = useNavigate(); 
  const dormData = location.state?.dormData as DormDataForPayment | undefined;

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  if (!dormData || !dormData.room_types || dormData.room_types.length === 0) {
    return (
      <div className="checkout-container">
        <h1 className="checkout-title">Error</h1>
        <p>No dorm data found. Please start your booking from the dorm detail page.</p>
        <button className="next-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch(currentPage) {
      case 'checkout':
        return <Checkout navigateTo={navigateTo} dormData={dormData} />;
      case 'paymentCard':
        return <PaymentByCreditCard navigateTo={navigateTo} dormData={dormData} />;
      case 'mobileBanking': 
        return <MobileBanking navigateTo={navigateTo} dormData={dormData} />;
      case 'thankYou':
        return <ThankYou onContinue={() => navigate('/')} dormData={dormData} />;
      default:
        return <Checkout navigateTo={navigateTo} dormData={dormData} />;
    }
  }
  return renderCurrentPage();
}


function AppRoutes() {
  const { role } = useAuth();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login-dormowner" element={<LoginDormOwnerPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-dormowner" element={<RegisterDormOwnerPage />} />
      <Route path="/register-dormowner-form" element={<RegisterDormOwnerFormPage />} />
      
      {/* Main Routes with Layout */}
      <Route
        path="/"
        element={
          <MainLayout>
            {role === 'dormowner' ? <DormOwnerDashboard /> : <HomePage />}
          </MainLayout>
        }
      />
      <Route
        path="/dorms/:id"
        element={
            <MainLayout>
                <DormDetailPage />
            </MainLayout>
        }
    />
      <Route
        path="/search"
        element={ <MainLayout> <SearchPage /> </MainLayout> }
      />
      <Route
        path="/favorites"
        element={ <MainLayout> <FavoritesPage /> </MainLayout> }
      />
      <Route
        path="/chat"
        element={ <MainLayout> <ChatPage /> </MainLayout> }
      />
      <Route
        path="/reserved"
        element={ <MainLayout> <ReservedPage /> </MainLayout> }
      />
      <Route
        path="/review"
        element={ <MainLayout> <ReviewPage /> </MainLayout> }
      />
      <Route
        path="/support"
        element={ <MainLayout> <SupportPage /> </MainLayout> }
      />
      <Route
        path="/notifications"
        element={ <MainLayout> <NotificationsPage /> </MainLayout> }
      />
      <Route
        path="/settings"
        element={ <MainLayout> <SettingsPage /> </MainLayout> }
      />
      
      {/* 💡 Route นี้จะเรียก PaymentFlow */}
      <Route
        path="/payment"
        element={
          <MainLayout>
            <PaymentFlow />
          </MainLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


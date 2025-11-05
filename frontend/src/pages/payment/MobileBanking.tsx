import React, { useState } from 'react';
import './MobileBanking.css';
import { type Page, type DormDataForPayment } from '../../App';
import KKPIcon from  '../../assets/icon-bank/knkp.png';
import KBANKIcon from '../../assets/icon-bank/kbank.png';
import SCBIcon from '../../assets/icon-bank/scb.png';
import UOBIcon from '../../assets/icon-bank/UOB.png';

const bankOptions = [
  { id: 'KKP', name: 'Kiatnakin Phatra', icon: KKPIcon },
  { id: 'KBANK', name: 'KBank', icon: KBANKIcon },
  { id: 'SCB', name: 'SCB', icon: SCBIcon },
  { id: 'UOB', name: 'UOB', icon: UOBIcon },
];

interface MobileBankingProps {
  navigateTo: (page: Page) => void;
  dormData: DormDataForPayment;
  setErrorMessage: (message: string) => void; 
}

const MobileBanking: React.FC<MobileBankingProps> = ({ navigateTo, dormData, setErrorMessage }) => {
  const [selectedBank, setSelectedBank] = useState<string>('KBANK');

  const priceInBaht = (dormData.room_types && dormData.room_types.length > 0)
    ? dormData.room_types[0].rent_per_month
    : 0;
  const amountInSatang = priceInBaht * 100;

  const handlePay = async () => {
    if (amountInSatang <= 0) {
      setErrorMessage("Error: Invalid payment amount.");
      navigateTo('fail');
      return;
    }

    // --- (ตัวอย่างการทำงานจริง) ---
    try {
      // (Backend ของคุณยังไม่มี API นี้ คุณต้องสร้างเพิ่ม)
      // const response = await fetch('http://localhost:3001/api/create-mobile-charge', { ... });
      // const data = await response.json();
      
      // (จำลองการล้มเหลว)
      throw new Error("Mobile Banking is not yet supported by the server.");

      // (จำลองการสำเร็จ)
      // if (data.success && data.authorize_uri) {
      //   window.location.href = data.authorize_uri;
      // } else {
      //   throw new Error(data.message || "Failed to create mobile payment.");
      // }
      
    } catch (error: any) {
      console.error("Payment Error:", error);
      setErrorMessage(error.message); 
      navigateTo('fail');
    }
  };

  return (
    <div className="mobile-banking-container">
      <button onClick={() => navigateTo('checkout')} className="back-button">← Back</button>
      <h1 className="main-title">Mobile banking</h1>
      <h2 className="subtitle">Select your bank account</h2>
      <div className="bank-options-list">
        {bankOptions.map((bank) => (
          <button
            key={bank.id}
            className={`bank-option ${selectedBank === bank.id ? 'selected' : ''}`}
            onClick={() => setSelectedBank(bank.id)}
          >
            <img src={bank.icon} alt={bank.name} className="bank-icon" />
            <span className="bank-name">{bank.name}</span>
          </button>
        ))}
      </div>
      <div className="footer-action">
        <button className="pay-button-dark" onClick={handlePay}>
          Pay {priceInBaht.toLocaleString()} THB
        </button>
      </div>
    </div>
  );
};

export default MobileBanking;


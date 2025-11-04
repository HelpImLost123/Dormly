
import React, { useState } from 'react';
import './MobileBanking.css';
import { type Page, type DormDataForPayment } from '../../App';

import KKPIcon from  '../../assets/icon-bank/knkp.png';
import KBANKIcon from '../../assets/icon-bank/kbank.png';
import SCBIcon from '../../assets/icon-bank/scb.png';
import UOBIcon from '../../assets/icon-bank/UOB.png';

// ข้อมูลธนาคาร
const bankOptions = [
  { id: 'KKP', name: 'Kiatnakin Phatra', icon: KKPIcon },
  { id: 'KBANK', name: 'KBank', icon: KBANKIcon },
  { id: 'SCB', name: 'SCB', icon: SCBIcon },
  { id: 'UOB', name: 'UOB', icon: UOBIcon },
];

//  อัปเกรด Props ให้ "รับ" dormData
interface MobileBankingProps {
  navigateTo: (page: Page) => void;
  dormData: DormDataForPayment; 
}

const MobileBanking: React.FC<MobileBankingProps> = ({ navigateTo, dormData }) => {
  const [selectedBank, setSelectedBank] = useState<string>('KBANK'); // (เลือก 'KBANK' ให้ตรงกับ list)

  // ดึง "ราคาจริง" ออกมาจาก prop
  const priceInBaht = (dormData.room_types && dormData.room_types.length > 0)
    ? dormData.room_types[0].rent_per_month
    : 0;
  // แปลงเป็นสตางค์สำหรับ Omise
  const amountInSatang = priceInBaht * 100;


  const handlePay = () => {
    // (ตรวจสอบอีกครั้งว่ามีราคาก่อนยิง API)
    if (amountInSatang <= 0) {
      alert("Error: Invalid payment amount.");
      return;
    }

    console.log(`Preparing to pay with: ${selectedBank} for ${amountInSatang} Satang`);
    alert(`คุณเลือกชำระเงินผ่าน ${selectedBank}\nในระบบจริงจะ Redirect ไปยังหน้าชำระเงินของธนาคาร`);

    
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
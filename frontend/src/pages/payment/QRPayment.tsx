import React, { useState, useEffect } from 'react';
import './QRPayment.css';
import { type Page, type DormDataForPayment } from '../../App';

interface QRPaymentProps {
  navigateTo: (page: Page) => void;
  dormData: DormDataForPayment;
  setErrorMessage: (message: string) => void;
}

const QRPayment: React.FC<QRPaymentProps> = ({ navigateTo, dormData, setErrorMessage }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const priceInBaht = (dormData.room_types && dormData.room_types.length > 0)
    ? dormData.room_types[0].rent_per_month
    : 0;
  const amountInSatang = priceInBaht * 100;

  useEffect(() => {
    const createQRCode = async () => {
      if (amountInSatang <= 0) {
        setErrorMessage("Error: Invalid payment amount.");
        navigateTo('fail');
        return;
      }

      setIsLoading(true);
      try {
        // 💡💡💡 (แก้ไข URL) 💡💡💡
        // (เพิ่ม /payment เข้าไป)
        const response = await fetch('http://localhost:3001/api/payment/create-qr-charge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amountInSatang,
            userId: 1, // (TODO: ส่ง User ID จริง)
            roomId: dormData.dorm_id
          }),
        });
        // 💡💡💡 (จบจุดแก้ไข) 💡💡💡

        const data = await response.json();
        if (!response.ok || !data.success || !data.qrImageUrl) {
          throw new Error(data.message || 'Failed to create QR Code');
        }

        setQrImageUrl(data.qrImageUrl);

      } catch (error: any) {
        console.error('QR Code Creation Error:', error);
        setErrorMessage(error.message);
        navigateTo('fail');
      } finally {
        setIsLoading(false);
      }
    };

    createQRCode();
    
  }, [amountInSatang, dormData.dorm_id, navigateTo, setErrorMessage]);

  return (
    <div className="qr-payment-container">
      <button onClick={() => navigateTo('checkout')} className="back-button">← Back</button>
      
      <h1 className="qr-title">Scan to Pay</h1>
      <p className="qr-subtitle">
        Please use your mobile banking app to scan the QR Code below.
      </p>

      <div className="qr-code-wrapper">
        {isLoading && (
          <div className="qr-loading">
            <div className="spinner"></div>
            <p>Generating QR Code...</p>
          </div>
        )}
        
        {qrImageUrl && !isLoading && (
          <img src={qrImageUrl} alt="PromptPay QR Code" className="qr-image" />
        )}
      </div>

      <div className="qr-amount">
        Total Amount:
        <span>{priceInBaht.toLocaleString()} THB</span>
      </div>

      <div className="qr-footer">
        <p>After paying, the status will be updated automatically.</p>
        <button 
          className="check-status-button" 
          onClick={() => navigateTo('success')}
        >
          I have paid (Test)
        </button>
      </div>
    </div>
  );
};

export default QRPayment;
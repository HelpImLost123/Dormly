import React, { type FormEvent, useEffect, useState } from 'react';
import './paymentByCreditCard.css';
import { OMISE_PUBLIC_KEY } from '../../publicKey/omisePublicKey';

import { type Page, type DormDataForPayment } from '../../App'; 

declare global {
  interface Window {
    Omise: any;
  }
}

interface PaymentByCreditCardProps {
  navigateTo: (page: Page) => void;
  dormData: DormDataForPayment; 
}

const PaymentByCreditCard: React.FC<PaymentByCreditCardProps> = ({ navigateTo, dormData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

 
  const priceInBaht = (dormData.room_types && dormData.room_types.length > 0)
    ? dormData.room_types[0].rent_per_month
    : 0;


  const amountInSatang = priceInBaht * 100;

  // โหลด Omise script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.omise.co/omise.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCreateCharge = async (token: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    // (ตรวจสอบอีกครั้งว่ามีราคาก่อนยิง API)
    if (amountInSatang <= 0) {
      setErrorMessage("Error: Invalid payment amount.");
      setIsLoading(false);
      return;
    }

    try {
      // (ตรวจสอบ URL ให้ถูกต้องว่า Backend รันที่ 3001)
      const response = await fetch('http://localhost:3001/api/create-charge', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            token, 
            amount: amountInSatang, 
            userId: 1, 
            roomId: dormData.dorm_id 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment failed');

      navigateTo('thankYou');

    } catch (error: any) {
      console.error('Payment Error:', error);
      setErrorMessage(error.message || 'An unknown error occurred.');
      setIsLoading(false); 
    }
  };

  // เมื่อผู้ใช้กด submit
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    if (!window.Omise) {
      alert('Omise.js is not loaded.');
      return;
    }

    window.Omise.setPublicKey(OMISE_PUBLIC_KEY);

    const form = event.currentTarget;
    const card = {
      name: (form.querySelector('#card-name') as HTMLInputElement).value,
      number: (form.querySelector('#card-number') as HTMLInputElement).value,
      expiration_month: (form.querySelector('#card-expiry') as HTMLInputElement).value.split('/')[0].trim(),
      expiration_year: `20${(form.querySelector('#card-expiry') as HTMLInputElement).value.split('/')[1].trim()}`,
      security_code: (form.querySelector('#card-cvc') as HTMLInputElement).value,
    };

    window.Omise.createToken('card', card, (statusCode: number, response: any) => {
      if (statusCode === 200) {
        handleCreateCharge(response.id);
      } else {
        console.error('Error creating token:', response.message);
        setErrorMessage(response.message || 'Failed to create token.');
      }
    });
  };

  return (
    <div className="payment-container">
      <div className="payment-form-modal">

        <button onClick={() => navigateTo('checkout')} className="back-button" disabled={isLoading}>
          ← Back to options
        </button>

        <div className="header">
          <div className="brand-logo">Esino</div>
          <span>Secured by Omise</span>
        </div>

        <div className="payment-method-selector">
          <span className="active">Credit / Debit</span>
          <a href="#">Other Methods →</a>
        </div>

        {/* ฟอร์มกรอกข้อมูลบัตร */}
        <form id="checkout-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="card-number">Card number</label>
            <div className="input-with-icon">
              <input type="text" id="card-number" placeholder="4242 4242 4242 4242" required />
              <div className="card-icon visa"></div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="card-name">Name on card</label>
            <input type="text" id="card-name" placeholder="Jane Doe" required />
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label htmlFor="card-expiry">Expiry date</label>
              <input type="text" id="card-expiry" placeholder="MM / YY" required />
            </div>
            <div className="form-group half-width">
              <label htmlFor="card-cvc">Security code</label>
              <input type="text" id="card-cvc" placeholder="•••" required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="country">Country or region</label>
            <select id="country" required>
              <option value="TH">Thailand</option>
            </select>
          </div>

          {/* แสดง Error message ถ้ามี */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* 💡 6. ปุ่มจ่ายเงิน (ใช้ราคาจริง) */}
          <button type="submit" className="pay-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : `Pay ${priceInBaht.toLocaleString()} THB`}
          </button>
        </form>

        <div className="footer">
          <span className="secure-lock">✓</span>
          <span>Secured by </span>
          <span className="omise-logo">OMISE</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentByCreditCard;
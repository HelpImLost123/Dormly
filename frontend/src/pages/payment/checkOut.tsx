import React, { useState } from 'react';
import './checkOut.css';
import { type Page, type DormDataForPayment } from '../../App';


import cardIcon from '../../assets/icon-checkout/credit-card.png';
import installmentIcon from '../../assets/icon-checkout/down-payment.png';
import mobileIcon from '../../assets/icon-checkout/bank-building.png';
import alipayIcon from '../../assets/icon-checkout/wallet-money.png';

const paymentOptions = [
  { id: 'card', name: 'Card', icon: cardIcon, targetPage: 'paymentCard' as Page },
  { id: 'installment', name: 'Installment', icon: installmentIcon, targetPage: 'checkout' as Page }, // ยังไม่เปิดใช้งาน
  { id: 'mobile_banking', name: 'Mobile banking', icon: mobileIcon, targetPage: 'mobileBanking' as Page },
  { id: 'QR Payment', name: 'QR Payment', icon: alipayIcon, targetPage: 'checkout' as Page }, // ยังไม่เปิดใช้งาน
];


interface CheckoutProps {
  navigateTo: (page: Page) => void;
  dormData: DormDataForPayment; // <-- รับ dormData ที่ส่งมาจาก PaymentFlow
}

const Checkout: React.FC<CheckoutProps> = ({ navigateTo, dormData }) => {
  const [selectedOption, setSelectedOption] = useState<string>('card');


  if (!dormData || !dormData.room_types || dormData.room_types.length === 0) {
    return <div>Error: Dorm data is missing. (checkOut.tsx)</div>;
  }

 
  const productPrice = dormData.room_types[0].rent_per_month;
  const productImage = dormData.medias[0] || 'https://images.unsplash.com/photo-1570129477490-d5e03a0c5b59?q=80&w=400';

  const handleNextClick = () => {
    const selected = paymentOptions.find(opt => opt.id === selectedOption);
    if (selected) {
      if (selected.targetPage === 'checkout') {
        alert('This payment method is not available yet.');
        return;
      }
    
      navigateTo(selected.targetPage);
    }
  };

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout</h1>

    
      <div className="order-summary">
        <img src={productImage} alt={dormData.dorm_name} className="product-image" />
        <div className="product-details">
          <h3>{dormData.dorm_name}</h3>
          <p>Monthly Rental</p>
        </div>
        <div className="product-price">
          {productPrice.toLocaleString()} THB
        </div>
      </div>

      <hr className="divider" />

      {/* ส่วนเลือกวิธีชำระเงิน */}
      <h2 className="payment-title">Select your payment option</h2>
      <div className="payment-options-list">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            className={`payment-option ${selectedOption === option.id ? 'selected' : ''}`}
            onClick={() => setSelectedOption(option.id)}
          >
            <img src={option.icon} alt={option.name} className="payment-icon" />
            <span className="payment-name">{option.name}</span>
          </button>
        ))}
      </div>

      {/* ปุ่ม Next */}
      <div className="checkout-footer">
        <button className="next-button" onClick={handleNextClick}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Checkout;


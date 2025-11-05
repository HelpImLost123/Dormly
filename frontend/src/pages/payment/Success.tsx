import React from 'react';
import './Success.css'; 
import { type DormDataForPayment } from '../../App';

const CheckIcon = () => (
  <svg className="check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="check-circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="check-mark" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
  </svg>
);

interface SuccessProps {
  onContinue: () => void;
  dormData: DormDataForPayment;
}

const Success: React.FC<SuccessProps> = ({ onContinue, dormData }) => {

  const priceInBaht = (dormData.room_types && dormData.room_types.length > 0)
    ? dormData.room_types[0].rent_per_month
    : 0;

  return (
    <div className="payment-result-container">
      <div className="card">
        <div className="icon-container">
          <CheckIcon />
        </div>
        <h1 className="title">Thank you</h1>
        <p className="subtitle">Your payment has been successfully processed</p>
        
        <hr className="divider" />
        
        <div className="order-details">
          <div className="detail-item">
            <span className="label">ORDER NUMBER</span>
            <span className="value">DORMLY-{dormData.dorm_id}</span>
          </div>
          <div className="detail-item">
            <span className="label">TOTAL AMOUNT</span>
            <span className="value">{priceInBaht.toLocaleString()} THB</span>
          </div>
        </div>

        <button className="continue-button" onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default Success;

import React from 'react';
import './Fail.css'; 
import { type Page } from '../../App';

const FailIcon = () => (
  <svg className="fail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
    <circle className="fail-circle" cx="26" cy="26" r="25" fill="none"/>
    <path className="fail-mark" d="M16 16 36 36 M36 16 16 36" />
  </svg>
);

interface FailProps {
  navigateTo: (page: Page) => void;
  errorMessage: string | null;
}

const Fail: React.FC<FailProps> = ({ navigateTo, errorMessage }) => {
  return (
    <div className="payment-result-container">
      <div className="card">
        <div className="icon-container">
          <FailIcon />
        </div>
        <h1 className="title-fail">Payment Failed</h1>
        <p className="subtitle">
          {errorMessage || "An unknown error occurred. Please try again."}
        </p>
        
        <hr className="divider" />
        
        <p className="subtitle">
          Your payment could not be processed. Please go back and try again.
        </p>

        <button className="fail-button" onClick={() => navigateTo('checkout')}>
          Try Again
        </button>
      </div>
    </div>
  );
};

export default Fail;

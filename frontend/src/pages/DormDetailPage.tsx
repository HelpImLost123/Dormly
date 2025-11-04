import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DormDetailPage.css';
import { FaStar } from 'react-icons/fa';
import {
  FiMapPin, FiHome, FiUser, FiNavigation,
  FiCheckCircle, FiCompass, FiLayers
} from 'react-icons/fi';

// (Type  จนกว่า Backend จะส่งข้อมูลมาครบ)
interface DormAPIResponse {
  dorm_id: number;
  dorm_name: string;
  description: string;
  lat: number;
  long: number;
  address: string;
  prov: string;
  dist: string;
  subdist: string;
  avg_score: number;
  likes: number;
  medias: string[];
  tel: string;
  
  // --- ข้อมูลที่ JOIN มา 
  room_types?: { rent_per_month: number }[];
  facilities?: { faci_name: string }[];
  reviews?: { user_id: number, content: string, score: number }[];
}

const initialDormData: DormAPIResponse = {
  dorm_id: 0,
  dorm_name: "Loading...",
  description: "Loading description...",
  lat: 0,
  long: 0,
  address: "Loading address...",
  prov: "...",
  dist: "...",
  subdist: "...",
  avg_score: 0,
  likes: 0,
  medias: ['https://images.unsplash.com/photo-1570129477490-d5e03a0c5b59?q=80&w=2000'],
  tel: "...",
  room_types: [{ rent_per_month: 0 }],
  facilities: [],
};

type ActiveTab = 'description' | 'amenities' | 'location';

const DormDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); 

  const [dormData, setDormData] = useState<DormAPIResponse>(initialDormData);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState(initialDormData.medias[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('description');

  useEffect(() => {
    if (!id) return;
    const fetchDormData = async () => {
      setIsLoading(true);
      try {
        // (ดึงข้อมูลจาก Backend ที่รันบน Port 3001)
        const response = await fetch(`http://localhost:3001/api/dorms/${id}`);
        if (!response.ok) throw new Error('Dorm not found');
        const result = await response.json(); 
        
        if (result.success && result.data) {
          setDormData(result.data);
          if (result.data.medias && result.data.medias.length > 0) {
            setMainImage(result.data.medias[0]);
          }
        } else {
          throw new Error(result.message || 'Failed to get data');
        }
      } catch (error) {
        console.error("Failed to fetch dorm data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDormData();
  }, [id]);

  
  const handleSubmitBooking = () => {
    // ตรวจสอบว่ามีข้อมูลหอพักและราคาก่อน
    if (!dormData || !dormData.room_types || dormData.room_types.length === 0) {
      alert("Error: Room data is missing.");
      return;
    }
    
    // (นำทางไปยัง Route '/payment' ที่เราตั้งไว้ใน App.tsx)
    // (พร้อม "ส่ง" ข้อมูลหอพักทั้งหมดไปด้วยใน 'state')
    navigate('/payment', { state: { dormData: dormData } });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return (
          <div className="tab-content description-tab">
            <h3>About this property</h3>
            <p>{dormData.description}</p>
            <h3>Property Details</h3>
            <ul className="details-list">
              <li><span className="detail-label">Address</span><span className="detail-value">{dormData.address}</span></li>
              <li><span className="detail-label">Province</span><span className="detail-value">{dormData.prov}</span></li>
              <li><span className="detail-label">District</span><span className="detail-value">{dormData.dist}</span></li>
            </ul>
            <h3>Nearby Places</h3>
            <ul className="nearby-list">
              <li><FiNavigation /><span>BTS Phra Khanong</span><span className="distance">500m</span></li>
            </ul>
          </div>
        );
      case 'amenities':
        return (
          <ul className="tab-content amenities-grid">
            {dormData.facilities && dormData.facilities.length > 0 ? (
              dormData.facilities.map((faci: any) => (
                <li key={faci.faci_name}><FiCheckCircle /> {faci.faci_name}</li>
              ))
            ) : (
              <li>No amenities listed.</li>
            )}
          </ul>
        );
      case 'location':
        return (
          <div className="tab-content location-content">
            <p><FiMapPin /> {dormData.address}</p>
            <div className="map-placeholder">
              [Map Placeholder - Lat: {dormData.lat}, Long: {dormData.long}]
            </div>
          </div>
        );
      default: return null;
    }
  };

  if (isLoading) {
    return <div className="loading-container">Loading Dorm Details...</div>;
  }
  
  return (
    <div className="dorm-detail-container v2">
      <section className="gallery-header">
        <div className="header-info">
          <h1 className="title">{dormData.dorm_name}</h1>
          <div className="sub-header">
            <FiMapPin /> {`${dormData.dist}, ${dormData.prov}`}
            <span className="dot">·</span>
            <FaStar /> {dormData.avg_score} ({dormData.likes} likes)
          </div>
          <div className="key-features">
            <div className="feature-item"><FiHome /><span>Studio</span></div>
            <div className="feature-item"><FiUser /><span>1 Bathroom</span></div>
            <div className="feature-item"><FiLayers /><span>28 m²</span></div>
          </div>
        </div>

        <div className="image-gallery-v2">
          <div className="main-image">
            <img src={mainImage} alt="main dorm view" />
          </div>
          <div className="thumbnail-strip">
            {dormData.medias && dormData.medias.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`thumbnail ${index + 1}`}
                className={mainImage === imgSrc ? 'active' : ''}
                onClick={() => setMainImage(imgSrc)}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="content-layout">
        <div className="main-content">
          <nav className="tabs">
          </nav>
          <div className="tab-panel">
            {renderTabContent()}
          </div>
        </div>

        <div className="booking-card-wrapper">
          <div className="booking-card">
            <div className="price-info">
              <span className="price">
                {dormData.room_types && dormData.room_types.length > 0
                  ? dormData.room_types[0].rent_per_month.toLocaleString()
                  : 'N/A'
                } THB
              </span>
              <span className="price-label">/ month</span>
            </div>

            <div className="booking-form">
              <button className="reserve-button" onClick={handleSubmitBooking}>
                Reserve this Property
              </button>
            </div>
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default DormDetailPage;

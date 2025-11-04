import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';

interface Dorm {
  dorm_id: number;
  dorm_name: string;
  address: string;
  prov: string;
  dist: string;
  avg_score: number;
  likes: number;
  medias: string[]; 
  min_price: number; 
  available_rooms_count: number;
}

export default function HomePage() {

  const [recommendedDorms, setRecommendedDorms] = useState<Dorm[]>([]);
  const [bangkokDorms, setBangkokDorms] = useState<Dorm[]>([]);
  const [promoDorms, setPromoDorms] = useState<Dorm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  //  Fetch ข้อมูลจาก Backend เมื่อหน้าโหลด
  useEffect(() => {
    const fetchHomepageData = async () => {
      setIsLoading(true);
      try {
        // (ตรวจสอบว่า Backend รันที่ Port 3001)
        const API_URL = 'http://localhost:3001/api/dorms/search';

        const recRes = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
          })
        });
        const recData = await recRes.json();
        if (recData.success) setRecommendedDorms(recData.data);

  
        const bkkRes = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: 13.7563, // Bangkok center
            lng: 100.5018,
            radiusKm: 15
          })
        });
        const bkkData = await bkkRes.json();
        if (bkkData.success) setBangkokDorms(bkkData.data);

       
        const promoRes = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            priceMin: 1000,
            priceMax: 3500 
          })
        });
        const promoData = await promoRes.json();
        if (promoData.success) setPromoDorms(promoData.data);

      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomepageData();
  }, []); 

  const handleSearch = (value: string) => {
    console.log('Searching for:', value);
    navigate(`/search?q=${value}`);
  };


  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        <div className="mb-6 sm:mb-8">
          <SearchBar placeholder="search" onSearch={handleSearch} />
        </div>
        <div className="text-center text-gray-500 text-lg">
          Loading amazing dorms...
        </div>
      </div>
    );
  }


  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <style>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="mb-6 sm:mb-8">
        <SearchBar placeholder="search" onSearch={handleSearch} />
      </div>

      <div className="space-y-8 sm:space-y-10 lg:space-y-12">
        <ScrollableSection
          title="หอพักแนะนำรีวิวเพียบ"
          dorms={recommendedDorms}
        />
        <ScrollableSection
          title="หอพักแนะนำใกล้กลางกรุงเทพฯ"
          dorms={bangkokDorms}
        />
        <ScrollableSection
          title="หอพักราคาโปรโมชั่นไม่ควรพลาดเทอม"
          dorms={promoDorms}
        />
      </div>
    </div>
  );
}

interface ScrollableSectionProps {
  title: string;
  dorms: Dorm[];
}

function ScrollableSection({ title, dorms }: ScrollableSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ... (ฟังก์ชัน scrollLeft/scrollRight ไม่ต้องแก้)
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -450, behavior: 'smooth' });
    }
  };
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: 'smooth' });
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        <div className="flex gap-2">
          <button onClick={scrollLeft} className="bg-white hover:bg-gray-50 shadow-md rounded-full p-2.5 transition-all hover:scale-110" aria-label="Scroll left">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={scrollRight} className="bg-white hover:bg-gray-50 shadow-md rounded-full p-2.5 transition-all hover:scale-110" aria-label="Scroll right">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {/* ตรวจสอบว่ามีข้อมูลหรือไม่ */}
        {dorms.length > 0 ? (
          dorms.map((dorm) => (
            <div key={dorm.dorm_id} className="flex-shrink-0 w-96">
              <DormCard dorm={dorm} />
            </div>
          ))
        ) : (
          <div className="text-gray-400 pl-4">No dorms found for this section.</div>
        )}
      </div>
    </section>
  );
}

interface DormCardProps {
  dorm: Dorm;
}

function DormCard({ dorm }: DormCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dorms/${dorm.dorm_id}`);
  };

  // ตรวจสอบสถานะห้องว่าง
  const isAvailable = dorm.available_rooms_count > 0;
  
  //  ดึงรูปภาพ (ใช้รูปแรกใน medias, หรือใช้ placeholder ถ้าไม่มี)
  const imageUrl = (dorm.medias && dorm.medias.length > 0) 
    ? dorm.medias[0] 
    : 'https://placehold.co/384x216/e2e8f0/94a3b8?text=No+Image';

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]"
    >
      <div className="w-full h-[216px] bg-gray-300 rounded-t-2xl">
        {/* แสดงรูปจริง */}
        <img src={imageUrl} alt={dorm.dorm_name} className="w-full h-full object-cover" 
             onError={(e) => e.currentTarget.src = 'https://placehold.co/384x216/e2e8f0/94a3b8?text=Image+Error'} />
      </div>

      <div className="p-4">
        {/*  แสดงชื่อจริง (truncate ถ้าชื่อยาวไป) */}
        <h3 className="font-semibold text-lg mb-1.5 truncate" title={dorm.dorm_name}>{dorm.dorm_name}</h3>
        
        <div className="flex items-center justify-between mb-3">
          {/* แสดงที่อยู่จริง (truncate) */}
          <p className="text-gray-600 text-base truncate" title={dorm.address || `${dorm.dist}, ${dorm.prov}`}>
            {dorm.address || `${dorm.dist}, ${dorm.prov}`}
          </p>
          {/* แสดงสถานะจริง */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className={`w-2.5 h-2.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600 font-medium">
              {isAvailable ? 'ว่าง' : 'เต็ม'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex text-yellow-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            </div>
            {/*แสดงคะแนนและไลค์จริง */}
            <span className="text-sm text-gray-700 font-medium">
              {Number(dorm.avg_score).toFixed(1)} ({dorm.likes} likes)
            </span>
          </div>
          
          {/*แสดงราคาจริง */}
          <p className="font-bold text-lg">
            {dorm.min_price ? `${Number(dorm.min_price).toLocaleString()}/เดือน` : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}


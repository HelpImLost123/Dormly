-- Sprint-Focused Dummy Data: Users, Dorms, and Rooms
-- Optimized for search functionality testing with Thai coordinates
-- Some dorms are clustered, others are far apart for testing

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE "Rooms", "RoomTypes", "Dorms", "DormOwners", "Users" RESTART IDENTITY CASCADE;

-- ========================================
-- USERS DATA (Students + Dorm Owners)
-- ========================================

INSERT INTO "Users" (f_name, l_name, sex, national_id, email, username, password, profile_path) VALUES
-- Students (20 users)
('Somchai', 'Jaidee', 'Male', '1234567890123', 'somchai.student@email.com', 'somchai_s', 'password123', '/uploads/profiles/somchai.jpg'),
('Siriporn', 'Malee', 'Female', '2345678901234', 'siriporn.student@email.com', 'siriporn_s', 'password123', '/uploads/profiles/siriporn.jpg'),
('Niran', 'Thongchai', 'Male', '3456789012345', 'niran.student@email.com', 'niran_s', 'password123', '/uploads/profiles/niran.jpg'),
('Ploy', 'Suksai', 'Female', '4567890123456', 'ploy.student@email.com', 'ploy_s', 'password123', '/uploads/profiles/ploy.jpg'),
('Wichai', 'Rakdee', 'Male', '5678901234567', 'wichai.student@email.com', 'wichai_s', 'password123', '/uploads/profiles/wichai.jpg'),
('Apinya', 'Klahan', 'Female', '6789012345678', 'apinya.student@email.com', 'apinya_s', 'password123', '/uploads/profiles/apinya.jpg'),
('Thanit', 'Srisomsak', 'Male', '7890123456789', 'thanit.student@email.com', 'thanit_s', 'password123', '/uploads/profiles/thanit.jpg'),
('Pimchanok', 'Thanakit', 'Female', '8901234567890', 'pimchanok.student@email.com', 'pimchanok_s', 'password123', '/uploads/profiles/pimchanok.jpg'),
('Kritsada', 'Wongsiri', 'Male', '9012345678901', 'kritsada.student@email.com', 'kritsada_s', 'password123', '/uploads/profiles/kritsada.jpg'),
('Natthida', 'Chumpon', 'Female', '0123456789012', 'natthida.student@email.com', 'natthida_s', 'password123', '/uploads/profiles/natthida.jpg'),
('Kittiphong', 'Sawatdee', 'Male', '1122334455667', 'kittiphong.student@email.com', 'kittiphong_s', 'password123', '/uploads/profiles/kittiphong.jpg'),
('Pensri', 'Chaiyo', 'Female', '2233445566778', 'pensri.student@email.com', 'pensri_s', 'password123', '/uploads/profiles/pensri.jpg'),
('Somsak', 'Mongkol', 'Male', '3344556677889', 'somsak.student@email.com', 'somsak_s', 'password123', '/uploads/profiles/somsak.jpg'),
('Waranya', 'Siriwat', 'Female', '4455667788990', 'waranya.student@email.com', 'waranya_s', 'password123', '/uploads/profiles/waranya.jpg'),
('Theerawat', 'Paisal', 'Male', '5566778899001', 'theerawat.student@email.com', 'theerawat_s', 'password123', '/uploads/profiles/theerawat.jpg'),
('Sasithorn', 'Suwan', 'Female', '6677889900112', 'sasithorn.student@email.com', 'sasithorn_s', 'password123', '/uploads/profiles/sasithorn.jpg'),
('Jakarin', 'Thanakorn', 'Male', '7788990011223', 'jakarin.student@email.com', 'jakarin_s', 'password123', '/uploads/profiles/jakarin.jpg'),
('Nongluck', 'Phaisarn', 'Female', '8899001122334', 'nongluck.student@email.com', 'nongluck_s', 'password123', '/uploads/profiles/nongluck.jpg'),
('Pongsakorn', 'Wiset', 'Male', '9900112233445', 'pongsakorn.student@email.com', 'pongsakorn_s', 'password123', '/uploads/profiles/pongsakorn.jpg'),
('Sirilak', 'Maneerat', 'Female', '0011223344556', 'sirilak.student@email.com', 'sirilak_s', 'password123', '/uploads/profiles/sirilak.jpg'),

-- Dorm Owners (10 users)
('Amorn', 'Chaiyakul', 'Male', '1111111111111', 'amorn.owner@email.com', 'amorn_owner', 'password123', '/uploads/profiles/amorn.jpg'),
('Malee', 'Srisopha', 'Female', '2222222222222', 'malee.owner@email.com', 'malee_owner', 'password123', '/uploads/profiles/malee.jpg'),
('Chai', 'Thepthong', 'Male', '3333333333333', 'chai.owner@email.com', 'chai_owner', 'password123', '/uploads/profiles/chai.jpg'),
('Ornuma', 'Boonsri', 'Female', '4444444444444', 'ornuma.owner@email.com', 'ornuma_owner', 'password123', '/uploads/profiles/ornuma.jpg'),
('Vichit', 'Prasertsuk', 'Male', '5555555555555', 'vichit.owner@email.com', 'vichit_owner', 'password123', '/uploads/profiles/vichit.jpg'),
('Suchada', 'Maneekan', 'Female', '6666666666666', 'suchada.owner@email.com', 'suchada_owner', 'password123', '/uploads/profiles/suchada.jpg'),
('Preecha', 'Wongsawang', 'Male', '7777777777777', 'preecha.owner@email.com', 'preecha_owner', 'password123', '/uploads/profiles/preecha.jpg'),
('Jitlada', 'Suksamran', 'Female', '8888888888888', 'jitlada.owner@email.com', 'jitlada_owner', 'password123', '/uploads/profiles/jitlada.jpg'),
('Surachai', 'Thongdee', 'Male', '9999999999999', 'surachai.owner@email.com', 'surachai_owner', 'password123', '/uploads/profiles/surachai.jpg'),
('Wilaiwan', 'Chuchat', 'Female', '0000000000000', 'wilaiwan.owner@email.com', 'wilaiwan_owner', 'password123', '/uploads/profiles/wilaiwan.jpg');

-- Insert Dorm Owners
INSERT INTO "DormOwners" (user_id, bank_token) VALUES
(21, 'bank_token_001'), (22, 'bank_token_002'), (23, 'bank_token_003'), (24, 'bank_token_004'), (25, 'bank_token_005'),
(26, 'bank_token_006'), (27, 'bank_token_007'), (28, 'bank_token_008'), (29, 'bank_token_009'), (30, 'bank_token_010');

-- ========================================
-- FACILITIES DATA (Predetermined List)
-- ========================================

INSERT INTO "Facilities" (faci_name) VALUES
('WiFi'),
('Air Conditioning'),
('Parking'),
('Security Camera'),
('Laundry Service'),
('Fitness Center'),
('Swimming Pool'),
('24/7 Security Guard'),
('Elevator'),
('Key Card Access'),
('Common Area'),
('Refrigerator'),
('Water Heater'),
('Microwave'),
('Study Room'),
('Vending Machine'),
('Bike Parking'),
('Pet Friendly'),
('Convenience Store'),
('Restaurant/Cafe');

-- ========================================
-- DORMS DATA (Strategic Thai Locations)
-- ========================================

INSERT INTO "Dorms" (owner_id, dorm_name, water_cost_per_unit, power_cost_per_unit, description, lat, long, address, soi, moo, road, prov, dist, subdist, postal_code, medias, tel, line_id, avg_score, likes) VALUES

-- CLUSTER 1: Central Bangkok (Close to each other for testing)
(1, 'Central University Dorm', 15.50, 4.20, 'Modern dormitory located in the heart of Bangkok, just minutes away from major universities. Perfect for students seeking convenient access to campus and city amenities. Features spacious rooms with contemporary furnishings and high-speed internet connectivity.', 13.7563, 100.5018, '123 Phayathai Road', 'Soi 15', 'Moo 2', 'Phayathai Road', 'Bangkok', 'Phayathai', 'Wang Thonglang', 10400, '["central1.jpg", "central2.jpg"]', '02-123-4567', '@central_dorm', 4.2, 45),

(2, 'Bangkok Student Hub', 18.00, 3.80, 'A vibrant student community with excellent facilities and social spaces. Located near BTS station for easy commuting. Offers a perfect blend of study-friendly environment and recreational amenities. Regular community events foster networking among residents.', 13.7580, 100.5025, '456 Phayathai Road', 'Soi 12', 'Moo 1', 'Phayathai Road', 'Bangkok', 'Phayathai', 'Wang Thonglang', 10400, '["hub1.jpg", "hub2.jpg"]', '02-234-5678', '@student_hub', 4.5, 67),

(3, 'Victory Monument Residence', 16.75, 4.50, 'Affordable accommodation near Victory Monument with easy access to public transportation. Close to shopping malls, restaurants, and entertainment venues. Ideal for students who want to balance studies with city life. Clean, safe, and well-maintained property.', 13.7655, 100.5370, '789 Ratchawithi Road', 'Soi 3', 'Moo 3', 'Ratchawithi Road', 'Bangkok', 'Ratchathewi', 'Thanon Phaya Thai', 10400, '["victory1.jpg", "victory2.jpg"]', '02-345-6789', '@victory_res', 3.8, 23),

-- CLUSTER 2: Sukhumvit Area (Close cluster)
(4, 'Sukhumvit Student Lodge', 20.00, 3.95, 'Premium student accommodation in the trendy Sukhumvit area. Walking distance to international restaurants, cafes, and shopping centers. Features modern amenities and stylish interiors. Perfect for international students and those seeking upscale living.', 13.7307, 100.5418, '321 Sukhumvit Road', 'Soi 5', 'Moo 4', 'Sukhumvit Road', 'Bangkok', 'Watthana', 'Khlong Toei Nuea', 10110, '["sukh1.jpg", "sukh2.jpg"]', '02-456-7890', '@sukh_lodge', 4.7, 89),

(5, 'Asok Tower Dormitory', 14.25, 4.10, 'High-rise dormitory with stunning city views at Asok intersection. Excellent connectivity via BTS and MRT. Modern facilities with 24-hour security. Close to Terminal 21 mall and nightlife area. Great for students who want urban lifestyle convenience.', 13.7366, 100.5598, '654 Sukhumvit Road', 'Soi 21', 'Moo 5', 'Sukhumvit Road', 'Bangkok', 'Watthana', 'Khlong Toei Nuea', 10110, '["asok1.jpg", "asok2.jpg"]', '02-567-8901', '@asok_tower', 4.1, 56),

-- FAR LOCATIONS: For distance testing
(6, 'Thonburi Riverside Dorm', 17.50, 3.75, 'Peaceful riverside accommodation away from the hustle and bustle. Enjoy scenic river views and cool breeze. Traditional Thai atmosphere with modern comforts. Perfect for students who prefer quiet environment. Easy ferry access to city center.', 13.7278, 100.4886, '888 Charoen Krung Road', 'Soi 28', 'Moo 6', 'Charoen Krung Road', 'Bangkok', 'Bang Rak', 'Suriyawong', 10500, '["thon1.jpg", "thon2.jpg"]', '02-678-9012', '@riverside', 4.3, 78),

(7, 'Chatuchak Park Residence', 19.25, 4.35, 'Located next to the famous Chatuchak Weekend Market and park. Green surroundings with fresh air and jogging tracks. Close to Mo Chit BTS and MRT stations. Ideal for nature lovers who still want city access. Spacious rooms with park views.', 13.8307, 100.5418, '111 Lat Phrao Road', 'Soi 7', 'Moo 7', 'Lat Phrao Road', 'Bangkok', 'Chatuchak', 'Chatuchak', 10900, '["chat1.jpg", "chat2.jpg"]', '02-789-0123', '@park_res', 4.6, 92),

(8, 'Sathorn Business Dorm', 22.00, 3.50, 'Upscale dormitory in the business district of Sathorn. Professional environment perfect for graduate students and young professionals. Premium amenities including co-working spaces and meeting rooms. Close to embassies, international companies, and fine dining.', 13.7200, 100.5300, '999 Sathorn Road', 'Soi 10', 'Moo 8', 'Sathorn Road', 'Bangkok', 'Bang Rak', 'Silom', 10500, '["sat1.jpg", "sat2.jpg"]', '02-890-1234', '@sathorn_biz', 4.8, 134),

-- VERY FAR: Different provinces for extensive testing
(9, 'Chiang Mai University Dorm', 12.00, 3.20, 'Cozy mountain-side dormitory in the cultural capital of Northern Thailand. Cool climate year-round with beautiful mountain views. Walking distance to Chiang Mai University and Doi Suthep temple. Experience authentic Northern Thai culture and cuisine. Perfect for students seeking peaceful study environment.', 18.7883, 98.9853, '777 Huay Kaew Road', 'Soi 1', 'Moo 9', 'Huay Kaew Road', 'Chiang Mai', 'Mueang Chiang Mai', 'Suthep', 50200, '["cm1.jpg", "cm2.jpg"]', '053-123-456', '@cm_uni', 4.4, 67),

(10, 'Phuket Beach Dormitory', 25.00, 5.00, 'Luxury beachfront accommodation in tropical paradise. Wake up to ocean views and beach access. Perfect for students attending Prince of Songkla University Phuket Campus. Enjoy island lifestyle with water sports and beach activities. Modern facilities meet resort-style living.', 7.8804, 98.3923, '555 Thalang Road', 'Soi 13', 'Moo 10', 'Thalang Road', 'Phuket', 'Mueang Phuket', 'Talat Yai', 83000, '["phuket1.jpg", "phuket2.jpg"]', '076-234-567', '@phuket_beach', 4.9, 156);

-- ========================================
-- FACILITY ASSIGNMENTS FOR DORMS
-- ========================================

INSERT INTO "FacilityList" (dorm_id, faci_seq, faci_id) VALUES
-- Central University Dorm (ID: 1) - Basic facilities
(1, 1, 1),   -- WiFi
(1, 2, 2),   -- Air Conditioning
(1, 3, 3),   -- Parking
(1, 4, 4),   -- Security Camera
(1, 5, 5),   -- Laundry Service
(1, 6, 9),   -- Elevator
(1, 7, 10),  -- Key Card Access
(1, 8, 12),  -- Refrigerator
(1, 9, 13),  -- Water Heater

-- Bangkok Student Hub (ID: 2) - Premium facilities
(2, 1, 1),   -- WiFi
(2, 2, 2),   -- Air Conditioning
(2, 3, 3),   -- Parking
(2, 4, 4),   -- Security Camera
(2, 5, 5),   -- Laundry Service
(2, 6, 6),   -- Fitness Center
(2, 7, 8),   -- 24/7 Security Guard
(2, 8, 9),   -- Elevator
(2, 9, 10),  -- Key Card Access
(2, 10, 11), -- Common Area
(2, 11, 12), -- Refrigerator
(2, 12, 13), -- Water Heater
(2, 13, 15), -- Study Room
(2, 14, 16), -- Vending Machine

-- Victory Monument Residence (ID: 3) - Budget facilities
(3, 1, 1),   -- WiFi
(3, 2, 2),   -- Air Conditioning
(3, 3, 4),   -- Security Camera
(3, 4, 5),   -- Laundry Service
(3, 5, 12),  -- Refrigerator
(3, 6, 13),  -- Water Heater

-- Sukhumvit Student Lodge (ID: 4) - Luxury facilities
(4, 1, 1),   -- WiFi
(4, 2, 2),   -- Air Conditioning
(4, 3, 3),   -- Parking
(4, 4, 4),   -- Security Camera
(4, 5, 5),   -- Laundry Service
(4, 6, 6),   -- Fitness Center
(4, 7, 7),   -- Swimming Pool
(4, 8, 8),   -- 24/7 Security Guard
(4, 9, 9),   -- Elevator
(4, 10, 10), -- Key Card Access
(4, 11, 11), -- Common Area
(4, 12, 12), -- Refrigerator
(4, 13, 13), -- Water Heater
(4, 14, 14), -- Microwave
(4, 15, 15), -- Study Room
(4, 16, 19), -- Convenience Store
(4, 17, 20), -- Restaurant/Cafe

-- Asok Tower Dormitory (ID: 5) - Modern facilities
(5, 1, 1),   -- WiFi
(5, 2, 2),   -- Air Conditioning
(5, 3, 3),   -- Parking
(5, 4, 4),   -- Security Camera
(5, 5, 5),   -- Laundry Service
(5, 6, 6),   -- Fitness Center
(5, 7, 8),   -- 24/7 Security Guard
(5, 8, 9),   -- Elevator
(5, 9, 10),  -- Key Card Access
(5, 10, 12), -- Refrigerator
(5, 11, 13), -- Water Heater
(5, 12, 16), -- Vending Machine

-- Thonburi Riverside Dorm (ID: 6) - Riverside facilities
(6, 1, 1),   -- WiFi
(6, 2, 2),   -- Air Conditioning
(6, 3, 3),   -- Parking
(6, 4, 4),   -- Security Camera
(6, 5, 5),   -- Laundry Service
(6, 6, 8),   -- 24/7 Security Guard
(6, 7, 11),  -- Common Area
(6, 8, 12),  -- Refrigerator
(6, 9, 13),  -- Water Heater
(6, 10, 17), -- Bike Parking

-- Chatuchak Park Residence (ID: 7) - Park view facilities
(7, 1, 1),   -- WiFi
(7, 2, 2),   -- Air Conditioning
(7, 3, 3),   -- Parking
(7, 4, 4),   -- Security Camera
(7, 5, 5),   -- Laundry Service
(7, 6, 6),   -- Fitness Center
(7, 7, 8),   -- 24/7 Security Guard
(7, 8, 9),   -- Elevator
(7, 9, 10),  -- Key Card Access
(7, 10, 11), -- Common Area
(7, 11, 12), -- Refrigerator
(7, 12, 13), -- Water Heater
(7, 13, 15), -- Study Room
(7, 14, 17), -- Bike Parking

-- Sathorn Business Dorm (ID: 8) - Business facilities
(8, 1, 1),   -- WiFi
(8, 2, 2),   -- Air Conditioning
(8, 3, 3),   -- Parking
(8, 4, 4),   -- Security Camera
(8, 5, 5),   -- Laundry Service
(8, 6, 6),   -- Fitness Center
(8, 7, 7),   -- Swimming Pool
(8, 8, 8),   -- 24/7 Security Guard
(8, 9, 9),   -- Elevator
(8, 10, 10), -- Key Card Access
(8, 11, 11), -- Common Area
(8, 12, 12), -- Refrigerator
(8, 13, 13), -- Water Heater
(8, 14, 14), -- Microwave
(8, 15, 15), -- Study Room
(8, 16, 16), -- Vending Machine
(8, 17, 20), -- Restaurant/Cafe

-- Chiang Mai University Dorm (ID: 9) - Mountain facilities
(9, 1, 1),   -- WiFi
(9, 2, 2),   -- Air Conditioning
(9, 3, 3),   -- Parking
(9, 4, 4),   -- Security Camera
(9, 5, 5),   -- Laundry Service
(9, 6, 8),   -- 24/7 Security Guard
(9, 7, 11),  -- Common Area
(9, 8, 12),  -- Refrigerator
(9, 9, 13),  -- Water Heater
(9, 10, 15), -- Study Room
(9, 11, 17), -- Bike Parking

-- Phuket Beach Dormitory (ID: 10) - Beach resort facilities
(10, 1, 1),  -- WiFi
(10, 2, 2),  -- Air Conditioning
(10, 3, 3),  -- Parking
(10, 4, 4),  -- Security Camera
(10, 5, 5),  -- Laundry Service
(10, 6, 6),  -- Fitness Center
(10, 7, 7),  -- Swimming Pool
(10, 8, 8),  -- 24/7 Security Guard
(10, 9, 9),  -- Elevator
(10, 10, 10),-- Key Card Access
(10, 11, 11),-- Common Area
(10, 12, 12),-- Refrigerator
(10, 13, 13),-- Water Heater
(10, 14, 14),-- Microwave
(10, 15, 16),-- Vending Machine
(10, 16, 19),-- Convenience Store
(10, 17, 20);-- Restaurant/Cafe

-- ========================================
-- ROOM TYPES DATA
-- ========================================

INSERT INTO "RoomTypes" (dorm_id, room_type_name, room_type_desc, rent_per_month, rent_per_day) VALUES
-- Central University Dorm
(1, 'Standard Single', 'Basic single room with shared bathroom', 3200.00, 130.00),
(1, 'Deluxe Single', 'Single room with private bathroom', 3800.00, 155.00),
(1, 'Twin Room', 'Shared room for two students', 2900.00, 120.00),

-- Bangkok Student Hub  
(2, 'Economy Room', 'Budget-friendly accommodation', 2800.00, 115.00),
(2, 'Standard Room', 'Comfortable single room', 3500.00, 145.00),
(2, 'Premium Suite', 'Spacious room with kitchenette', 4500.00, 185.00),

-- Victory Monument Residence
(3, 'Single Room', 'Standard single occupancy', 3300.00, 135.00),
(3, 'Double Room', 'Room for two students', 3000.00, 125.00),

-- Sukhumvit Student Lodge
(4, 'Studio Apartment', 'Self-contained studio', 4200.00, 170.00),
(4, 'Shared Apartment', 'Shared living space', 3400.00, 140.00),

-- Asok Tower Dormitory
(5, 'Mini Studio', 'Compact studio unit', 3900.00, 160.00),
(5, 'Standard Single', 'Regular single room', 3600.00, 150.00),

-- Thonburi Riverside Dorm
(6, 'River View Room', 'Room with river view', 4000.00, 165.00),
(6, 'Garden View Room', 'Room facing garden', 3700.00, 155.00),

-- Chatuchak Park Residence
(7, 'Park View Single', 'Single room with park view', 3800.00, 160.00),
(7, 'Family Room', 'Large room for families', 5200.00, 210.00),

-- Sathorn Business Dorm
(8, 'Executive Room', 'Premium business accommodation', 5500.00, 220.00),
(8, 'Business Single', 'Professional single room', 4800.00, 195.00),

-- Chiang Mai University Dorm
(9, 'Mountain View Room', 'Room with mountain view', 2500.00, 100.00),
(9, 'Standard Room', 'Basic accommodation', 2200.00, 90.00),

-- Phuket Beach Dormitory
(10, 'Ocean View Suite', 'Premium suite with ocean view', 6000.00, 250.00),
(10, 'Beach Room', 'Standard room near beach', 4500.00, 180.00);

-- ========================================
-- ROOMS DATA (Multiple rooms per type)
-- ========================================

INSERT INTO "Rooms" (room_name, room_type_id, cur_occupancy, status) VALUES
-- Central University Dorm (Rooms 1-30)
('CU101', 1, 1, 'ห้องไม่ว่าง'), ('CU102', 1, 0, 'ห้องว่าง'), ('CU103', 1, 1, 'ห้องไม่ว่าง'), ('CU104', 1, 0, 'ห้องว่าง'), ('CU105', 1, 1, 'ห้องไม่ว่าง'),
('CU201', 2, 1, 'ห้องไม่ว่าง'), ('CU202', 2, 0, 'ห้องว่าง'), ('CU203', 2, 1, 'ห้องไม่ว่าง'), ('CU204', 2, 0, 'ห้องว่าง'), ('CU205', 2, 0, 'ห้องว่าง'),
('CU301', 3, 2, 'ห้องไม่ว่าง'), ('CU302', 3, 1, 'ห้องว่าง'), ('CU303', 3, 2, 'ห้องไม่ว่าง'), ('CU304', 3, 0, 'ห้องว่าง'), ('CU305', 3, 1, 'ห้องว่าง'),

-- Bangkok Student Hub (Rooms 16-30)
('BSH101', 4, 1, 'ห้องไม่ว่าง'), ('BSH102', 4, 0, 'ห้องว่าง'), ('BSH103', 4, 1, 'ห้องไม่ว่าง'), ('BSH104', 4, 0, 'ห้องว่าง'), ('BSH105', 4, 0, 'ห้องว่าง'),
('BSH201', 5, 1, 'ห้องไม่ว่าง'), ('BSH202', 5, 0, 'ห้องว่าง'), ('BSH203', 5, 1, 'ห้องไม่ว่าง'), ('BSH204', 5, 0, 'ห้องว่าง'), ('BSH205', 5, 1, 'ห้องไม่ว่าง'),
('BSH301', 6, 1, 'ห้องไม่ว่าง'), ('BSH302', 6, 0, 'ห้องว่าง'), ('BSH303', 6, 1, 'ห้องไม่ว่าง'), ('BSH304', 6, 0, 'ห้องว่าง'), ('BSH305', 6, 0, 'ห้องว่าง'),

-- Victory Monument Residence (Rooms 31-40)
('VM101', 7, 1, 'ห้องไม่ว่าง'), ('VM102', 7, 0, 'ห้องว่าง'), ('VM103', 7, 1, 'ห้องไม่ว่าง'), ('VM104', 7, 0, 'ห้องว่าง'), ('VM105', 7, 0, 'ห้องว่าง'),
('VM201', 8, 2, 'ห้องไม่ว่าง'), ('VM202', 8, 1, 'ห้องว่าง'), ('VM203', 8, 2, 'ห้องไม่ว่าง'), ('VM204', 8, 0, 'ห้องว่าง'), ('VM205', 8, 1, 'ห้องว่าง'),

-- Sukhumvit Student Lodge (Rooms 41-50)
('SSL101', 9, 1, 'ห้องไม่ว่าง'), ('SSL102', 9, 0, 'ห้องว่าง'), ('SSL103', 9, 1, 'ห้องไม่ว่าง'), ('SSL104', 9, 0, 'ห้องว่าง'), ('SSL105', 9, 0, 'ห้องว่าง'),
('SSL201', 10, 2, 'ห้องไม่ว่าง'), ('SSL202', 10, 1, 'ห้องว่าง'), ('SSL203', 10, 2, 'ห้องไม่ว่าง'), ('SSL204', 10, 0, 'ห้องว่าง'), ('SSL205', 10, 1, 'ห้องว่าง'),

-- Asok Tower Dormitory (Rooms 51-60)
('ATD101', 11, 1, 'ห้องไม่ว่าง'), ('ATD102', 11, 0, 'ห้องว่าง'), ('ATD103', 11, 1, 'ห้องไม่ว่าง'), ('ATD104', 11, 0, 'ห้องว่าง'), ('ATD105', 11, 0, 'ห้องว่าง'),
('ATD201', 12, 1, 'ห้องไม่ว่าง'), ('ATD202', 12, 0, 'ห้องว่าง'), ('ATD203', 12, 1, 'ห้องไม่ว่าง'), ('ATD204', 12, 0, 'ห้องว่าง'), ('ATD205', 12, 1, 'ห้องไม่ว่าง'),

-- Thonburi Riverside Dorm (Rooms 61-70)
('TRD101', 13, 1, 'ห้องไม่ว่าง'), ('TRD102', 13, 0, 'ห้องว่าง'), ('TRD103', 13, 1, 'ห้องไม่ว่าง'), ('TRD104', 13, 0, 'ห้องว่าง'), ('TRD105', 13, 0, 'ห้องว่าง'),
('TRD201', 14, 1, 'ห้องไม่ว่าง'), ('TRD202', 14, 0, 'ห้องว่าง'), ('TRD203', 14, 1, 'ห้องไม่ว่าง'), ('TRD204', 14, 0, 'ห้องว่าง'), ('TRD205', 14, 0, 'ห้องว่าง'),

-- Chatuchak Park Residence (Rooms 71-80)
('CPR101', 15, 1, 'ห้องไม่ว่าง'), ('CPR102', 15, 0, 'ห้องว่าง'), ('CPR103', 15, 1, 'ห้องไม่ว่าง'), ('CPR104', 15, 0, 'ห้องว่าง'), ('CPR105', 15, 0, 'ห้องว่าง'),
('CPR201', 16, 3, 'ห้องไม่ว่าง'), ('CPR202', 16, 0, 'ห้องว่าง'), ('CPR203', 16, 2, 'ห้องว่าง'), ('CPR204', 16, 0, 'ห้องว่าง'), ('CPR205', 16, 1, 'ห้องว่าง'),

-- Sathorn Business Dorm (Rooms 81-90)
('SBD101', 17, 1, 'ห้องไม่ว่าง'), ('SBD102', 17, 0, 'ห้องว่าง'), ('SBD103', 17, 1, 'ห้องไม่ว่าง'), ('SBD104', 17, 0, 'ห้องว่าง'), ('SBD105', 17, 0, 'ห้องว่าง'),
('SBD201', 18, 1, 'ห้องไม่ว่าง'), ('SBD202', 18, 0, 'ห้องว่าง'), ('SBD203', 18, 1, 'ห้องไม่ว่าง'), ('SBD204', 18, 0, 'ห้องว่าง'), ('SBD205', 18, 0, 'ห้องว่าง'),

-- Chiang Mai University Dorm (Rooms 91-100)
('CMU101', 19, 1, 'ห้องไม่ว่าง'), ('CMU102', 19, 0, 'ห้องว่าง'), ('CMU103', 19, 1, 'ห้องไม่ว่าง'), ('CMU104', 19, 0, 'ห้องว่าง'), ('CMU105', 19, 0, 'ห้องว่าง'),
('CMU201', 20, 1, 'ห้องไม่ว่าง'), ('CMU202', 20, 0, 'ห้องว่าง'), ('CMU203', 20, 1, 'ห้องไม่ว่าง'), ('CMU204', 20, 0, 'ห้องว่าง'), ('CMU205', 20, 0, 'ห้องว่าง'),

-- Phuket Beach Dormitory (Rooms 101-110)
('PBD101', 21, 1, 'ห้องไม่ว่าง'), ('PBD102', 21, 0, 'ห้องว่าง'), ('PBD103', 21, 1, 'ห้องไม่ว่าง'), ('PBD104', 21, 0, 'ห้องว่าง'), ('PBD105', 21, 0, 'ห้องว่าง'),
('PBD201', 22, 1, 'ห้องไม่ว่าง'), ('PBD202', 22, 0, 'ห้องว่าง'), ('PBD203', 22, 1, 'ห้องไม่ว่าง'), ('PBD204', 22, 0, 'ห้องว่าง'), ('PBD205', 22, 0, 'ห้องว่าง');

-- ========================================
-- DATA SUMMARY
-- ========================================

SELECT 'Sprint Data Generation Complete!' as status;

SELECT 
    'Users' as table_name, 
    COUNT(*) as record_count 
FROM "Users"
UNION ALL
SELECT 
    'Dorm Owners' as table_name, 
    COUNT(*) as record_count 
FROM "DormOwners"
UNION ALL
SELECT 
    'Dorms' as table_name, 
    COUNT(*) as record_count 
FROM "Dorms"
UNION ALL
SELECT 
    'Room Types' as table_name, 
    COUNT(*) as record_count 
FROM "RoomTypes"
UNION ALL
SELECT 
    'Rooms' as table_name, 
    COUNT(*) as record_count 
FROM "Rooms";

-- Quick test query for search functionality
SELECT 
    dorm_name,
    ROUND(lat::numeric, 4) as latitude,
    ROUND(long::numeric, 4) as longitude,
    prov as province,
    dist as district
FROM "Dorms" 
ORDER BY lat, long;
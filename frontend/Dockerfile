# frontend/Dockerfile
# --------------------
# นี่คือ Dockerfile สำหรับโหมด Development (Live Reload)
# --------------------
FROM node:20-alpine

WORKDIR /app

# Copy package.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# Copy โค้ดที่เหลือ (ไม่จำเป็นต้อง Build)
COPY . .

# เปิด Port ของ Vite (5173)
EXPOSE 5173

# คำสั่ง default (Vite จะรันที่ 0.0.0.0 เพื่อให้ Docker เห็น)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
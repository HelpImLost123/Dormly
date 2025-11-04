export default function DormOwnerDashboard() {
  const recentActivities = [
    { id: 1, date: '20/12/2568', message: 'รายละเอียดการยกเว้นกฎ' },
    { id: 2, date: '20/12/2568', message: 'รายละเอียดการยกเว้นกฎ' },
    { id: 3, date: '20/12/2568', message: 'รายละเอียดการยกเว้นกฎ' },
    { id: 4, date: '20/12/2568', message: 'รายละเอียดการยกเว้นกฎ' },
    { id: 5, date: '20/12/2568', message: 'รายละเอียดการยกเว้นกฎ' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard />
            <StatCard />
            <StatCard />
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-4">กราฟแสดงรายการเข้า</h2>
            <div className="h-48 sm:h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-sm sm:text-base">Chart Placeholder</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-4">สถานะหอพัก</h2>
            <div className="space-y-3">
              <StatusItem />
              <StatusItem />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold mb-4">ประวัติคลิกผู้เข้า</h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="relative">
              <input
                type="text"
                placeholder="message"
                className="w-full px-4 py-2 sm:py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard() {
  return (
    <div className="bg-gray-100 rounded-xl p-4 sm:p-6 h-24 sm:h-32">
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400 text-sm sm:text-base">Stat Card</p>
      </div>
    </div>
  );
}

function StatusItem() {
  return (
    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 h-14 sm:h-16">
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400 text-xs sm:text-sm">Status Item</p>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  activity: {
    id: number;
    date: string;
    message: string;
  };
}

function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="bg-gray-100 rounded-lg p-3 sm:p-4 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-xs sm:text-sm font-medium mb-1">{activity.date}</p>
        <p className="text-xs text-gray-600 line-clamp-1">{activity.message}</p>
      </div>
      <button className="text-gray-400 hover:text-gray-600 ml-2">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
    </div>
  );
}
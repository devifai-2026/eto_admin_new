import { FiUser, FiTrendingUp, FiNavigation } from "react-icons/fi";
import { FaIndianRupeeSign } from "react-icons/fa6";

const StatsCards = ({ summary }) => {
  const stats = [
    {
      title: "Total Drivers",
      value: summary?.totalDrivers || 0,
      icon: <FiUser className="text-2xl sm:text-3xl text-blue-200" />,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
    },
    {
      title: "Active Drivers",
      value: summary?.totalActiveDrivers || 0,
      icon: <FiTrendingUp className="text-2xl sm:text-3xl text-green-200" />,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
    },
    {
      title: "Total Earnings",
      value: `₹${(summary?.totalEarnings || 0).toLocaleString()}`,
      icon: (
        <FaIndianRupeeSign className="text-2xl sm:text-3xl text-purple-200" />
      ),
      gradient: "from-purple-500 to-purple-600",
      textColor: "text-purple-100",
    },
    {
      title: "Total Rides",
      value: summary?.totalRides || 0,
      icon: <FiNavigation className="text-2xl sm:text-3xl text-orange-200" />,
      gradient: "from-orange-500 to-orange-600",
      textColor: "text-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`bg-gradient-to-r ${stat.gradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`${stat.textColor} text-xs sm:text-sm`}>
                {stat.title}
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

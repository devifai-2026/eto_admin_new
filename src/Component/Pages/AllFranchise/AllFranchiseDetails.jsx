import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiHome, 
    FiGlobe,
    FiCreditCard,
    FiDollarSign,
    FiFileText,
    FiCalendar,
    FiArrowLeft,
    FiEdit,
    FiUsers
} from "react-icons/fi";
import { TbKeyframeAlignCenter } from "react-icons/tb";
import { Helmet } from 'react-helmet';

const AllFranchiseDetails = () => {
    const { franchiseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const franchise = location.state?.franchise || 
        {
            id: franchiseId,
            name: `Franchise ${franchiseId}`,
            email: `franchise${franchiseId}@example.com`,
            contactNo: '+91 9876543210',
            address: {
                street: '123 Main Street',
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
                pincode: '400001',
                landmark: 'Near Central Park'
            },
            bankDetails: {
                accountNo: '123456789012',
                ifscCode: 'SBIN0000123',
                branchName: 'Main Branch',
                accountHolderName: 'Franchise Owner'
            },
            totalEarnings: 75000,
            totalRides: 150,
            status: 'active',
            joinDate: new Date('2024-01-15').toISOString(),
            documents: {
                aadhar: 'AADHAR123456',
                pan: 'ABCDE1234F',
                tradeLicense: 'TL2024001'
            },
            identityDocuments: [
                { name: 'aadhar_front.jpg', size: 2.1 },
                { name: 'aadhar_back.jpg', size: 2.2 },
                { name: 'pan_card.pdf', size: 1.5 }
            ],
            tradeLicense: { name: 'trade_license.pdf', size: 3.2 }
        };

    const handleBack = () => {
        navigate('/all-franchise');
    };

    const handleEdit = () => {
        console.log('Edit franchise:', franchise);
    };

    const handleViewAllDrivers = () => {
        navigate(`/franchise-drivers/${franchiseId}`, {
            state: { 
                franchise: franchise,
                franchiseName: franchise.name
            }
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-green-100 text-green-800 border border-green-300",
            inactive: "bg-red-100 text-red-800 border border-red-300",
            pending: "bg-yellow-100 text-yellow-800 border border-yellow-300"
        };
        return styles[status] || styles.pending;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (!franchise) {
        return (
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-8 sm:py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">❌</div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Franchise Not Found
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                            The franchise you're looking for doesn't exist.
                        </p>
                        <button
                            onClick={handleBack}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base"
                        >
                            Back to Franchises
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
               <Helmet>
        <title>Admin | All Franchise Details</title>
      </Helmet>
            <div className="max-w-6xl mx-auto">
               {/* Header Section */}
<div className="mb-6 sm:mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center">
            <button
                onClick={handleBack}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm sm:text-base"
            >
                <FiArrowLeft size={18} />
                <span className="hidden xs:inline">Back to Franchises</span>
                <span className="xs:hidden">Back</span>
            </button>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
            <button
                onClick={handleViewAllDrivers}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
                <FiUsers size={14} />
                <span className="hidden xs:inline">All Drivers</span>
                <span className="xs:hidden">Drivers</span>
            </button>
            <button
                onClick={handleEdit}
                className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
                <FiEdit size={14} />
                <span>Edit</span>
            </button>
        </div>
    </div>

    <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
            <FiUser size={18} className="sm:w-6 sm:h-6" />
        </div>
        <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {franchise.name}
            </h1>
            {/* SIMPLIFIED: Just use flex row without complex breakpoints */}
            <div className="flex items-center gap-3 mt-1 sm:mt-2">
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    ID: {franchise.id}
                </span>
                <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(franchise.status)} whitespace-nowrap flex-shrink-0`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 sm:mr-2 ${
                        franchise.status === 'active' ? 'bg-green-500' : 
                        franchise.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></span>
                    {franchise.status.charAt(0).toUpperCase() + franchise.status.slice(1)}
                </span>
            </div>
        </div>
    </div>
</div>

                {/* Stats Cards */}
             
<div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Earnings</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                    ₹{franchise.totalEarnings?.toLocaleString() || '0'}
                </p>
            </div>
            <FiDollarSign className="text-lg sm:text-xl lg:text-2xl text-green-500 flex-shrink-0 ml-2" />
        </div>
    </div>

    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Total Rides</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {franchise.totalRides || '0'}
                </p>
            </div>
            <TbKeyframeAlignCenter className="text-lg sm:text-xl lg:text-2xl text-blue-500 flex-shrink-0 ml-2" />
        </div>
    </div>

    {/* Remove xs:col-span-2 to prevent full width on mobile */}
    <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">Member Since</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {formatDate(franchise.joinDate)}
                </p>
            </div>
            <FiCalendar className="text-lg sm:text-xl lg:text-2xl text-purple-500 flex-shrink-0 ml-2" />
        </div>
    </div>
</div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Column */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center space-x-2">
                                <FiUser className="text-blue-600 flex-shrink-0" size={18} />
                                <span>Basic Information</span>
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Full Name
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium truncate">
                                            {franchise.name}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Email Address
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2 min-w-0">
                                            <FiMail className="text-gray-400 flex-shrink-0" size={14} />
                                            <span className="truncate">{franchise.email}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Contact Number
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                        <FiPhone className="text-gray-400 flex-shrink-0" size={14} />
                                        <span>{franchise.contactNo}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center space-x-2">
                                <FiMapPin className="text-green-600 flex-shrink-0" size={18} />
                                <span>Address Information</span>
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Street Address
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                        <FiHome className="text-gray-400 flex-shrink-0" size={14} />
                                        <span>{franchise.address.street}</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            City
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                            {franchise.address.city}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            State
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                            {franchise.address.state}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Country
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                            <FiGlobe className="text-gray-400 flex-shrink-0" size={14} />
                                            <span>{franchise.address.country}</span>
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            PIN Code
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                            {franchise.address.pincode}
                                        </p>
                                    </div>
                                </div>
                                {franchise.address.landmark && (
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Landmark
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                            {franchise.address.landmark}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Bank Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center space-x-2">
                                <FiCreditCard className="text-purple-600 flex-shrink-0" size={18} />
                                <span>Bank Account Information</span>
                            </h3>
                            <div className="space-y-3 sm:space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Account Holder Name
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                        {franchise.bankDetails.accountHolderName}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Account Number
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium font-mono">
                                            {franchise.bankDetails.accountNo}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            IFSC Code
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium font-mono">
                                            {franchise.bankDetails.ifscCode}
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Branch Name
                                    </label>
                                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                                        {franchise.bankDetails.branchName}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center space-x-2">
                                <FiFileText className="text-orange-600 flex-shrink-0" size={18} />
                                <span>Documents</span>
                            </h3>
                            <div className="space-y-4">
                                {/* Identity Documents */}
                                <div>
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Identity Documents
                                    </h4>
                                    <div className="space-y-2">
                                        {franchise.identityDocuments?.map((doc, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                                    <FiFileText className="text-blue-500 flex-shrink-0" size={14} />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                                            {doc.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {doc.size} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex-shrink-0 ml-2">
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Trade License */}
                                <div>
                                    <h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Trade License
                                    </h4>
                                    {franchise.tradeLicense && (
                                        <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                                <FiFileText className="text-green-500 flex-shrink-0" size={14} />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {franchise.tradeLicense.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {franchise.tradeLicense.size} MB
                                                    </p>
                                                </div>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex-shrink-0 ml-2">
                                                View
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Document IDs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Aadhar Number
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium font-mono">
                                            {franchise.documents.aadhar}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                                            PAN Number
                                        </label>
                                        <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium font-mono">
                                            {franchise.documents.pan}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllFranchiseDetails;
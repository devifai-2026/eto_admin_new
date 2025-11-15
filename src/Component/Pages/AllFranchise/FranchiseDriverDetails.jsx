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
    FiArrowLeft,
    FiEdit,
    FiNavigation,
    FiShield,
    FiCheckCircle,
    FiXCircle,
    FiTruck
} from "react-icons/fi";
import { Helmet } from 'react-helmet';

const FranchiseDriverDetails = () => {
    const { driverId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const { driver, franchiseId, franchiseName } = location.state || {};

    // Dummy driver data with complete details
    const driverDetails = driver || {
        _id: driverId,
        name: "Rajesh Kumar",
        phone: "+91 9876543210",
        email: "rajesh@example.com",
        driver_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        isActive: true,
        total_earning: 22500,
        total_complete_rides: 45,
        total_cancelled_rides: 3,
        average_rating: 4.5,
        etoCard: { 
            eto_id_num: "ETO001",
            expiry_date: "2025-12-31"
        },
        createdAt: "2024-01-15",
        vehicle: {
            type: "Toyota Etios",
            number: "MH01AB1234",
            color: "White",
            model_year: 2022,
            registration_date: "2022-03-15"
        },
        address: {
            street: "456 Driver Street",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India",
            pincode: "400001",
            landmark: "Near Driver Plaza"
        },
        documents: {
            license: "DL12345678901234",
            aadhar: "1234 5678 9012",
            pan: "ABCDE1234F",
            rc: "RC/MH/01/123456/2022"
        },
        bankDetails: {
            accountNo: "987654321012",
            ifscCode: "SBIN0000123",
            branchName: "Main Branch",
            accountHolderName: "Rajesh Kumar"
        },
        status: "verified",
        last_active: "2024-03-20T10:30:00Z"
    };

    const handleBack = () => {
        navigate(`/franchise-drivers/${franchiseId}`, { 
            state: { franchiseId, franchiseName } 
        });
    };

    const handleEdit = () => {
        console.log('Edit driver:', driverDetails);
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-green-100 text-green-800 border border-green-300",
            inactive: "bg-red-100 text-red-800 border border-red-300",
            pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
            verified: "bg-blue-100 text-blue-800 border border-blue-300"
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

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!driverDetails) {
        return (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-12">
                        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Driver Not Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            The driver you're looking for doesn't exist.
                        </p>
                        <button
                            onClick={handleBack}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Back to Drivers
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
                  <Helmet>
        <title>Admin | Franchise Driver Details</title>
      </Helmet>
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <FiArrowLeft size={20} />
                                <span>Back to Drivers</span>
                            </button>
                            {franchiseName && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    Franchise: {franchiseName}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleEdit}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <FiEdit size={16} />
                                <span>Edit</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                            <img
                                className="w-16 h-16 rounded-full object-cover border-2 border-white"
                                src={driverDetails.driver_photo}
                                alt={driverDetails.name}
                            />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {driverDetails.name}
                            </h1>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="text-gray-600 dark:text-gray-400">
                                    ID: {driverDetails._id}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(driverDetails.status)}`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        driverDetails.isActive ? 'bg-green-500' : 'bg-red-500'
                                    }`}></span>
                                    {driverDetails.isActive ? "Active" : "Inactive"}
                                </span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge('verified')}`}>
                                    <FiShield size={14} className="mr-1" />
                                    Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    ₹{driverDetails.total_earning?.toLocaleString() || '0'}
                                </p>
                            </div>
                            <FiDollarSign className="text-2xl text-green-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rides</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {driverDetails.total_complete_rides || '0'}
                                </p>
                            </div>
                            <FiNavigation className="text-2xl text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cancelled Rides</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {driverDetails.total_cancelled_rides || '0'}
                                </p>
                            </div>
                            <FiXCircle className="text-2xl text-red-500" />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {driverDetails.average_rating || '0'}/5
                                </p>
                            </div>
                            <FiCheckCircle className="text-2xl text-yellow-500" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiUser className="text-blue-600" />
                                <span>Basic Information</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Full Name
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.name}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Email Address
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                            <FiMail className="text-gray-400" size={16} />
                                            <span>{driverDetails.email}</span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Contact Number
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                        <FiPhone className="text-gray-400" size={16} />
                                        <span>{driverDetails.phone}</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Member Since
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {formatDate(driverDetails.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Last Active
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.last_active ? formatDateTime(driverDetails.last_active) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiTruck className="text-green-600" />
                                <span>Vehicle Information</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Vehicle Type
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.vehicle?.type || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Vehicle Number
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.vehicle?.number || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Color
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.vehicle?.color || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Model Year
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.vehicle?.model_year || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Registration Date
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {driverDetails.vehicle?.registration_date ? formatDate(driverDetails.vehicle.registration_date) : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiMapPin className="text-purple-600" />
                                <span>Address Information</span>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Street Address
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                        <FiHome className="text-gray-400" size={16} />
                                        <span>{driverDetails.address?.street || '-'}</span>
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            City
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.address?.city || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            State
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.address?.state || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Country
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                                            <FiGlobe className="text-gray-400" size={16} />
                                            <span>{driverDetails.address?.country || '-'}</span>
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            PIN Code
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.address?.pincode || '-'}
                                        </p>
                                    </div>
                                </div>
                                {driverDetails.address?.landmark && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Landmark
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.address.landmark}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* ETO Card Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiCreditCard className="text-orange-600" />
                                <span>ETO Card Information</span>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        ETO ID Number
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {driverDetails.etoCard?.eto_id_num || '-'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Expiry Date
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {driverDetails.etoCard?.expiry_date ? formatDate(driverDetails.etoCard.expiry_date) : '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiCreditCard className="text-purple-600" />
                                <span>Bank Account Information</span>
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Account Holder Name
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {driverDetails.bankDetails?.accountHolderName || '-'}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Account Number
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.bankDetails?.accountNo || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            IFSC Code
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.bankDetails?.ifscCode || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                        Branch Name
                                    </label>
                                    <p className="text-gray-900 dark:text-white font-medium">
                                        {driverDetails.bankDetails?.branchName || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                <FiFileText className="text-red-600" />
                                <span>Document Details</span>
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Driving License
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.documents?.license || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Aadhar Number
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.documents?.aadhar || '-'}
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            PAN Number
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.documents?.pan || '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            RC Number
                                        </label>
                                        <p className="text-gray-900 dark:text-white font-medium">
                                            {driverDetails.documents?.rc || '-'}
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

export default FranchiseDriverDetails;
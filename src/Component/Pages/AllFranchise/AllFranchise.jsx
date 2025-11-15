import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
    FiPlus, 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiMapPin,
    FiCreditCard,
    FiDollarSign,
    FiTrendingUp,
    FiEye,
    FiEdit,
    FiTrash2,
    FiMoreVertical,
    FiX,
    FiSearch,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiHome,
    FiGlobe
} from "react-icons/fi";
import { TbKeyframeAlignCenter } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const AllFranchise = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [activeMenu, setActiveMenu] = useState(null);
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedFranchise, setSelectedFranchise] = useState(null);
    const itemsPerPage = 10;

    // Generate 20 dummy franchise data
    const dummyFranchises = Array.from({ length: 20 }, (_, index) => ({
        id: `FRN${String(index + 1).padStart(4, '0')}`,
        name: `Franchise ${index + 1}`,
        email: `franchise${index + 1}@example.com`,
        contactNo: `+91 ${9876500000 + index}`,
        address: {
            city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][index % 5],
            state: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal'][index % 5],
            pincode: `${400000 + index}`
        },
        bankDetails: {
            accountNo: `123456789${index}`,
            ifscCode: `SBIN0000${index}`
        },
        totalEarnings: (50000 + (index * 2500)),
        totalRides: (100 + (index * 10)),
        status: ['active', 'inactive', 'pending'][index % 3],
        joinDate: new Date(2024, index % 12, (index % 28) + 1).toISOString(),
        documents: {
            aadhar: `AADHAR${index}`,
            pan: `PAN${index}`,
            tradeLicense: `TL${index}`
        }
    }));

    const [franchises] = useState(dummyFranchises);
    const [filteredFranchises, setFilteredFranchises] = useState(dummyFranchises);

    // Filter franchises
    React.useEffect(() => {
        let result = [...franchises];

        // Apply search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter((franchise) =>
                franchise.name.toLowerCase().includes(term) ||
                franchise.email.toLowerCase().includes(term) ||
                franchise.contactNo.includes(term) ||
                franchise.id.toLowerCase().includes(term)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            result = result.filter((franchise) => franchise.status === statusFilter);
        }

        setFilteredFranchises(result);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, franchises]);

    // Pagination
    const totalPages = Math.ceil(filteredFranchises.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFranchises = filteredFranchises.slice(startIndex, startIndex + itemsPerPage);

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    // Action handlers
    const handleViewDetails = (franchise) => {
        navigate(`/franchise-details/${franchise.id}`, { state: { franchise } });
    };

    const handleEdit = (franchise) => {
        console.log('Edit franchise:', franchise);
        setShowActionModal(false);
        // Implement edit logic here
    };

    const handleDelete = (franchise) => {
        if (window.confirm(`Are you sure you want to delete ${franchise.name}? This action cannot be undone.`)) {
            console.log('Delete franchise:', franchise);
            setShowActionModal(false);
            // Implement delete logic here
        }
    };

    const handleAddPincode = (franchise) => {
        // Navigate to AddPinCode page with franchise data
        navigate(`/add-pinCode/${franchise.id}`, { state: { franchise } });
        setShowActionModal(false);
    };

    const openActionMenu = (franchiseId, event) => {
        event.stopPropagation();
        setActiveMenu(activeMenu === franchiseId ? null : franchiseId);
    };

    const openActionModal = (franchise) => {
        setSelectedFranchise(franchise);
        setShowActionModal(true);
        setActiveMenu(null);
    };

    const getStatusBadge = (status) => {
        const styles = {
            active: "bg-green-100 text-green-800 border border-green-300",
            inactive: "bg-red-100 text-red-800 border border-red-300",
            pending: "bg-yellow-100 text-yellow-800 border border-yellow-300"
        };
        return styles[status] || styles.pending;
    };

    const getTotalEarnings = () => {
        return franchises.reduce((sum, franchise) => sum + franchise.totalEarnings, 0);
    };

    const getTotalRides = () => {
        return franchises.reduce((sum, franchise) => sum + franchise.totalRides, 0);
    };

    const getStatusCount = (status) => {
        return franchises.filter((franchise) => franchise.status === status).length;
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
              <Helmet>
        <title>Admin | All Franchise</title>
      </Helmet>
            <div className="max-w-full mx-auto">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <TbKeyframeAlignCenter className="text-2xl sm:text-3xl text-blue-600" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                            All Franchises
                        </h1>
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Manage and monitor all franchise partners in the system
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-xs sm:text-sm">Total Franchises</p>
                                <p className="text-lg sm:text-2xl font-bold mt-1">{franchises.length}</p>
                            </div>
                            <FiUser className="text-xl sm:text-3xl text-blue-200" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-xs sm:text-sm">Active Franchises</p>
                                <p className="text-lg sm:text-2xl font-bold mt-1">
                                    {getStatusCount("active")}
                                </p>
                            </div>
                            <FiTrendingUp className="text-xl sm:text-3xl text-green-200" />
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-xs sm:text-sm">Total Earnings</p>
                                <p className="text-lg sm:text-2xl font-bold mt-1">
                                    ₹{getTotalEarnings().toLocaleString()}
                                </p>
                            </div>
                            <FiDollarSign className="text-xl sm:text-3xl text-purple-200" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-xs sm:text-sm">Total Rides</p>
                                <p className="text-lg sm:text-2xl font-bold mt-1">
                                    {getTotalRides()}
                                </p>
                            </div>
                            <FiHome className="text-xl sm:text-3xl text-orange-200" />
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex items-center gap-2">
                            <FiFilter className="text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 lg:w-80">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search franchises..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setSearchTerm("")}
                                    >
                                        <FiX size={16} />
                                    </button>
                                )}
                            </div>

                            <select
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                                <option value="pending">Pending Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-600">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Franchise List ({filteredFranchises.length} franchises)
                        </h2>
                    </div>

                    {/* Mobile Cards */}
                   {/* Mobile Cards */}
<div className="sm:hidden">
    {currentFranchises.map((franchise) => (
        <div 
            key={franchise.id} 
            className="border-b border-gray-200 dark:border-gray-600 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 relative" // Added 'relative' class here
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                        <FiUser size={16} />
                    </div>
                    <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {franchise.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {franchise.id}
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(franchise.status)}`}>
                            <span className={`w-2 h-2 rounded-full mr-1 ${
                                franchise.status === 'active' ? 'bg-green-500' : 
                                franchise.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></span>
                            {franchise.status.charAt(0).toUpperCase() + franchise.status.slice(1)}
                        </div>
                    </div>
                </div>
                <button
                    onClick={(e) => openActionMenu(franchise.id, e)}
                    className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    title="More Actions"
                >
                    <FiMoreVertical size={14} />
                </button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Email</div>
                    <div className="text-gray-900 dark:text-white truncate">
                        {franchise.email}
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Phone</div>
                    <div className="text-gray-900 dark:text-white">
                        {franchise.contactNo}
                    </div>
                </div>
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">Location</div>
                    <div className="text-gray-900 dark:text-white">
                        {franchise.address.city}, {franchise.address.state}
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">PIN Code</div>
                    <div className="text-gray-900 dark:text-white">
                        {franchise.address.pincode}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={() => handleViewDetails(franchise)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-medium"
                >
                    <FiEye size={12} className="mr-1" />
                    View
                </button>
                <button
                    onClick={() => handleAddPincode(franchise)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-xs font-medium"
                >
                    <FiMapPin size={12} className="mr-1" />
                    Add Pincode
                </button>
            </div>

            {/* Dropdown Menu - Updated with better positioning and z-index */}
            {activeMenu === franchise.id && (
                <div className="absolute right-4 top-16 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50"> {/* Changed top position and increased z-index */}
                    <button 
                        onClick={() => handleViewDetails(franchise)} 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <FiEye size={14} /><span>View Details</span>
                    </button>
                    <button 
                        onClick={() => handleEdit(franchise)} 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <FiEdit size={14} /><span>Edit</span>
                    </button>
                    <button 
                        onClick={() => handleAddPincode(franchise)} 
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <FiMapPin size={14} /><span>Add Pincode</span>
                    </button>
                    <button 
                        onClick={() => handleDelete(franchise)} 
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                    >
                        <FiTrash2 size={14} /><span>Delete</span>
                    </button>
                </div>
            )}
        </div>
    ))}
</div>

                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Franchise
                                    </th>
                                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {currentFranchises.map((franchise) => (
                                    <tr key={franchise.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                        {/* Franchise Info */}
                                        <td className="px-4 lg:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white">
                                                    <FiUser size={20} />
                                                </div>
                                                <div className="ml-3 lg:ml-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {franchise.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        ID: {franchise.id}
                                                    </div>
                                                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusBadge(franchise.status)}`}>
                                                        <span className={`w-2 h-2 rounded-full mr-1 ${
                                                            franchise.status === 'active' ? 'bg-green-500' : 
                                                            franchise.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}></span>
                                                        {franchise.status.charAt(0).toUpperCase() + franchise.status.slice(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-4 lg:px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {franchise.email}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {franchise.contactNo}
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-4 lg:px-6 py-4">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {franchise.address.city}, {franchise.address.state}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                PIN: {franchise.address.pincode}
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 lg:px-6 py-4">
                                            <div className="flex flex-col items-center space-y-2">
                                                {/* Three dots menu */}
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => openActionMenu(franchise.id, e)}
                                                        className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                                        title="More Actions"
                                                    >
                                                        <FiMoreVertical size={16} />
                                                    </button>
                                                    
                                                    {/* Dropdown Menu */}
                                                    {activeMenu === franchise.id && (
                                                        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                                                            <button 
                                                                onClick={() => handleViewDetails(franchise)} 
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                            >
                                                                <FiEye size={14} /><span>View Details</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleEdit(franchise)} 
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                            >
                                                                <FiEdit size={14} /><span>Edit</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleAddPincode(franchise)} 
                                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                            >
                                                                <FiMapPin size={14} /><span>Add Pincode</span>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(franchise)} 
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                            >
                                                                <FiTrash2 size={14} /><span>Delete</span>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredFranchises.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-3 sm:mb-4">🏢</div>
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                                No franchises found
                            </h3>
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                                {searchTerm || statusFilter !== 'all' 
                                    ? "Try adjusting your search or filters" 
                                    : "No franchises are currently registered"}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-600">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                                    <span className="font-medium">
                                        {Math.min(startIndex + itemsPerPage, filteredFranchises.length)}
                                    </span>{" "}
                                    of <span className="font-medium">{filteredFranchises.length}</span> results
                                </p>
                                
                                <div className="flex items-center space-x-1">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
                                    >
                                        <FiChevronLeft size={14} className="mr-1" />
                                        <span className="hidden sm:inline">Previous</span>
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center space-x-1 mx-1 sm:mx-2">
                                        {getPageNumbers().map((page, index) => (
                                            page === '...' ? (
                                                <span key={`ellipsis-${index}`} className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    className={`px-2 sm:px-3 py-1 sm:py-2 border rounded-md text-xs sm:text-sm font-medium transition-colors ${
                                                        currentPage === page
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
                                    >
                                        <span className="hidden sm:inline">Next</span>
                                        <FiChevronRight size={14} className="ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Modal */}
            {showActionModal && selectedFranchise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Franchise Actions
                            </h3>
                            <button
                                onClick={() => setShowActionModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>
                        
                        <div className="p-6 space-y-4">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <FiUser className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {selectedFranchise.name}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: {selectedFranchise.id}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={() => handleViewDetails(selectedFranchise)}
                                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-sm"
                                >
                                    <FiEye size={16} />
                                    <span>View</span>
                                </button>
                                
                                <button
                                    onClick={() => handleEdit(selectedFranchise)}
                                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-colors text-sm"
                                >
                                    <FiEdit size={16} />
                                    <span>Edit</span>
                                </button>
                                
                                <button
                                    onClick={() => handleAddPincode(selectedFranchise)}
                                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors text-sm"
                                >
                                    <FiMapPin size={16} />
                                    <span>Add Pincode</span>
                                </button>
                                
                                <button
                                    onClick={() => handleDelete(selectedFranchise)}
                                    className="flex items-center justify-center space-x-2 px-4 py-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm"
                                >
                                    <FiTrash2 size={16} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllFranchise;
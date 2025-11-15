import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { 
    FiPlus, 
    FiUser, 
    FiMail, 
    FiPhone, 
    FiMapPin, 
    FiHome, 
    FiMap, 
    FiGlobe,
    FiCreditCard,
    FiFileText,
    FiUpload,
    FiX,
    FiDollarSign,
    FiHome as FiBuilding,
    FiTrash2
} from 'react-icons/fi';
import { TbKeyframeAlignCenter } from "react-icons/tb";

const AddFranchise = () => {
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        // Basic Info
        name: '',
        email: '',
        contactNo: '',
        
        // Address
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            landmark: ''
        },
        
        // Bank Details
        bankDetails: {
            accountNo: '',
            ifscCode: '',
            branchName: '',
            accountHolderName: ''
        },
        
       
        identityDocuments: [],
        
        tradeLicense: null
    });

    const [dragActive, setDragActive] = useState(false);

    const handleInputChange = (section, field, value) => {
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleIdentityDocumentsChange = (files) => {
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            setFormData(prev => ({
                ...prev,
                identityDocuments: [...prev.identityDocuments, ...newFiles]
            }));
        }
    };

    const removeIdentityDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            identityDocuments: prev.identityDocuments.filter((_, i) => i !== index)
        }));
    };

    const handleTradeLicenseChange = (file) => {
        if (file) {
            setFormData(prev => ({
                ...prev,
                tradeLicense: file
            }));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e, field) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (field === 'identityDocuments') {
                handleIdentityDocumentsChange(e.dataTransfer.files);
            } else if (field === 'tradeLicense') {
                handleTradeLicenseChange(e.dataTransfer.files[0]);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Handle form submission logic here
        alert('Franchise added successfully!');
        resetForm();
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            contactNo: '',
            address: {
                street: '',
                city: '',
                state: '',
                country: '',
                pincode: '',
                landmark: ''
            },
            bankDetails: {
                accountNo: '',
                ifscCode: '',
                branchName: '',
                accountHolderName: ''
            },
            identityDocuments: [],
            tradeLicense: null
        });
        setShowForm(false);
    };

    const IdentityDocumentsUpload = () => (
        <div className="space-y-4">
            <div 
                className={`bg-gray-50 dark:bg-gray-800 border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                    dragActive 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, 'identityDocuments')}
            >
                <input
                    type="file"
                    id="identityDocuments"
                    className="hidden"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => handleIdentityDocumentsChange(e.target.files)}
                />
                <label 
                    htmlFor="identityDocuments"
                    className="cursor-pointer block"
                >
                    <FiUpload className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Upload Identity Documents
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Drag & drop your documents here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                        Accepted: Aadhar Card (Front & Back), PAN Card, Voter ID Card
                        <br />
                        Supported formats: JPG, PNG, PDF (Max 5MB each)
                    </p>
                  
                </label>
            </div>

            {/* Uploaded Files List */}
            {formData.identityDocuments.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                        Uploaded Documents ({formData.identityDocuments.length})
                    </h5>
                    <div className="space-y-2">
                        {formData.identityDocuments.map((file, index) => (
                            <div 
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <FiFileText className="text-blue-500" size={18} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeIdentityDocument(index)}
                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                    title="Remove document"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const TradeLicenseUpload = () => (
        <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center transition-colors hover:border-blue-400">
            <input
                type="file"
                id="tradeLicense"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => handleTradeLicenseChange(e.target.files[0])}
            />
            <label 
                htmlFor="tradeLicense"
                className="cursor-pointer block"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={(e) => handleDrop(e, 'tradeLicense')}
            >
                <FiFileText className="mx-auto text-3xl text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {formData.tradeLicense ? formData.tradeLicense.name : 'Drag & drop Trade License or click to browse'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    Supported formats: JPG, PNG, PDF (Max 5MB)
                </p>
            </label>
        </div>
    );

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
              <Helmet>
        <title>Admin | Add Franchise</title>
      </Helmet>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-2">
                        <TbKeyframeAlignCenter className="text-3xl text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Franchise Management
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add and manage franchise partners for your business
                    </p>
                </div>

                {/* Add Franchise Button */}
                {!showForm && (
                    <div className="text-center py-12">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 max-w-md mx-auto">
                            <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <FiPlus className="text-3xl text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Add New Franchise
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Start by adding a new franchise partner to your network
                            </p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                            >
                                <FiPlus size={20} />
                                <span>Add Franchise</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Franchise Form */}
                {showForm && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <TbKeyframeAlignCenter className="text-2xl text-white" />
                                    <h2 className="text-xl font-semibold text-white">
                                        Add New Franchise
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="text-white hover:text-blue-200 transition-colors"
                                >
                                    <FiX size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                    <FiUser className="text-blue-600" />
                                    <span>Basic Information</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter full name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter email address"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange(null, 'email', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Contact Number *
                                        </label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter contact number"
                                                value={formData.contactNo}
                                                onChange={(e) => handleInputChange(null, 'contactNo', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                    <FiMapPin className="text-green-600" />
                                    <span>Address Information</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Street Address *
                                        </label>
                                        <div className="relative">
                                            <FiHome className="absolute left-3 top-3 text-gray-400" />
                                            <textarea
                                                required
                                                rows={3}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter complete street address"
                                                value={formData.address.street}
                                                onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City *
                                        </label>
                                        <div className="relative">
                                            <FiMap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter city"
                                                value={formData.address.city}
                                                onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            State *
                                        </label>
                                        <div className="relative">
                                            <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter state"
                                                value={formData.address.state}
                                                onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Country *
                                        </label>
                                        <div className="relative">
                                            <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter country"
                                                value={formData.address.country}
                                                onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            PIN Code *
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter PIN code"
                                                value={formData.address.pincode}
                                                onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Landmark
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter nearby landmark"
                                                value={formData.address.landmark}
                                                onChange={(e) => handleInputChange('address', 'landmark', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bank Details Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                    <FiCreditCard className="text-purple-600" />
                                    <span>Bank Account Information</span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Account Holder Name *
                                        </label>
                                        <div className="relative">
                                            <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter account holder name"
                                                value={formData.bankDetails.accountHolderName}
                                                onChange={(e) => handleInputChange('bankDetails', 'accountHolderName', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Account Number *
                                        </label>
                                        <div className="relative">
                                            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter account number"
                                                value={formData.bankDetails.accountNo}
                                                onChange={(e) => handleInputChange('bankDetails', 'accountNo', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            IFSC Code *
                                        </label>
                                        <div className="relative">
                                            <FiBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter IFSC code"
                                                value={formData.bankDetails.ifscCode}
                                                onChange={(e) => handleInputChange('bankDetails', 'ifscCode', e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Branch Name *
                                        </label>
                                        <div className="relative">
                                            <FiBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="Enter branch name"
                                                value={formData.bankDetails.branchName}
                                                onChange={(e) => handleInputChange('bankDetails', 'branchName', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Documents Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                    <FiFileText className="text-orange-600" />
                                    <span>Identity Documents</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Upload Aadhar Card (Front & Back), PAN Card, and/or Voter ID Card
                                </p>
                                <IdentityDocumentsUpload />
                            </div>

                            {/* Trade License Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                                    <FiFileText className="text-red-600" />
                                    <span>Trade License</span>
                                </h3>
                                <TradeLicenseUpload />
                            </div>

                            {/* Form Actions */}
                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200 dark:border-gray-600">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                                >
                                    <FiPlus size={18} />
                                    <span>Create Franchise</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddFranchise;
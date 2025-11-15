import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
    FiArrowLeft, 
    FiMapPin, 
    FiSave, 
    FiPlus, 
    FiTrash2,
    FiSearch
} from 'react-icons/fi';

const AddPinCode = () => {
    const { pinCodeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const franchise = location.state?.franchise;

    const [pinCodes, setPinCodes] = useState([]);
    const [newPinCode, setNewPinCode] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Initialize with some existing pincodes if editing
    useEffect(() => {
        if (pinCodeId && franchise) {
            // Simulate fetching existing pincodes for this franchise
            const existingPinCodes = ['400001', '400002', '400003', '400004'];
            setPinCodes(existingPinCodes);
        }
    }, [pinCodeId, franchise]);

    const handleAddPinCode = () => {
        if (!newPinCode.trim()) {
            setError('Please enter a pincode');
            return;
        }

        // Validate pincode format (6 digits)
        const pinCodeRegex = /^\d{6}$/;
        if (!pinCodeRegex.test(newPinCode)) {
            setError('Please enter a valid 6-digit pincode');
            return;
        }

        // Check for duplicates
        if (pinCodes.includes(newPinCode)) {
            setError('This pincode is already added');
            return;
        }

        setError('');
        setPinCodes(prev => [...prev, newPinCode]);
        setNewPinCode('');
    };

    const handleRemovePinCode = (pinCodeToRemove) => {
        setPinCodes(prev => prev.filter(pinCode => pinCode !== pinCodeToRemove));
    };

    const handleSave = async () => {
        if (pinCodes.length === 0) {
            setError('Please add at least one pincode');
            return;
        }

        setLoading(true);
        try {
            // Simulate API call to save pincodes
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log('Saving pincodes:', {
                franchiseId: pinCodeId,
                franchiseName: franchise?.name,
                pinCodes: pinCodes
            });

            // Show success message and navigate back
            alert('Pincodes saved successfully!');
            navigate('/all-franchise');
        } catch (err) {
            setError('Failed to save pincodes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filteredPinCodes = pinCodes.filter(pinCode =>
        pinCode.includes(searchTerm)
    );

    return (
        <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/all-franchise')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Franchises</span>
                    </button>

                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                            <FiMapPin className="text-2xl text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Manage Pincodes
                            </h1>
                            {franchise && (
                                <p className="text-gray-600 dark:text-gray-400">
                                    For {franchise.name} • {franchise.id}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Add Pincode Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Add New Pincode
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Pincode
                                    </label>
                                    <input
                                        type="text"
                                        value={newPinCode}
                                        onChange={(e) => setNewPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="Enter 6-digit pincode"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        maxLength={6}
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                                )}

                                <button
                                    onClick={handleAddPinCode}
                                    disabled={!newPinCode.trim()}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <FiPlus size={18} />
                                    <span>Add Pincode</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pincodes List Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Managed Pincodes ({pinCodes.length})
                                </h3>
                                
                                <div className="relative w-full sm:w-64">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search pincodes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {filteredPinCodes.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredPinCodes.map((pinCode, index) => (
                                        <div
                                            key={pinCode}
                                            className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                    <FiMapPin className="text-blue-600 dark:text-blue-400" size={14} />
                                                </div>
                                                <span className="font-mono text-gray-900 dark:text-white">
                                                    {pinCode}
                                                </span>
                                            </div>
                                            
                                            <button
                                                onClick={() => handleRemovePinCode(pinCode)}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                                title="Remove pincode"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📍</div>
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No pincodes added yet
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {searchTerm ? 'No pincodes match your search' : 'Add pincodes to manage service areas'}
                                    </p>
                                </div>
                            )}

                            {/* Save Button */}
                            {pinCodes.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                    <button
                                        onClick={handleSave}
                                        disabled={loading || pinCodes.length === 0}
                                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FiSave size={18} />
                                        <span>
                                            {loading ? 'Saving...' : `Save ${pinCodes.length} Pincode${pinCodes.length !== 1 ? 's' : ''}`}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {pinCodes.length}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300">
                            Total Pincodes
                        </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {filteredPinCodes.length}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                            Showing
                        </div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {franchise?.address?.city || 'City'}
                        </div>
                        <div className="text-sm text-purple-700 dark:text-purple-300">
                            Primary Location
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPinCode;
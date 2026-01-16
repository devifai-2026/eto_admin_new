import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiUser, FiLogOut, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { handleLogout } from '../../apis/Logout';

const Header = ({ onMenuClick, onThemeToggle, isDarkMode = false }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const dropdownRef = useRef(null);

    // Get user data from localStorage on component mount
    useEffect(() => {
        const fetchUserData = () => {
            try {
                // Try to get user data from localStorage
                const userDataString = localStorage.getItem('user');
                
                if (userDataString) {
                    // Parse the user data
                    const userData = JSON.parse(userDataString);
                    console.log('User data from localStorage:', userData);
                    
                    // Extract name from user data
                    if (userData && userData.name) {
                        setUserName(userData.name);
                    }
                    
                    // Extract email if needed
                    if (userData && userData.email) {
                        setUserEmail(userData.email);
                    }
                } else {
                    console.log('No user data found in localStorage');
                    // Check for other possible storage locations
                    const storedUserName = localStorage.getItem('userName') || 
                                           localStorage.getItem('name') || 
                                           localStorage.getItem('admin_name');
                    
                    if (storedUserName) {
                        setUserName(storedUserName);
                    }
                }
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        };

        fetchUserData();
        
        // Optional: Listen for changes in localStorage
        const handleStorageChange = (event) => {
            if (event.key === 'user' || event.key === 'userName' || event.key === 'name') {
                fetchUserData();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom event if you update user data within the same tab
        const handleUserUpdate = () => {
            fetchUserData();
        };
        
        window.addEventListener('userDataUpdated', handleUserUpdate);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userDataUpdated', handleUserUpdate);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = async () => {
        console.log('Logging out...');
        setIsDropdownOpen(false);
        
        // Call the logout function
        await handleLogout();
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleThemeClick = () => {
        console.log('Theme button clicked, isDarkMode is:', isDarkMode);
        onThemeToggle();
    };

    // Function to get user's initials
    const getUserInitials = () => {
        if (!userName) return 'U';
        
        const nameParts = userName.split(' ');
        if (nameParts.length >= 2) {
            return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
        }
        return userName.charAt(0).toUpperCase();
    };

    // Function to get header title (optional - you can keep this or simplify)
    const getHeaderTitle = () => {
        // You can customize this based on user role if needed
        return 'ETO Dashboard';
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <FiMenu size={20} />
                    </button>
                    <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white hidden md:block">
                        {getHeaderTitle()}
                    </h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={handleThemeClick}
                        className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
                        aria-label="Toggle theme"
                        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDarkMode ? (
                            <FiSun size={20} className="text-yellow-500" />
                        ) : (
                            <FiMoon size={20} className="text-blue-500" />
                        )}
                    </button>
                    
                    {/* User Profile with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <div 
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            onClick={toggleDropdown}
                        >
                            {/* Avatar with user's initial */}
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                                {getUserInitials()}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                                    {userName || 'Loading...'}
                                </span>
                                {userEmail && (
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {userEmail}
                                    </span>
                                )}
                            </div>
                            <FiChevronDown 
                                size={16} 
                                className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 transition-colors duration-300">
                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                    <div className="font-medium text-gray-800 dark:text-gray-200">{userName || 'User'}</div>
                                    {userEmail && (
                                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{userEmail}</div>
                                    )}
                                </div>
                                <button
                                    onClick={handleLogoutClick}
                                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <FiLogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
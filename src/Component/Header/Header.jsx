import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiUser, FiLogOut, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { handleLogout } from '../../apis/Logout';


const Header = ({ onMenuClick, onThemeToggle, isDarkMode = false }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
                    <h1 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white hidden md:block">ETO Admin</h1>
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
                    
                    {/* Admin Profile with Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <div 
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            onClick={toggleDropdown}
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <FiUser size={18} className="text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Admin</span>
                            <FiChevronDown 
                                size={16} 
                                className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
                                    isDropdownOpen ? 'rotate-180' : ''
                                }`}
                            />
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 transition-colors duration-300">
                                <button
                                    onClick={handleLogoutClick}
                                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
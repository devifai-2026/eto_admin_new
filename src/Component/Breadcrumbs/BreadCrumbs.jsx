import React from 'react';
import { useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
    const location = useLocation();
    
    // Get current page name from path
    const getCurrentPageName = () => {
        const pathnames = location.pathname.split('/').filter((x) => x);
        
        if (pathnames.length === 0) {
            return "Dashboard"; // Home page name
        }
        
        // Get the last path segment
        const currentPath = pathnames[pathnames.length - 1];
        
        // Convert path to readable label
        return currentPath
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const currentPageName = getCurrentPageName();

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
                {currentPageName}
            </h1>
        </div>
    );
};

export default Breadcrumbs;
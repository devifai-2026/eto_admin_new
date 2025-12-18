import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiAward,
  FiUsers,
  FiUser,
  FiNavigation,
  FiClock,
  FiBarChart2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
} from "react-icons/fi";
import { TbBikeFilled } from "react-icons/tb";
import { TbKeyframeAlignCenter } from "react-icons/tb";
import logo from "../../assets/sidebar/ETO_Logo.png";
import { LiaPhoenixFramework } from "react-icons/lia";

const Sidebar = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { path: "/", icon: FiHome, label: "Home", exact: true },
    {
      path: "/top-drivers",
      icon: FiAward,
      label: "Top Drivers",
      nestedPaths: ["/top-driver-details"],
    },
    {
      path: "/all-drivers",
      icon: FiUsers,
      label: "All Drivers",
      nestedPaths: ["/all-driver-details"],
    },
    {
      path: "/all-passengers",
      icon: FiUser,
      label: "All Passengers",
      nestedPaths: ["/all-passenger-details"],
    },
    {
      path: "/driver-verification",
      icon: TbBikeFilled,
      label: "Driver Verification",
    },
    {
      path: "/active-rides",
      icon: FiNavigation,
      label: "Active Rides",
      nestedPaths: ["/active-rides-details"],
    },
    {
      path: "/due-request",
      icon: FiClock,
      label: "Due Request",
      nestedPaths: ["/due-request"],
    },
    {
      path: "/ride-history",
      icon: FiBarChart2,
      label: "Ride History",
      nestedPaths: ["/ride-history"],
    },
    {
      path: "/add-franchise",
      icon: TbKeyframeAlignCenter,
      label: "Add Franchise",
    },
    {
      path: "/all-franchise",
      icon: LiaPhoenixFramework,
      label: "All Franchise",
      nestedPaths: ["/franchise-details","/add-pinCode","/franchise-drivers"],
    },
     {
      path: "/fare-settings",
      icon: TbKeyframeAlignCenter,
      label: "Fare Settings",
    },
   
  ];

  // Function to check if a menu item is active
  const isMenuItemActive = (menuItem, currentPath) => {
    // Exact match for root
    if (menuItem.exact) {
      return currentPath === menuItem.path;
    }

    // Check main path
    if (currentPath === menuItem.path) {
      return true;
    }

    // Check nested paths for detail pages
    if (menuItem.nestedPaths) {
      return menuItem.nestedPaths.some((nestedPath) =>
        currentPath.startsWith(nestedPath)
      );
    }

    // For other menu items without nested paths, check if current path starts with menu path
    return currentPath.startsWith(menuItem.path) && menuItem.path !== "/";
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-blue-500 text-white shadow-lg"
      >
        <FiMenu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static lg:inset-0
                ${isExpanded ? "w-64" : "w-20"}
            `}
      >
        <div className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div
            className={`flex items-center ${
              isExpanded ? "justify-between" : "justify-center"
            } p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0`}
          >
            {isExpanded && (
              <div className="flex-shrink-0">
                <img src={logo} alt="Logo" className="h-28 w-auto" />
              </div>
            )}

            {/* Close button for mobile */}
            <button
              onClick={closeMobileSidebar}
              className="lg:hidden p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX size={18} />
            </button>

            {/* Toggle button for desktop */}
            <button
              onClick={toggleSidebar}
              className="hidden lg:flex p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isExpanded ? (
                <FiChevronLeft size={18} />
              ) : (
                <FiChevronRight size={18} />
              )}
            </button>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
            {/* Menu Section */}
            <div>
              {isExpanded && (
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                  Menu
                </h3>
              )}
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isMenuItemActive(item, location.pathname);

                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={closeMobileSidebar}
                        className={`
                                                    flex items-center ${
                                                      isExpanded
                                                        ? "space-x-3 px-3"
                                                        : "justify-center px-2"
                                                    } py-2 rounded-lg transition-colors
                                                    ${
                                                      isActive
                                                        ? "bg-blue-500 text-white"
                                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    }
                                                `}
                        title={!isExpanded ? item.label : ""}
                      >
                        <Icon size={20} />
                        {isExpanded && (
                          <span className="font-medium text-sm md:text-base whitespace-nowrap">
                            {item.label}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

import React from "react";
import { FiLoader } from "react-icons/fi";

const LoadingState = ({ retry }) => {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <FiLoader className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          Loading franchises...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;

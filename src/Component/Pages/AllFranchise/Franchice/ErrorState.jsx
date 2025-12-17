import React from "react";

const ErrorState = ({ error, retry }) => {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to Load
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default ErrorState;

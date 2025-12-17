const UserTypeSelector = ({ userType, setUserType }) => {
  const options = [
    {
      id: "admin",
      label: "Admin Login",
      description: "System administrator access",
      icon: "👑",
    },
    {
      id: "franchise",
      label: "Franchise Login",
      description: "Franchise owner access",
      icon: "🏪",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Select Login Type
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Choose how you want to access the system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setUserType(option.id)}
            className={`p-4 border-2 rounded-xl transition-all duration-200 ${
              userType === option.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-2xl mb-2">{option.icon}</div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                {option.label}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
              {userType === option.id && (
                <div className="mt-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserTypeSelector;

// api/logout.js
export const handleLogout = async () => {
  try {
    // Remove user from localStorage
    localStorage.removeItem('user');
    
    // You can also clear any other stored data if needed
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    
    // Redirect to login page or reload the application
    window.location.href = '/login'; // or window.location.reload() if you prefer
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Alternative version if you need to call a backend API
export const handleLogoutWithAPI = async () => {
  try {
 
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    
    // Redirect to login page
    window.location.href = '/login';
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage even if API call fails
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    window.location.href = '/login';
    
    return { success: false, error: error.message };
  }
};
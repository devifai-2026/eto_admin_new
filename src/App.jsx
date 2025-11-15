// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Component/Auth/Login';
import Layout from './Component/Layout/Layout';
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
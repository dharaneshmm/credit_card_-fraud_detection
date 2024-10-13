// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Feature from "./components/Feature";
import Login from "./components/login";
import Register from "./components/register";
import Analysis from "./components/analysis";
import Prediction from "./components/prediction";
import Dashboard from "./components/dashboard";
import PrivateRoute from "./components/PrivateRoute";

function Main() {
  return (
    <div>
      <Home />
      <Feature />
      <Dashboard />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/analysis"
            element={
              <PrivateRoute>
                <Analysis />
              </PrivateRoute>
            }
          />
          <Route
            path="/prediction"
            element={
              <PrivateRoute>
                <Prediction />
              </PrivateRoute>
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

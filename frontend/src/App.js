import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import SignUpForm from './pages/newsignup';
import LogInForm from './pages/newlogin';
// import About from './pages/About';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LogInForm />} />
        {/* <Route path="/about" component={About} /> */}
      </Routes>
    </Router>
  );
}

export default App;

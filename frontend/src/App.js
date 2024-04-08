import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/index';
import SignUpForm from './pages/newsignup';
import LogInForm from './pages/newlogin';
import Search from './pages/search';
import FReview from './pages/review';
import MyAcc from './pages/myacc';
import MyReviews from './pages/myreviews';
import WriteReview from './pages/writereview';
// import About from './pages/About';
// import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LogInForm />} />
        <Route path="/search" element={<Search />} />
        <Route path="/review/:id" element={<FReview />} />
        <Route path="/myacc" element={<MyAcc />} />
        <Route path="/myreviews" element={<MyReviews />} />
        <Route path="/writereview" element={<WriteReview />} />
        {/* <Route path="/about" component={About} /> */}
      </Routes>
    </Router>
  );
}

export default App;

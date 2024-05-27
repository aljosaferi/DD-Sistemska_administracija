import Navbar from '../Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.scss';


function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element />
          <Route path='/restaurants' element />
          <Route path='/map' element />
          <Route path='/login' element />
        </Routes>
      </Router>
    </>
  );
}

export default App;

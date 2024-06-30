import { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import LandingPage from '../../pages/LandingPage/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import Map from '../Map/Map';
import { UserContext } from '../../userContext';
import Restaurants from '../../pages/Restaurants/Restaurants';
import Restaurant from '../Restaurant/Restaurant';
import Profile from '../../pages/Profile/Profile';
import AddRestaurant from '../../pages/AddRestaurant/AddRestaurant';

function App() {
  const [user, setUser] = useState(localStorage.user ? JSON.parse(localStorage.user) : null);
  const updateUserData = (userInfo) => {
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  }

  const queryClient = new QueryClient();

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Router>
      <UserContext.Provider value={{
        user: user,
        setUserContext: updateUserData
      }}>
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/restaurants' element={<Restaurants/>} />
          <Route path='/restaurant/:id' element={<Restaurant/>} />
          <Route path='/map' element={<Map />}/>
          <Route path='/myProfile' element={<Profile/>} />
          <Route path='/addRestaurant' element={<AddRestaurant/>} />
        </Routes>
        </UserContext.Provider>
      </Router>
      {/*<ReactQueryDevtools/>*/}
      </QueryClientProvider>
    </>
  );
}

export default App;

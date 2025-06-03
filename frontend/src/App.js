
import './App.css';
import Favoritos from './Components/Favoritos';
import Home from './Home';
import Login from './Login';
import Movie from './MovieInformation/Movie';
import ScrollToTop from './ScrollToTop';

import Signup from './Signup';
import {BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <BrowserRouter >
    <ScrollToTop />
      <Routes>
        
        <Route path='/' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/home' element={<Home/>}></Route>
        <Route path='/movie/:id' element={<Movie/>}/>
        <Route path='/favoritos' element={<Favoritos/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

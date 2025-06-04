
import './App.css';
import Favoritos from './views/Favoritos';
import Home from './views/Home';
import Login from './views/Login';
import Movie from './views/MovieInformation';
import ScrollToTop from './ScrollToTop';

import Signup from './views/Signup';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <BrowserRouter >
    <ScrollToTop />
      <Routes>
        {/* Ruta por defecto, login del sitio */}
        <Route path='/' element={<Login/>}></Route>
        {/* Ruta para crear una cuenta */}
        <Route path='/signup' element={<Signup/>}></Route>
        {/* Ruta del home, observar todas las peliculas */}
        <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
        {/* Ruta dinamica para ver peliculas segun el id */}
        <Route path='/movie/:id' element={<ProtectedRoute><Movie/></ProtectedRoute>}/>
        {/* Ruta para favoritos, peliculas guardadas por el usuario. */}
        <Route path='/favoritos' element={<ProtectedRoute><Favoritos/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

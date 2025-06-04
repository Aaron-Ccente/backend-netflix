import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    // Obtenemos la informacion del usuario
    const { user } = useAuth();
    //Si el usuario no esta logeado, se redirige al inicio de sesion
    if(!user) {
    return <Navigate to="/" replace/>}
  return children
}

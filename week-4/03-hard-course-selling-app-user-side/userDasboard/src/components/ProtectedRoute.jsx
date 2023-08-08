import React from 'react'
import { toast } from 'react-hot-toast';
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
    
  return (
    <>
        {sessionStorage.getItem("userToken") ? <Outlet /> : <Navigate to={"/login"} />}
    </>
  )
}

export default ProtectedRoute
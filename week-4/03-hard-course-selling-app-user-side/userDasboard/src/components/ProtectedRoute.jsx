import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  return (
    <>
        {sessionStorage.getItem("userToken") ? <Outlet /> : <Navigate to={"/login"} />}
    </>
  )
}

export default ProtectedRoute
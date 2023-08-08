import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const Restricted = () => {
  return (
    <>
    {sessionStorage.getItem("userToken") ? <Navigate to={"/"} /> : <Outlet />}
    </>
  )
}

export default Restricted
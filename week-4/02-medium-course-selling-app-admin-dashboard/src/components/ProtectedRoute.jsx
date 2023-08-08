import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'

const ProtectedRoute = () => {

    return (<>
        {localStorage.getItem("token") ? <Outlet /> : <Navigate to={"/login"} /> }
    </>)

}

export default ProtectedRoute
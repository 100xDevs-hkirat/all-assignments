import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { user } from '../recoil/atom'

const ProtectedRoute = () => {

    const client = useRecoilValue(user);
    return (<>
        {localStorage.getItem("token") ? <Outlet /> : <Navigate to={"/login"} /> }
    </>)

}

export default ProtectedRoute
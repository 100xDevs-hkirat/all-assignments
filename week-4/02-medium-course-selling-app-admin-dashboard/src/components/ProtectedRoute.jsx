import React from 'react'
import { Navigate, Outlet, Route } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { user } from '../recoil/atom'

const ProtectedRoute = () => {

    const client = useRecoilValue(user);
    return (<>
        {Object.keys(client).length ? <Outlet /> : <Navigate to={"register"} /> }
    </>)

}

export default ProtectedRoute
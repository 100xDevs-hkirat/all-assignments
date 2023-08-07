import React from 'react'
import { useRecoilValue } from 'recoil'
import { user } from '../recoil/atom'
import { Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RestrictedRoute = () => {
    const client = useRecoilValue(user);
    return (
        <>
            {Object.keys(client).length ? <Navigate to={"/courses"} /> : <Outlet />}
        </>
    )
}

export default RestrictedRoute
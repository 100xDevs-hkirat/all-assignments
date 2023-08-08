import React, { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { user } from '../recoil/atom'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const RestrictedRoute = () => {
    const client = useRecoilValue(user);
    

    return (
        <>
            {Object.keys(client).length ? <Navigate to={"/"} /> : <Outlet />}
        </>
    )
}

export default RestrictedRoute
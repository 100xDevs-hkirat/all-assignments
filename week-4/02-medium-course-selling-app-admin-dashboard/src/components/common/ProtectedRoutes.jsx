import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import useToken from '../../hooks/useToken'

const ProtectedRoutes = () => {
  const navigate = useNavigate()
  const { token } = useToken()

  useEffect(() => {
    if (!token) {
      return navigate('/login')
    }
  }, [])
  return <Outlet />
}

export default ProtectedRoutes

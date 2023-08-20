const useAuth = () => {
  const token = localStorage.getItem('token')

  return { token }
}

export default useAuth

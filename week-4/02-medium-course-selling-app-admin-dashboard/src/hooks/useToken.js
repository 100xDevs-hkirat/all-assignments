const useToken = () => {
  const token = localStorage.getItem('token')

  return { token }
}

export default useToken

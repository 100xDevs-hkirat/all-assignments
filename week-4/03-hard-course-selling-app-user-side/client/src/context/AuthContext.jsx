import { createContext, useReducer } from "react";
import BASE_URL from "../hooks/useBaseUrl";
import axios from 'axios';

const baseurl = "http://localhost:3001/api/v1";

const AuthContext = createContext();

const initialState = {
  user: {},
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'signup_request':
      return { ...state };

    case 'signup_success':
      return { ...state, user: {...action.payload}, isAuthenticated: true };

    case 'signup_failure':
      return { ...state };

    case 'login_request':
      return { ...state };

    case 'loginSuccess':
      return { ...state, user: { ...action.payload },isAuthenticated: true };

    case 'login_failure':
      return { ...state };
    case 'logout': 
      return { ...state, isAuthenticated: false, user: {}}

    default:
      throw new Error("Invalid action type");
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const signup = async (payload) => {
    dispatch({ type: 'signup_request' });

    try {

        console.log(payload);
      const response = await axios.post(`${baseurl}/signup`, payload);
      const user = response.data.data.userdata;
      console.log(response.data.data.userdata);
      localStorage.setItem('jwttoken', response.data.token);
      dispatch({type: 'signup_success', payload: user })

    } catch (error) {
      dispatch({ type: 'signup_failure' });
      console.log(error);
    }
  };

  const login = async (payload) => {
    dispatch({ type: 'login_request' });

    try {
      const response = await axios.post(`${baseurl}/login`, payload);
      const user = response.data.data.userdata;
      console.log(response);
      localStorage.setItem('jwttoken', response.data.token);
      dispatch({ type: 'loginSuccess', payload: user });
    } catch (error) {
      dispatch({ type: 'login_failure' });
      console.log(error);
    }
  };
  const logout = () => {
    dispatch ({type: 'logout'});
  }
  return (
    <AuthContext.Provider value={{ state, signup, login ,logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

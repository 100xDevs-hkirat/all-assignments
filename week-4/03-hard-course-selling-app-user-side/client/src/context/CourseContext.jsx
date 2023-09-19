

import axios from 'axios';
import { createContext, useReducer } from 'react';


const CourseContext = createContext();
const baseurl = "http://localhost:3001/api/v1"

const initialState = {
    
    courses :[],
    buyedcourse: [],
}
const courseReducer = (state, action) => {
    switch (action.type) {
      case 'courses/request':
        return { ...state };
  
      case 'courses/buy':
        return { ...state };
  
      case 'courses/buyedcourse':
        return { ...state };
  
      case 'getcourses':
        return { ...state, courses: action.payload };
  
      case 'buycourse':
        return { ...state };
  
      case 'buyedcourse':
        console.log(action.payload);
        return { ...state, buyedcourse: [{...action.payload}] };
  
      default:
        throw new Error('Action type is not valid');
    }
  };

  const CourseProvider = ({ children }) => {
    const [state, dispatch] = useReducer(courseReducer, initialState);
  
    const getCourses = async () => {
      dispatch({ type: 'courses/request' });
  
      try {
        console.log('action dispatched');
        const res = await axios.get(`${baseurl}/user/courses`);
  
        const { data } = res.data;
        console.log(data);
  
        dispatch({ type: 'getcourses', payload: data });
      } catch (err) {
        console.log(err);
      }
    };
  
    const buyCourse = async (id,userid) => {
      dispatch({ type: 'courses/buy' });
  
      try {
        console.log('action for buying dispatched');
        const jwtToken = localStorage.getItem('jwttoken');
        const res = await axios.get(`${baseurl}/user/courses/${id}`, {
          headers: {
            userid ,
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        
        console.log(res);
        dispatch({ type: 'buycourse' });
      } catch (err) {
        console.log(err);
      }
    };
    

    const getbuyedCourses = async (id) => {
      dispatch({ type: 'courses/buyedcourse' });
      
      try {
        console.log('buyed course dispatched');

        const jwtToken = localStorage.getItem('jwttoken');
        const res = await axios.get(`${baseurl}/user/buyedcourse/${id}`,{
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            }
        });
        console.log(res);
        const { allCourses } = res.data.data;
        console.log(allCourses);

        dispatch({ type: 'buyedcourse', payload: allCourses });
      } catch (err) {
        console.log(err);
      }
    };
    
    const createCourse = async (payload) => {

      dispatch({type: 'courses/request'});

      try {

        console.log(payload);
        const response = await axios.post(`${baseurl}/admin/createcourse`,payload);
        console.log(response);
      
        dispatch({type: 'courses/request'})

      } catch (err) {
        console.log(err);
      }
      

    }
    return (
      <CourseContext.Provider value={{ state, getCourses, buyCourse, getbuyedCourses, createCourse }}>
        {children}
      </CourseContext.Provider>
    );
  };


export { CourseContext, CourseProvider };


import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/admin',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerAdmin = (data) => {
  return client
    .post('/signup', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const loginAdmin = ({ username, password }) => {
  return client
    .post(
      '/login',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          username,
          password,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const fetchCourses = () => {
  const token = localStorage.getItem('token');
  return client
    .get('/courses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const fetchCourse = (courseId) => {
  const token = localStorage.getItem('token');
  return client
    .get(`/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const addCourse = (data) => {
  const token = localStorage.getItem('token');
  return client
    .post('/courses', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const updateCourse = (data, courseId) => {
  const token = localStorage.getItem('token');
  return client
    .put(`/courses/${courseId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export default client;

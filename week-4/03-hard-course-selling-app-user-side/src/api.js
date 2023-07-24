import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3000/users',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (data) => {
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

export const loginUser = ({ username, password }) => {
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

export const buyCourse = (courseId) => {
  const token = localStorage.getItem('token');
  return client
    .post(
      `/courses/${courseId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const fetchPurchasedCourses = () => {
  const token = localStorage.getItem('token');
  return client
    .get('/purchasedCourses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
};

export const fetchUser = () => {
  const token = localStorage.getItem('token');
  return client
    .get('/me', {
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

import axios from 'axios';

export function register(credentials) {
  return new Promise((res, rej) => {
    axios
      .post('http://localhost:3000/users/signup', credentials)
      .then((response) => {
        if (response.status !== 201) rej(response);
        localStorage.setItem('jwt_token', response.data.token);
        res();
      })
      .catch(rej);
  });
}

export function login(credentials) {
  return new Promise((res, rej) => {
    axios
      .post('http://localhost:3000/users/login', credentials)
      .then((response) => {
        if (response.status !== 200) rej(response);
        localStorage.setItem('jwt_token', response.data.token);
        res();
      })
      .catch(rej);
  });
}

export function getCourses() {
  return new Promise((res, rej) => {
    axios
      .get('http://localhost:3000/users/courses/', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
        },
      })
      .then((response) => {
        if (response.status !== 200) rej(response);
        res(response);
      })
      .catch(rej);
  });
}

export function buyCourse(courseId) {
  return new Promise((res, rej) => {
    axios
      .post(
        `http://localhost:3000/users/courses/${courseId}`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
          },
        }
      )
      .then((response) => {
        if (response.status !== 200) rej(response);
        res(response);
      })
      .catch(rej);
  });
}

export function getPurchasedCourses() {
  return new Promise((res, rej) => {
    axios
      .get('http://localhost:3000/users/purchasedCourses', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
        },
      })
      .then((response) => {
        if (response.status !== 200) rej(response);
        res(response);
      })
      .catch(rej);
  });
}

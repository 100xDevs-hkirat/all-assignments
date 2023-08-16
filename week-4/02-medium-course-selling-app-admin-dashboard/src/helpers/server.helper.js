import axios from 'axios';

export function register(credentials) {
  return new Promise((res, rej) => {
    axios
      .post('http://localhost:3000/admin/signup', credentials)
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
      .post('http://localhost:3000/admin/login', credentials)
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
      .get('http://localhost:3000/admin/courses/', {
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

export function putCourse(courseId, update) {
  return new Promise((res, rej) => {
    axios
      .put(`http://localhost:3000/admin/courses/${courseId}`, update, {
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

export function createCourse(course) {
  return new Promise((res, rej) => {
    axios
      .post('http://localhost:3000/admin/courses/', course, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('jwt_token'),
        },
      })
      .then((response) => {
        if (response.status !== 201) rej(response);
        res(response);
      })
      .catch(rej);
  });
}

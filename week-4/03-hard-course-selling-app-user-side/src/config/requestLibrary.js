import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.timeout = 1000;
//axios.defaults.post['Content-Type'] = 'application/json';

export default axios;
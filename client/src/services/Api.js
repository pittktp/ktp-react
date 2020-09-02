import axios from 'axios';

const API_ROOT = process.env.REACT_APP_API;
const TIMEOUT = 20000;
const HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

class ApiService {
  constructor({ baseURL = API_ROOT, timeout = TIMEOUT, headers = HEADERS }) {
    const client = axios.create({ baseURL, timeout, headers });
    client.interceptors.response.use(this.handleSuccess, this.handleError);
    this.client = client;
  }

  handleSuccess(response) {
    return response;
  }

  handleError(error) {
    return Promise.reject(error);
  }

  // GET DATA
  get(path) {
    return this.client.get(path).then(response => response.data);
  }

  // CREATE DATA OR FILE UPLOAD
  post(path, payload) {
    return this.client.post(path, payload).then(response => response.data);
  }

  // REPLACE EXISTING DATA OR CREATE IF NOT FOUND
  put(path, payload) {
    return this.client.put(path, payload).then(response => response.data);
  }
  
  // UPDATE EXISTING DATA
  patch(path, payload) {
    return this.client.patch(path, payload).then(response => response.data);
  }

  // DELETE EXISTING DATA
  delete(path) {
    return this.client.delete(path).then(response => response.data);
  }
}

export default ApiService;
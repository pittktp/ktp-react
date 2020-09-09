import ApiService from './Api';

const BASE_URL = process.env.REACT_APP_API || 'http://localhost:3030/';

// Instantiate a new API service
let client = new ApiService({ baseURL: BASE_URL });

const Api = {};

// Set default headers, including any token found in localStorage
// This is important because when an API call is made during page load,
// Redux will not have loaded the token value yet, causing all API calls
// during page load to fail
Api.setToken = (token) => {
  let HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token
  };

  client = new ApiService({ baseURL: BASE_URL, headers: HEADERS });
}

// Declaring specific methods for our KTP server makes it easy to
// understand what we're trying to do, cuts down on unnecessary
// boilerplate code, as well as allows us to edit API calls in one place
// and have it update across the application.

// AUTH
Api.validate = () => client.get('/auth/validate');
Api.login = payload => client.post('/auth/login', payload);
Api.register = payload => client.post('/auth/register', payload);

// MEMBER
Api.getMembers = () => client.get('/members');
Api.getMember = emailId => client.get(`/members/email/${emailId}`);
Api.loadMember = id => client.get(`/members/${id}`);
Api.sendAttendence = payload => client.patch('/members/attendence', payload);
Api.updateMember = (id, payload) => client.patch(`/members/${id}`, payload);
Api.deleteMember = id => client.delete(`/members/${id}`);
Api.zeroDB = () => client.patch('/members/clear');
Api.uploadPicture = (id, payload) => client.post(`/members/${id}/image/upload`, payload);
Api.deletePicture = id => client.delete(`/members/${id}/image/delete`);

// REQUEST
Api.getRequests = () => client.get('/requests');
Api.createRequest = payload => client.post('/requests', payload);
Api.acceptRequest = (id, payload) => client.patch(`/requests/${id}`, payload);
Api.denyRequest = id => client.delete(`/requests/${id}`);

export default Api;

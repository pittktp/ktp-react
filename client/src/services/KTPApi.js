import ApiService from './Api';

const BASE_URL = process.env.REACT_APP_API || 'http://localhost:3030/';

let client = new ApiService({ baseURL: BASE_URL });

const Api = {};

Api.setToken = (token) => {
  let HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': token
  };

  client = new ApiService({ baseURL: BASE_URL, headers: HEADERS });
}

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

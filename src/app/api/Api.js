import axios from 'axios';

axios.defaults.baseURL = 'https://admin.soarerazvan.com/tapnotes-mock/';
axios.defaults.timeout = 10000;

const getStructure = () => {
  return axios.get('get-structure');
}

const getSuggestions = (data) => {
  return axios.post('get-suggestions', data);
}

export default {
  getStructure,
  getSuggestions
}
import axios from "axios";

const API = `https://prismbackend-27d920759150.herokuapp.com/api/v1/admin`;

export const generateReportAPI = (payload) =>
  axios.post(`${API}/export`, payload, { withCredentials: true });

export const fetchReportsAPI = () =>
  axios.get(`${API}/exports`, { withCredentials: true });

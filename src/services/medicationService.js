import axios from "axios";

const API_URL = "http://localhost:3006/api/medications";

const getAllMedications = () => {
  return axios.get(API_URL);
};

export default {
  getAllMedications,
};

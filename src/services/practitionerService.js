import axios from "axios";
const API_URL = "http://localhost:3006/api/practitioners";

const getPractitionerById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

export default { getPractitionerById };

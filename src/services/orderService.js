import axios from "axios";

const API_URL = "http://localhost:3006/api/commandes";

const createOrder = async (orderData) => {
  const response = await axios.post(API_URL, orderData);
  return response.data;
};

export default { createOrder };
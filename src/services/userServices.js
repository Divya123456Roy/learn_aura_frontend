import axios from 'axios';
import { BASE_URL } from '../utils/urls';

// Login API
export const loginAPI = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login`, data);
    return response.data;
  } catch (error) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong during login" };
  }
};

// Register API
export const registerAPI = async (data) => {
  try {

    const response = await axios.post(`${BASE_URL}/user/register`, data);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Register API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Something went wrong during registration" };
  }
};

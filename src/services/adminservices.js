import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

export const fetchProfessionals = async () => {
    const token = getToken()
  const { data } = await axios.get(`${BASE_URL}/user/all-users`,{
    headers:{
        Authorization:`Bearer ${token}`
    }
  });
  return data;
};

export const fetchStudentsAPI = async () => {
    try {
      const token = getToken(); // Get the JWT token from sessionStorage
      if (!token) {
        throw { message: "No token found. Please log in." };
      }
  
      const response = await axios.get(`${BASE_URL}/user/all-student`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
  
      return response.data; // Return the list of students
    } catch (error) {
      console.error("Fetch Students API Error:", error.response?.data || error.message);
      throw error.response?.data || { message: "Failed to fetch students data" };
    }
  };

  

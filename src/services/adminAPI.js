
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

export const fetchAllUsers = async () => {
  try {
    const token = getToken();
    console.log(token);
    

    const response = await axios.get(`${BASE_URL}/user/all-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch instructors" };
  }
};

export const fetchAllStudents = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/user/all-student`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch students" };
  }
};

export const fetchAllCourses = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/course`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch courses" };
  }
};

// API call to verify a professional
export const verifyProfessionalAPI = async (userId) => {
  const token = getToken();
  console.log(token);
  
  await axios.put(`${BASE_URL}/user/verify-instructor`, { userId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// API call to unverify a professional
export const unverifyProfessionalAPI = async (userId) => {
  const token = getToken();
  await axios.put(`${BASE_URL}/user/unverify-instructor`, { userId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

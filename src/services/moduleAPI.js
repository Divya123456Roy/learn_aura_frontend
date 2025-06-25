import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";


// Fetch modules by course ID
export const fetchModulesByCourseIdAPI = async (courseId) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.get(`${BASE_URL}/module/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch Modules By Course ID API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch modules" };
  }
};

// Update a module
export const updateModuleAPI = async ({ moduleId, moduleData }) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.put(`${BASE_URL}/module/${moduleId}`, moduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update Module API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update module" };
  }
};

// Delete a module
export const deleteModuleAPI = async (moduleId) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.delete(`${BASE_URL}/module/${moduleId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Delete Module API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete module" };
  }
};

// Create a module (already defined previously)
export const createModuleAPI = async (moduleData) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.post(`${BASE_URL}/module`, moduleData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create Module API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create module" };
  }
};
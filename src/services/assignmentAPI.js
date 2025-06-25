import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

// Helper function to get headers with token
const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw { message: "No token found. Please log in." };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Create an assignment
export const createAssignmentAPI = async (assignmentData) => {
  try {
    const response = await axios.post(`${BASE_URL}/assignment`, assignmentData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Create Assignment API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to create assignment" };
  }
};

// Fetch all assignments by course ID
export const fetchAllAssignmentByCourseAPI = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/assignment/module/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Fetch Assignments by Course API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to fetch assignments" };
  }
};

// Update an assignment
export const updateAssignmentAPI = async (assignmentId, assignmentData) => {
  try {
    const response = await axios.put(`${BASE_URL}/assignment/${assignmentId}`, assignmentData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Update Assignment API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to update assignment" };
  }
};

// Delete an assignment
export const deleteAssignmentAPI = async (assignmentId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/assignment/${assignmentId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Delete Assignment API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to delete assignment" };
  }
};

export const checkAssignmentSubmittedAPI = async (assignmentId) => {
  try {
    const response = await axios.post(`${BASE_URL}/assignment-submission/check-assignment`, assignmentId,{
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Check Assignment Already Submitted API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to delete assignment" };
  }
};

export const checkQuizSubmittedAPI = async ({ quizId }) => {
  const token = getToken()
  const response = await axios.get(`${BASE_URL}/quiz/${quizId}/submission`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllAssignmentDataAPI = async (id) => {
  const token = getToken()
  const response = await axios.get(`${BASE_URL}/assignment-submission/assignment/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const gradeAssignmentAPI = async ({submissionId:id,grade}) => {
  const token = getToken()
  const response = await axios.put(`${BASE_URL}/assignment-submission/grade/${id}`,{grade}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

export const createQuizAPI = async (quizData) => {
  console.log(quizData);
  
    const token = getToken();
    const response = await axios.post(`${BASE_URL}/quiz`, quizData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

// Helper function to get headers with token
export const getAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    throw { message: "No token found. Please log in." };
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Fetch all quizzes
export const getAllQuizzesAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Get All Quizzes API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to fetch quizzes" };
  }
};

// Fetch a quiz by ID
export const getQuizSubmissionByIdAPI = async (quizId) => {
  try {
    const response = await axios.post(`${BASE_URL}/quiz-submission/check-quiz`,quizId, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Get Quiz By ID API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to fetch quiz" };
  }
};

// Fetch quizzes by module ID
export const getQuizzesByModuleIdAPI = async (moduleId) => {
  try {
    const response = await axios.get(`${BASE_URL}/quiz/module/${moduleId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Get Quizzes By Module ID API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to fetch quizzes for this module" };
  }
};

// Add a question to a quiz
export const addQuestionToQuizAPI = async (questionData) => {
  try {
    const response = await axios.post(`${BASE_URL}/quiz/question`, questionData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Add Question to Quiz API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to add question to quiz" };
  }
};

// Update a question in a quiz
export const updateQuestionInQuizAPI = async (quizId,questionData) => {
  const token = getToken();
  console.log(questionData,quizId);
  
  try {
    const response = await axios.put(`${BASE_URL}/quiz/${quizId}`, questionData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    
    throw error;
  }
};

// Update a quiz
export const updateQuizAPI = async (quizId, quizData) => {
  try {
    const response = await axios.put(`${BASE_URL}/quiz/${quizId}`, quizData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Update Quiz API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to update quiz" };
  }
};

// Delete a quiz
export const deleteQuizAPI = async (quizId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/quiz/${quizId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Delete Quiz API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "Failed to delete quiz" };
  }
};
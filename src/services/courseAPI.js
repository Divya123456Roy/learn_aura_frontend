
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";


export const createCourseAPI = async (courseData) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }
    console.log(courseData);

    const response = await axios.post(`${BASE_URL}/course`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create Course API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create course" };
  }
};
export const fetchAllCoursesAPI = async (id, searchTerm = "", page = 1) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.get(`${BASE_URL}/module/course/${id}`, { // Note: This endpoint seems incorrect for fetching all courses. It's fetching modules by course ID.
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        search: searchTerm,
        page: page,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch All Courses API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch courses" };
  }
};
export const fetchMyCoursesAPI = async (searchTerm = "",currentPage) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/course`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      search: searchTerm,
      page:currentPage
    },
  });
  return response.data;
};

export const fetchCourseByIdAPI = async (courseId) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.get(`${BASE_URL}/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch Course By ID API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch course" };
  }
};

// Update a course
export const updateCourseAPI = async ({ courseId, courseData }) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.put(`${BASE_URL}/course/${courseId}`, courseData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Update Course API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update course" };
  }
};

// Delete a course
export const deleteCourseAPI = async (courseId) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.delete(`${BASE_URL}/course/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Delete Course API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete course" };
  }
};

// Get course content (modules, units, assignments, quizzes)
export const getCourseContentAPI = async (courseId) => {
  console.log(courseId);
  
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/course/${courseId}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;

};

// Get course content (modules, units, assignments, quizzes)
export const getAllCoursesAPI = async () => {
    const token = getToken();
    const response = await axios.get(`${BASE_URL}/course/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
};

export const fetchEnrolledCoursesAPI = async()=>{
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/course/enrolled`,{
    headers:{
      Authorization: `Bearer ${token}`
      }
  })
  return response.data;
}

// --- NEW FUNCTION ---
// Mark an item (unit, assignment, quiz) as complete/incomplete for the logged-in user
export const markItemAsCompleteAPI = async ({ courseId, itemId, type, completed }) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    if (!courseId || !itemId || !type || typeof completed !== 'boolean') {
        console.error("markItemAsCompleteAPI validation failed:", { courseId, itemId, type, completed });
        throw { message: "Invalid parameters provided to mark item complete." };
    }

    // Use a consistent endpoint for progress updates, e.g., /course/:courseId/progress
    // The backend controller for this endpoint needs to handle different item types based on the payload.
    const url = `${BASE_URL}/course/${courseId}/progress`;
    const payload = {
      itemId: itemId,
      itemType: type, // Use 'itemType' in payload for clarity
      completed: completed,
    };

    console.log(`Sending PUT to ${url} with payload:`, payload); // Log URL and payload

    // Using PUT for updating the completion status
    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Mark item complete response for item ${itemId}:`, response.data); // Log success response
    return response.data; // Backend might return success confirmation or updated progress data
  } catch (error) {
    console.error("Mark Item Complete API Error:", error.response?.data || error.message);
    // Rethrow the error object from the response or a generic one
    throw error.response?.data || { message: "Failed to update item completion status" };
  }
};

export const  submitAssignmentAPI = async(data)=>{
  console.log(data);
  
  const token = getToken()
  const response = await axios.post(`${BASE_URL}/assignment-submission/submit`,data,{
    headers:{
      Authorization:`Bearer ${token}`,
      'Content-Type':'multipart/form-data',
    }
  })
  return response.data
}

export const submitQuizAPI = async (quizData) => {
  const token = getToken()
  const response = await axios.post(`${BASE_URL}/quiz-submission/submit`, quizData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getAdminDashboardDataAPI = async (page = 1, limit = 10, search = '') => {
  try {
      // Get token from session storage or context/state management
      const token = getToken()
      const config = {
          headers: {
              Authorization: `Bearer ${token}`, // Assuming Bearer token auth
              'Content-Type': 'application/json',
          },
          params: { // Send query parameters
              page,
              limit,
              search
          }
      };
      console.log(config);
      // Adjust the endpoint '/admin-dashboard' to match your backend route for getAdminDashboardData
      const response = await axios.get(`${BASE_URL}/course/admin-dashboard`, config);
      return response.data; // Should return { summary: {...}, list: {...} }
  } catch (error) {
      console.error("Error fetching admin dashboard data:", error.response?.data || error.message);
      throw error.response?.data || new Error('Failed to fetch dashboard data');
  }
};

export const getAdminSummaryCountsAPI = async () => {
  try {
    const token = getToken()
     const config = { headers: { Authorization: `Bearer ${token}` } };
     console.log(config);
     
     // Adjust endpoint '/admin-summary-counts'
     const response = await axios.get(`${BASE_URL}/course/admin-summary-counts`, config);
     return response.data; // { totalCourses, totalInstructors, totalStudents }
 } catch (error) {
     console.error("Error fetching admin summary counts:", error.response?.data || error.message);
     throw error.response?.data || new Error('Failed to fetch summary counts');
 }
}

export const fetchAdminDashboardStats = async () => {
  try {
    const token = getToken()
    const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BASE_URL}/course/dashboard-stats`, config);
      return response.data; // Should return { success: true, summary: {...}, growthData: [...] }
  } catch (error) {
      console.error("Error fetching admin dashboard stats:", error.response?.data || error.message);
      // Throw a more specific error or the error data itself
      throw error.response?.data || new Error('Failed to fetch admin dashboard stats');
  }
};

export const generateCertificateAPI = async (id) => {
    const token = getToken()
    const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BASE_URL}/course/certificate/${id}`, config);
      return response.data; 
};
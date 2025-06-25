import { BASE_URL } from "../utils/urls";
import axios from "axios";
import { getAuthHeaders } from "./quizAPI";
import { getToken } from "../utils/storageHandler";

/**
 * ✅ Create a new discussion forum
 * Access: Student only
 */
export const createDiscussionAPI = async (forumData) => {
  const token = getTokenn();
  const user = getUser();

  try {
    const response = await axios.post(`${BASE_URL}/discussion-forum`, forumData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Create Discussion API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to create discussion forum" };
  }
};

/**
 * ✅ Fetch all discussion forums
 * Access: Public
 */
export const fetchAllDiscussionsAPI = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/discussion-forum`);
    return response.data;
  } catch (error) {
    console.error("Fetch All Discussions API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch discussion forums" };
  }
};

/**
 * ✅ Fetch a specific discussion forum by ID
 * Access: Public
 */
export const fetchDiscussionByIdAPI = async (forumId) => {
  try {
    const response = await axios.get(`${BASE_URL}/discussion-forum/${forumId}`);
    return response.data;
  } catch (error) {
    console.error("Fetch Discussion By ID API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch discussion forum" };
  }
};

/**
 * ✅ Delete a discussion forum
 * Access: Authenticated users (ownership check should be backend side)
 */
export const deleteDiscussionAPI = async (forumId) => {
  const token = getToken();
  const user = getUser();

  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.delete(`${BASE_URL}/discussion-forum/${forumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Delete Discussion API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to delete discussion forum" };
  }
};

/**
 * ✅ Update a discussion forum
 * Access: Authenticated users (ownership check should be backend side)
 */
export const updateDiscussionAPI = async (forumId, forumData) => {
  const token = getToken();
  const user = getUser();

  try {
    const response = await axios.put(`${BASE_URL}/discussion-forum/${forumId}`, forumData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Update Discussion API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to update discussion forum" };
  }
};

export const getDiscussionByIdAPI = async (id) => {
    const response = await axios.get(`${BASE_URL}/discussion/${id}`,{
      headers: getAuthHeaders(),
  });
    return response.data;
};

export const getAllRepliesAPI = async (discussionId) => {
  const response = await axios.get(`${BASE_URL}/reply`, {
    headers: getAuthHeaders(),
    params: { discussionId }, // Pass discussionId as query param
  });
  return response.data;
};

export const getReplyByIdAPI = async (id) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/reply/${id}`, {
    
      headers: getAuthHeaders(),
    
  });
  return response.data;
};
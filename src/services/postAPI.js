// src/services/postAPI.js
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";


export const createPostAPI = async (postData) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.post(`${BASE_URL}/post`, postData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create post" };
  }
};

export const fetchAllPosts = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/post/all-posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch posts" };
  }
};

export const fetchPostByIdAPI = async (postId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch post" };
  }
};

export const fetchPostsByForumAPI = async (forumId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("No token found. Please log in.");
    }

    const response = await axios.get(`${BASE_URL}/post/discussion-forum/${forumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch posts by forum" };
  }
};

import axios from 'axios';
import { getToken } from '../Utils/StorageHandler';
import { BASE_URL } from '../utils/urls';


// Create Auth Headers Only If Token Exists
const authHeader = () => {
  const token = getToken();
  if (!token) throw new Error("Unauthorized: No token found");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

// Get all posts (public or protected depending on your API)
const getAllPosts = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/post`, token ? authHeader() : {});
  return response.data;
};

// Get post by ID
const getPostById = async (id) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/post/${id}`, token ? authHeader() : {});
  return response.data;
};

// Get posts by Forum ID
const getPostsByForumId = async (forumId) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/post/discussion-forum/${forumId}`, token ? authHeader() : {});
  return response.data;
};

// Get posts by User ID
const getPostsByUserId = async (userId) => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/post/user/${userId}`, token ? authHeader() : {});
  return response.data;
};

// Create post (requires auth)
const createPost = async (postData) => {
  const response = await axios.post(`${BASE_URL}/post`, postData, authHeader());
  return response.data;
};

// Update post (requires auth)
const updatePost = async (id, postData) => {
  const response = await axios.put(`${BASE_URL}/post/${id}`, postData, authHeader());
  return response.data;
};

// Delete post (requires auth)
const deletePost = async (id) => {
  const response = await axios.delete(`${BASE_URL}/post/${id}`, authHeader());
  return response.data;
};

// Export service
const postService = {
  getAllPosts,
  getPostById,
  getPostsByForumId,
  getPostsByUserId,
  createPost,
  updatePost,
  deletePost,
};

export default postService;

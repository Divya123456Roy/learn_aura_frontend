
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../Utils/StorageHandler";


// Fetch messages between two users
export const fetchMessagesBetweenUsersAPI = async ({ userId1, userId2 }) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.get(`${BASE_URL}/chat/users/${userId1}/${userId2}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch Messages Between Users API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch messages" };
  }
};

// Fetch messages in a group
export const fetchMessagesInGroupAPI = async (groupId) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.get(`${BASE_URL}/chat/groups/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch Messages In Group API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch group messages" };
  }

  
};

// Send a message
export const sendMessageAPI = async (messageData) => {
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.post(`${BASE_URL}/chat`, messageData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      
    });

    return response.data;
  } catch (error) {
    console.error("Send Message API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to send message" };
  }
  
};

// Fetch my followers
export const  fetchMyFollowersAPI = async () => {
  
  try {
    const token = getToken();
    if (!token) {
      throw { message: "No token found. Please log in." };
    }

    const response = await axios.get(`${BASE_URL}/user/follower`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch My Followers API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch followers" };
  }
};
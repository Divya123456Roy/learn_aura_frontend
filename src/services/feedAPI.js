import axios from "axios";
import { getToken } from "../Utils/StorageHandler";
import { BASE_URL } from "../utils/urls";


export const getUserFeedAPI = async (page = 1, limit = 2) => {
  const token = getToken()
  const response = await axios.get(`${BASE_URL}/discussion?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
};



export const createDiscussionAPI = async (data) => {
  const token = getToken()
  const response = await axios.post(`${BASE_URL}/discussion`, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
};

export const updateDiscussionAPI = async (id, data) => {
  const token = getToken()
  const response = await axios.put(`${BASE_URL}/discussion/${id}`, data,{
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data
};

export const deleteDiscussionAPI = async (id) => {
  const token = getToken()
  const response = await axios.delete(`${BASE_URL}/discussion/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data
};

export const createReplyAPI = async (data) => {
  const token = getToken()
  const response = await axios.post(`${BASE_URL}/discussion/reply/`,data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}
export const editReplyAPI = async (id,data) => {
  const token = getToken()
  const response = await axios.put(`${BASE_URL}/discussion/reply/${id}`,data,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}
export const deleteReplyAPI = async (id) => {
  const token = getToken()
  const response = await axios.delete(`${BASE_URL}/discussion/reply/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data
}

// services/groupService.js
import axios from "axios";
import { BASE_URL } from "../utils/urls";
import { getToken } from "../utils/storageHandler";

const API = "/api/groups";

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const createGroupAPI = async (formData) => {
  const token = getToken();
  console.log(formData);
  
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.post(`${BASE_URL}/study-group/`, formData, config);
  return res.data;
};

export const joinGroupAPI = async (data) => {
  const token = getToken();
  const res = await axios.post(`${BASE_URL}/study-group/addMember/${data}`,{}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
 
  return res.data;
};

export const getAllGroupsAPI = async () => {
  const token = getToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.get(`${BASE_URL}/study-group/`,config);
  return res.data;
};

export const getGroupById = async (id) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const updateGroup = async (id, formData) => {
  const token = sessionStorage.getItem("token");
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await axios.put(`${API}/${id}`, formData, config);
  return res.data;
};

export const deleteGroup = async (id) => {
  const res = await axios.delete(`${API}/${id}`, getAuthHeaders());
  return res.data;
};

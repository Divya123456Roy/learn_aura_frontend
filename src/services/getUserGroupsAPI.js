// services/groupService.js
import axios from 'axios';
import { getToken } from '../utils/storageHandler';

const BASE_URL = 'https://your-api-url.com/api';

export const getAllGroupsAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/groups`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // [{ _id, groupName, description }, ...]
};

export const getUserGroupsAPI = async () => {
  const token = getToken();
  const response = await axios.get(`${BASE_URL}/user/groups`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data; // [{ _id, groupName, description }, ...]
};

export const joinGroupAPI = async (groupId) => {
  const token = getToken();
  const response = await axios.post(
    `${BASE_URL}/groups/${groupId}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data; // { message: "Successfully joined the group" }
};
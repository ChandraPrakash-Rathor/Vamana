import axios from 'axios';
import Cookies from 'js-cookie';
import { baseUrl } from './config';

// Get auth token from Cookies (admin uses cookies, not localStorage)
const getAuthToken = () => {
  return Cookies.get('authToken');
};

// Get all members
export const getAllMembers = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${baseUrl}members`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Get single member by ID
export const getMemberById = async (id) => {
  const token = getAuthToken();
  const response = await axios.get(`${baseUrl}members/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// Update member status
export const updateMemberStatus = async (id, status) => {
  const token = getAuthToken();
  const response = await axios.put(
    `${baseUrl}members/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

// Delete member
export const deleteMember = async (id) => {
  const token = getAuthToken();
  const response = await axios.delete(`${baseUrl}members/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

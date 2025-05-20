import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

/**
 * Get all the current user items of a resource (e.g., posts, albums).
 */
export const getAll = async (resource, id) => {
  const response = await axios.get(`${BASE_URL}/${resource}/?userId=${id}`);
  return response.data;
};

/**
 * Get a single item by ID.
 */
export const getById = async (resource, id) => {
  const response = await axios.get(`${BASE_URL}/${resource}/${id}`);
  return response.data;
};

/**
 * Create a new item.
 */
export const create = async (resource, data) => {
  const response = await axios.post(`${BASE_URL}/${resource}`, data);
  return response.data;
};

/**
 * Update an item by ID (full update).
 */
export const update = async (resource, id, data) => {
  const response = await axios.put(`${BASE_URL}/${resource}/${id}`, data);
  return response.data;
};


/**
 * Delete an item by ID.
 */
export const remove = async (resource, id) => {
  await axios.delete(`${BASE_URL}/${resource}/${id}`);
  return true;
};

import api from "./axios.js";

const url='/lists';

export const getLists=(boardId)=> api.get(`${url}/${boardId}`);
export const createList =(data)=> api.post(url,data);
export const updateList =(id,data)=> api.patch(`${url}/${id}`,data);
export const deleteList =(id)=> api.delete(`${url}/${id}`);
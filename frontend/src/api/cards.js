import api from "./axios.js";

const url='/cards';

export const getCards =(listId)=> api.get(`${url}/${listId}`);
export const createCard =(data)=> api.post(url,data);
export const updateCards =(id,data)=> api.patch(`${url}/${id}`,data);
export const deleteCards =(id)=> api.delete(`${url}/${id}`);
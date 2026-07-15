import api from "../api/axios.js";

const url='/boards';
export const getBoards=()=> api.get(url);
export const getBoard=(id)=> api.get(`${url}/${id}`);
export const createBoard =(data)=> api.post(url,data);
export const updateBoard=(id,data)=> api.patch(`${url}/${id}`,data);
export const deleteBoard=(id)=> api.delete(`${url}/${id}`);
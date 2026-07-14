import api from "./axios.js";

export const signup= (data)=> api.post("/auth/signup",data);
export const login= (data)=> api.post("/auth/login",data);
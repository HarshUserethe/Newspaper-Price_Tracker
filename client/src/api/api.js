import axios from "axios";

const API = axios.create({ baseURL: "https://newspaper-price-tracker.onrender.com/api/records" });

export const getRecords = async () => (await API.get("/")).data;
export const createRecord = async (data) => (await API.post("/", data)).data;
export const updateRecord = async (id, data) => (await API.put(`/${id}`, data)).data;

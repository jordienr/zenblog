import { env } from "./env";

export const API_PATH = "/api/v1";
export const API_URL = `${env().BASE_API_URL}${API_PATH}`;

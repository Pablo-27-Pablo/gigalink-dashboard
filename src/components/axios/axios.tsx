import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://121.58.249.168:3033/api", // Your API address
  withCredentials: true, // REQUIRED to send/receive cookies
});

// Response Interceptor: Handle global errors (like 401 Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: Redirect to login or clear local storage
      console.error("Unauthorized! Redirecting...");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://121.58.249.168:3033/", // Your API address
  // REQUIRED to send/receive cookies
});

// Response Interceptor: Handle global errors (like 401 Unauthorized)

export default axiosInstance;

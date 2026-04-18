import axios from "axios";

const API_URL = "https://backend-ambience.onrender.com/api";
// const API_URL = "http://localhost:5000/api";

export const IMAGE_URL = "https://images.ambience.in/";
// export const IMAGE_URL = "http://localhost:5000/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);


// ✅ ADD THIS (GLOBAL IMAGE FUNCTION)
export const getImageSrc = (path) => {
  if (!path) return "";

  // if already full URL
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${IMAGE_URL}${path}`;
};

export default axiosInstance;
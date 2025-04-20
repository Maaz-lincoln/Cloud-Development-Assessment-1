import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

let refreshToken: string | null = null;

export function setAuthToken(
  token: string | null,
  refresh: string | null = null
) {
  console.log(token, "token...........");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
  refreshToken = refresh;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken
    ) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          "http://localhost:8000/auth/refresh",
          { refresh_token: refreshToken }
        );
        setAuthToken(data.access_token, refreshToken);
        originalRequest.headers["Authorization"] =
          `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        console.log(err, "error......");
        setAuthToken(null, null);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

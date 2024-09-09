import axios, { AxiosInstance, isAxiosError } from "axios";

import { tryRefreshToken } from "./auth";

const api: AxiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  baseURL: "/local",
});

const TOKEN_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    if (
      response.data.accessToken === "" &&
      response.data.refreshToken === "" &&
      response.data.expiresIn === 0
    ) {
      alert("인증이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.clear();
      window.location.replace("/login");
    }
    return response;
  },
  async (error) => {
    if (isAxiosError(error)) {
      if (error.status === 401) {
        // accessToken이 만료된 경우
        const accessToken = localStorage.getItem(TOKEN_KEY);
        const refreshToken = localStorage.getItem(REFRESH_KEY);

        if (!accessToken || !refreshToken) {
          // 로컬의 accessToken을 사용해서 요청을 보냈지만, 로컬스토리지에 accessToken이나 refreshToken이 없는 경우
          // (??) -> 원인 파악 불가, 에러 처리
          alert("네트워크 오류");
        } else {
          const refreshTokenResponse = await tryRefreshToken({
            refreshToken,
          });
          localStorage.setItem(
            "accessToken",
            refreshTokenResponse.data.accessToken,
          );
          localStorage.setItem(
            "refreshToken",
            refreshTokenResponse.data.refreshToken,
          );
          localStorage.setItem(
            "expiredTime",
            Date.now() + refreshTokenResponse.data.expiresIn,
          );
          return api(refreshTokenResponse.config);
        }
      } else {
        alert(`${error.status} ${error.response?.statusText}`);
      }
    }
  },
);

export default api;

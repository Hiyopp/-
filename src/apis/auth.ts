import api, { noInterceptorsApi } from "./api";

type joinPayloadType = {
  nickname: string | undefined;
  email: string | undefined;
  password: string | undefined;
  reCheckPw: string | undefined;
};

type loginPayloadType = {
  email: string | undefined;
  password: string | undefined;
};

export const postJoin = (joinPayload: joinPayloadType) => {
  const { nickname, email, password } = joinPayload;
  const payload = { nickname: nickname, email: email, password: password };
  return api.post(`/auth/register`, payload);
};

export const postLogin = (loginPayload: loginPayloadType) => {
  return noInterceptorsApi.post(`/auth/login`, loginPayload);
};

export const tryRefreshToken = (refreshValue: string) => {
  const payload = { refreshToken: refreshValue };
  return noInterceptorsApi.post(`/auth/refresh`, payload);
};

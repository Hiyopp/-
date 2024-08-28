import api from "./api";

type joinPayloadType = {
  nickname: string | undefined;
  email: string | undefined;
  password: string | undefined;
  reCheckPw: string | undefined;
};

export const postLogin = (joinPayload: joinPayloadType) => {
  const { nickname, email, password } = joinPayload;
  const payload = { nickname: nickname, email: email, password: password };
  return api.post(`/auth/register`, payload);
};

import { noInterceptorsApi } from "./api";

export const getBoardInfo = () => {
  return noInterceptorsApi.get(`/boards`);
};

export const getPostInfo = (boardId?: string) => {
  const payload = { boardUuid: boardId };
  return noInterceptorsApi.get(`/posts`, { params: payload });
};

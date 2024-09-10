import api, { noInterceptorsApi } from "./api";

export const getBoardInfo = () => {
  return noInterceptorsApi.get(`/boards`);
};

export const getLoginedBoardInfo = () => {
  return api.get(`/boards`);
};

export const getPostInfo = (boardId?: string) => {
  const payload = { boardUuid: boardId };
  return noInterceptorsApi.get(`/posts`, { params: payload });
};

export const postBoard = (payload: { title: string }) => {
  return api.post(`/boards`, payload);
};

interface postPayloadInfo {
  title: string;
  body: string;
  tags: string[];
}

export const postPost = (payload: postPayloadInfo, boardId: string) => {
  const postParams = { boardUuid: boardId };
  return api.post(`/posts`, payload, { params: postParams });
};

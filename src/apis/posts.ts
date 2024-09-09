import api from "./api";

export const getBoardInfo = () => {
  return api.get(`/boards`);
};

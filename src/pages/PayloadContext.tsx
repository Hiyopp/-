import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse, isAxiosError } from "axios";
import { createContext, ReactNode, useContext } from "react";
import { postJoin, postLogin } from "src/apis/auth";

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

type PayloadContextType = {
  joinPayload: joinPayloadType;
  joinMutate: UseMutationResult<unknown, unknown, void, unknown>;
  loginPayload: loginPayloadType;
  loginMutate: UseMutationResult<
    AxiosResponse<any, any>,
    unknown,
    void,
    unknown
  >;
};

const PayloadContext = createContext<PayloadContextType | undefined>(undefined);

export const usePayload = (): PayloadContextType => {
  const context = useContext(PayloadContext);
  if (!context) {
    throw new Error("useDice must be used within a DiceProvider");
  }
  return context;
};

export const PayloadProvider = ({ children }: { children: ReactNode }) => {
  const joinPayload: joinPayloadType = {
    nickname: undefined,
    email: undefined,
    password: undefined,
    reCheckPw: undefined,
  };
  const joinMutate = useMutation({
    mutationFn: () => postJoin(joinPayload),

    onSuccess: () => {
      alert("성공적으로 가입되었습니다.");

      window.location.replace("/login");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        alert(
          `가입에 실패했습니다. ${error.status} ${error.response?.statusText}`,
        );
      }
    },
  });
  const loginPayload: loginPayloadType = {
    email: undefined,
    password: undefined,
  };
  const loginMutate = useMutation({
    mutationFn: () => postLogin(loginPayload),

    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("expiredTime", Date.now() + res.data.expiresIn);

      alert("로그인 되었습니다.");
      window.location.replace("/");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        alert(
          `가입에 실패했습니다. ${error.status} ${error.response?.statusText}`,
        );
      }
    },
  });

  return (
    <PayloadContext.Provider
      value={{
        joinPayload,
        joinMutate,
        loginPayload,
        loginMutate,
      }}
    >
      {children}
    </PayloadContext.Provider>
  );
};

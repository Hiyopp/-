import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosResponse, isAxiosError } from "axios";
import { createContext, ReactNode, useContext } from "react";
import { postLogin } from "src/apis/auth";

type loginPayloadType = {
  email: string | undefined;
  password: string | undefined;
};

type PayloadContextType = {
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
        const errorMessage = error.response?.data.error;
        if (errorMessage === "Not Found") {
          alert(`유저 정보가 없습니다. ${errorMessage}`);
        } else {
          alert(`가입에 실패했습니다. ${errorMessage}`);
        }
      }
    },
  });

  return (
    <PayloadContext.Provider
      value={{
        loginPayload,
        loginMutate,
      }}
    >
      {children}
    </PayloadContext.Provider>
  );
};

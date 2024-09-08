import { useMutation } from "@tanstack/react-query";
import { postJoin } from "src/apis/auth";
import styled from "styled-components";

import { isJoinValid } from "./IsJoinValid";

const InputWrapper = styled.div`
  width: 90%;
  margin-top: 20px;
`;

const InputText = styled.h4`
  margin: 4px;
  font-size: 15px;
`;

const StyledInput = styled.input`
  width: 340px;
  padding: 7px;
  background: #f5f5f5;

  border: none;
  border-radius: 5px;
  outline: 0;

  &::placeholder {
    color: #bebebe;
  }
`;

type joinPayloadType = {
  nickname: string | undefined;
  email: string | undefined;
  password: string | undefined;
  reCheckPw: string | undefined;
};

export function InputBar({ content }: { content: string }) {
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
    onError: (error: unknown) => {
      alert(`가입에 실패했습니다. ${error}`);
    },
  });

  const HandleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "text") joinPayload.nickname = e.target.value;
    else if (e.target.name === "email") joinPayload.email = e.target.value;
    else if (e.target.name === "password") {
      if (content === "비밀번호 재확인") joinPayload.reCheckPw = e.target.value;
      else if (content === "비밀번호") joinPayload.password = e.target.value;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (isJoinValid(joinPayload)) joinMutate.mutate();
    }
  };

  const inputType = () => {
    if (content === "아이디") return "email";
    else if (content === "비밀번호" || content === "비밀번호 재확인")
      return "password";
    else if (content === "닉네임") return "text";
  };

  return (
    <InputWrapper>
      <InputText>{content}</InputText>
      <StyledInput
        type={inputType()}
        onChange={HandleOnChange}
        onKeyDown={handleKeyDown}
        name={inputType()}
      />
    </InputWrapper>
  );
}

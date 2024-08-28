import styled from "styled-components";

import { usePayload } from "../PayloadContext";
import isJoinValid from "./IsJoinValid";

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

export function InputBar({ content }: { content: string }) {
  const { joinPayload, joinMutate } = usePayload();

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
      isJoinValid(joinPayload, joinMutate);
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

import { useMutation } from "@tanstack/react-query";
import { postJoin } from "src/apis/auth";
import styled from "styled-components";

import { InputBar } from "./InputBar";
import { isJoinValid } from "./IsJoinValid";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const PageRange = styled.div`
  width: 400px;
`;

const TitleWrapper = styled.div`
  display: flex;
`;

const Title = styled.div`
  width: 100%;
  height: 40px;
  margin: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-family: "Ownglyph_meetme-Rg";
  font-size: 35px;
`;

const InputWrapper = styled.div`
  width: 100%;

  background: white;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  text-align: center;
  margin-top: 30px;
`;

const SubmitButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  &:focus {
    outline: none;
  }

  font-size: 35px;
  font-family: "Ownglyph_meetme-Rg";

  transition: transform 0.1s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

type joinPayloadType = {
  nickname: string | undefined;
  email: string | undefined;
  password: string | undefined;
  reCheckPw: string | undefined;
};

export function JoinPage() {
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

  const clickJoin = () => {
    if (isJoinValid(joinPayload)) joinMutate.mutate();
  };

  return (
    <Wrapper>
      <PageRange>
        <InputWrapper>
          <TitleWrapper>
            <Title>Postry</Title>
          </TitleWrapper>
          <InputBar content="닉네임" />
          <InputBar content="아이디" />
          <InputBar content="비밀번호" />
          <InputBar content="비밀번호 재확인" />
        </InputWrapper>
        <ButtonWrapper>
          <SubmitButton onClick={clickJoin}>가입하기</SubmitButton>
        </ButtonWrapper>
      </PageRange>
    </Wrapper>
  );
}

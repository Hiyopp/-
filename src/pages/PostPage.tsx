import { useMutation, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoginedBoardInfo, postBoard, postPost } from "src/apis/posts";
import styled from "styled-components";

const WholeWrap = styled.div`
  width: 100%;

  display: flex;
  justify-content: center;
`;

const CenterWrap = styled.div`
  width: 400px;

  display: flex;
  align-items: center;
  flex-direction: column;

  position: relative;
`;

const StyledHeader = styled.div`
  width: 100%;
  height: 80px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: "Ownglyph_meetme-Rg";
  font-size: 30px;
  color: grey;

  margin-bottom: 30px;
`;

const StyledFont = styled.div`
  font-family: "Ownglyph_meetme-Rg";
  font-size: 20px;
  color: grey;

  margin-bottom: 30px;
`;

const SelectBoardWrap = styled.div`
  margin-bottom: 30px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SelectBoard = styled.button`
  width: 90%;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;

  background: #f5f5f5;

  font-size: 20px;
  cursor: pointer;

  transition: transform 0.1s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
`;

const StyledInput = styled.input<{ $height?: string }>`
  padding: 5%;
  width: 80%;
  height: ${(props) => props.$height ?? "100px"};

  border: 0;
  outline: 0;
  font-family: "Ownglyph_meetme-Rg";
  background: #f5f5f5;

  &::placeholder {
    color: #bebebe;
    text-align: center;
  }
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  padding: 10px;
  width: 110px;

  font-weight: bold;
  font-size: 20px;
  cursor: pointer;

  transition: transform 0.1s ease-in-out;
  &:hover {
    transform: scale(1.1);
  }
  margin-bottom: 30px;
`;

export function PostPage() {
  const navigate = useNavigate();
  const [boardText, setBoardText] = useState("");
  const boardPayload: { title: string } = { title: "" };
  const [isBoardClicked, setIsBoardClicked] = useState(false);
  const [boardId, setBoardId] = useState<string>();

  const [postPayload, setPostPayload] = useState({
    title: "",
    body: "",
    tags: [""],
  });

  const { isLoading: isBoardLoading, data: boardData } = useQuery({
    queryKey: [`getBoards`],
    queryFn: () => getLoginedBoardInfo(),
    retry: 0,
  });

  const boards = boardData?.data.list;

  const boardMutate = useMutation({
    mutationFn: () => postBoard(boardPayload),

    onSuccess: (res) => {
      if (res.status === 200) alert("포스트 되었습니다");
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        alert(
          `가입에 실패했습니다. ${error.status} ${error.response?.statusText}`,
        );
      }
    },
  });

  const handleBoardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBoardText(e.target.value);
  };

  const boardOnclick = () => {
    boardPayload.title = boardText;
    if (boardText === "") alert("값을 입력해주세요");
    else boardMutate.mutate();
  };

  const postMutate = useMutation({
    mutationFn: () => postPost(postPayload, boardId ?? ""),

    onSuccess: (res) => {
      if (res.status === 200) {
        alert("포스트 되었습니다");
        location.reload();
      }
    },
    onError: (error: unknown) => {
      if (isAxiosError(error)) {
        alert(
          `가입에 실패했습니다. ${error.status} ${error.response?.statusText}`,
        );
      }
    },
  });

  const handlePostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "title")
      setPostPayload({ ...postPayload, title: e.target.value });
    if (e.target.name === "body")
      setPostPayload({ ...postPayload, body: e.target.value });
    if (e.target.name === "tag") {
      const tagList = e.target.value.split(" ").join("").split("#");
      tagList.shift(); //맨 처음 #앞에 빈 배열 제거
      setPostPayload({ ...postPayload, tags: tagList });
    }
  };

  const postBoardOnclick = (id: string) => {
    setBoardId(id);
    setIsBoardClicked(true);
  };

  const postOnclick = () => {
    if (
      postPayload.body !== "" &&
      postPayload.title !== "" &&
      postPayload.tags.length !== 0
    )
      postMutate.mutate();
    else alert("값을 입력해주세요");
  };

  return (
    <WholeWrap>
      <CenterWrap>
        <StyledButton
          onClick={() => navigate(-1)}
          style={{ position: "absolute", left: "0", width: "0" }}
        >
          {"<-"}
        </StyledButton>
        <StyledHeader>보드 포스트하기</StyledHeader>
        <StyledInput
          type="text"
          onChange={handleBoardChange}
          placeholder="포스트 내용"
        />
        <StyledButton onClick={boardOnclick}>포스트</StyledButton>
        <StyledHeader>내용 포스트하기</StyledHeader>
        {!isBoardClicked && (
          <>
            <StyledFont>포스트할 보드를 선택하세요</StyledFont>
            <SelectBoardWrap>
              {!isBoardLoading &&
                boards.map((board: { id: number; title: string }) => (
                  <SelectBoard
                    key={board.id}
                    onClick={() => postBoardOnclick(String(board.id))}
                  >
                    {board.title}
                  </SelectBoard>
                ))}
            </SelectBoardWrap>
          </>
        )}
        {isBoardClicked && (
          <>
            <StyledFont>포스트할 내용을 입력하세요</StyledFont>
            <StyledInput
              type="text"
              onChange={handlePostChange}
              placeholder="제목"
              name="title"
              $height="20"
            />
            <StyledInput
              type="text"
              onChange={handlePostChange}
              placeholder="내용"
              name="body"
            />
            <StyledInput
              type="text"
              onChange={handlePostChange}
              placeholder="#테그 #입력"
              name="tag"
              $height="20"
            />
            <StyledButton onClick={postOnclick}>포스트</StyledButton>
          </>
        )}
      </CenterWrap>
    </WholeWrap>
  );
}

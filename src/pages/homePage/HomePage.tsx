import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBoardInfo, getPostInfo } from "src/apis/posts";
import styled from "styled-components";

import BackImg from "../../../public/imgs/background-picture.svg";
import Fire from "../../../public/imgs/fire.svg";
import Person from "../../../public/imgs/person.svg";
import Smoke from "../../../public/imgs/smoke.svg";
import MessageBox from "../../../public/imgs/speechBox.svg";
import MessageCircle from "../../../public/imgs/speechCircle.svg";
import { fadeIn, fadeOut, fire, rotation, smoke } from "../Keyframes";
import {
  CHANGE_DOWN_PAGE,
  CHANGE_UP_PAGE,
  DETAIL,
  HOME,
  SCROLL_DOWN_CHANGE,
  SCROLL_UP_CHANGE,
} from "./HomePage.const";

const WholeWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const BackgroundImg = styled.div.attrs<{
  $path: string;
  $widthSize: number | undefined;
  $isTitleClicked: boolean;
}>((props) => ({
  style: {
    width: `${props.$widthSize}px`,
    height: `${props.$widthSize && props.$widthSize * (765 / 1440)}px`,
  },
}))`
  width: ${(props) => String(props.$widthSize)}px;
  height: ${(props) =>
    props.$widthSize && String(props.$widthSize * (765 / 1440))}px;
  background-image: url(${(props) => props.$path});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;

  transition: transform 1s ease-in-out;
  transform: ${(props) =>
    props.$isTitleClicked && "scale(500%) translateY(28%) translateX(-9%)"};
`;

const NavigationBarWrap = styled.div`
  height: 90px;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;

  display: flex;
  justify-content: center;
`;

const NavigationButton = styled.button`
  font-size: 30px;
  margin-right: 20px;
  &:last-child {
    margin-right: 0;
  }
  cursor: pointer;

  transition: font-size 0.1s ease-in-out;
  &:hover {
    font-size: 35px;
  }
`;

const PersonImg = styled.img`
  width: 20%;
  position: absolute;

  top: 33%;
  right: 32%;

  animation: ${rotation} 3s infinite ease-in-out;
`;

const FireImg = styled.img`
  width: 12%;
  position: absolute;

  top: 35%;
  right: 50%;

  animation: ${fire} 4s infinite ease-in-out;
`;

const SmokeImg = styled.img`
  width: 3%;
  position: absolute;

  top: 51%;
  right: 41%;

  animation: ${smoke} 2.5s infinite ease-in-out;
`;

const MessageScrollWrap = styled.div`
  width: 17%;
  height: 33%;
  position: absolute;
  top: 6%;
  right: 32%;
`;

const MessageScroll = styled.div`
  height: 100%;
  overflow-y: scroll;
  position: relative;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const MessageSize = styled.div`
  height: 1000px;
`;

const MessageContentWrap = styled.div`
  width: 80%;
  height: 65%;
  position: absolute;

  top: 10%;
  right: 10%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const BoardContent = styled.div`
  word-break: break-all;

  cursor: pointer;
  transition: font-size 0.1s ease-in-out;
  font-size: 25px;
  &:hover {
    font-size: 30px;
  }
  font-family: "Ownglyph_meetme-Rg";
  z-index: 10;
`;

const PostTitle = styled.div`
  word-break: break-all;

  font-family: "Ownglyph_meetme-Rg";
`;

const PostBody = styled.div`
  word-break: break-all;

  font-size: 10px;
  font-weight: 600;
`;

const MessageBoxImg = styled.img.attrs<{
  $sizeNumber: number;
  $page: number;
  $isUp: boolean;
  $isDown: boolean;
}>(() => ({}))`
  width: 80%;
  position: absolute;

  top: 6%;
  right: 10%;
  opacity: ${(props) => (props.$page === 0 ? 0 : 1)};
  animation: ${(props) =>
      props.$isUp
        ? props.$sizeNumber > CHANGE_UP_PAGE && fadeIn
        : props.$isDown &&
          props.$page !== 0 &&
          props.$sizeNumber < CHANGE_DOWN_PAGE &&
          fadeIn}
    0.5s;
`;

const MessageCircleImg = styled.img.attrs<{
  $sizeNumber: number;
  $isUp: boolean;
}>((props) => ({
  style: {
    width: `${props.$sizeNumber * 0.5}%`,
    transform: `
      translateY(${-props.$sizeNumber * 8}%)`,
    opacity: `${props.$sizeNumber >= CHANGE_UP_PAGE ? (props.$isUp ? 0 : 1) : 1}`,
  },
}))`
  position: absolute;

  top: 100%;
  right: 40%;
  animation: ${(props) =>
      props.$sizeNumber >= CHANGE_UP_PAGE && (props.$isUp ? fadeOut : fadeIn)}
    0.5s;
`;

const PostedImgWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 60%;
  height: 30%;
`;

const PostedImg = styled.img`
  width: 50%;
  height: 100%;
`;

let scrollDirection = 0;
let introduce = true;
let previousPage = 0;

export function HomePage() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [boxScrollAmout, setBoxScrollAmout] = useState(new Array(3).fill(0));
  const [messagePage, setMessagePage] = useState(0);
  const [isScrollChanged, setIsScrollChanged] = useState({
    //스크롤 바뀐 후 한 번만 실행하기 위한 boolean
    up: false,
    down: false,
  });
  const scroll = document.getElementById("MessageScrollId");

  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [clickedPostUuid, setClickedPostUuid] = useState();
  //위에 대한 주석,, 리스트 order 이용해도 되지만, api를 하나씩 불러오는 방향으로 useState 사용.
  const [postParams, setPostParams] = useSearchParams();
  const query = postParams.get("mode") ?? "";

  const { isLoading: isBoardLoading, data: boardData } = useQuery({
    queryKey: [`getBoards`],
    queryFn: () => getBoardInfo(),
    retry: 0,
  });

  const { isLoading: isPostsLoading, data: postsData } = useQuery({
    queryKey: [`getPosts${clickedPostUuid}`],
    queryFn: () => getPostInfo(clickedPostUuid ?? undefined),
    retry: 0,
  });

  const boards = boardData?.data.list;
  const posts = postsData?.data.list;

  const lastPage =
    !isBoardLoading && !isPostsLoading
      ? (query === HOME && messagePage === boards.length) ||
        (query === DETAIL && messagePage === posts.length)
      : undefined;

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth)); //화면의 width 설정
    scroll?.addEventListener("wheel", (e) => (scrollDirection = e.deltaY), {
      passive: true,
    });
    return () => {
      // cleanup
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
      scroll?.removeEventListener("wheel", (e) => (scrollDirection = e.deltaY));
    };
  }, [scroll]);

  useEffect(() => {
    if (introduce) {
      setTimeout(
        //사람 보인 후 alert하도록
        () =>
          alert(
            "사람 머리 윗부분을 드레그하여 board를 보세요, \n그리고 보드를 클릭하여 내용을 확인하세요!",
          ),
        10,
      );
      introduce = false;
    }
  }, []);

  const constantOfEachCircle = () => {
    const constant = 0.05;
    const _boxScrollAmout = boxScrollAmout;
    if (!isBoardLoading && boards && !isPostsLoading && posts) {
      if (
        lastPage &&
        scrollDirection > 0 &&
        !isScrollChanged.up &&
        boxScrollAmout[0] >= CHANGE_UP_PAGE
      ) {
        alert("마지막 페이지입니다");
        scroll?.scrollTo(0, 25.9 / constant);
        setIsScrollChanged({ ...isScrollChanged, up: false });
      } else {
        if (
          boxScrollAmout[0] >= CHANGE_UP_PAGE &&
          !isScrollChanged.up && //스크롤 바뀌기 전에 한 번만 실행
          scrollDirection > 0
        ) {
          //위로 스크롤할 때 페이지 변경
          setMessagePage(messagePage + 1);
          setIsScrollChanged({ ...isScrollChanged, up: true });
        }
        if (boxScrollAmout[0] >= SCROLL_UP_CHANGE && scrollDirection > 0) {
          //위로 스크롤할 때 스크롤 이전으로 이동(무한 로딩)
          scroll?.scrollTo(0, 18 / constant);
          setIsScrollChanged({ ...isScrollChanged, up: false });
        }
        if (boxScrollAmout[0] < CHANGE_UP_PAGE && isScrollChanged.up)
          //isScrollChanged가 최기화되지 않았을 때 초기화
          setIsScrollChanged({ ...isScrollChanged, up: false });
        if (
          boxScrollAmout[0] <= CHANGE_DOWN_PAGE &&
          !isScrollChanged.down && //스크롤 바뀌기 전에 한 번만 실행
          scrollDirection < 0 &&
          messagePage !== 0
        ) {
          //아래로 스크롤할 때 페이지 변경
          setMessagePage(messagePage - 1);
          setIsScrollChanged({ ...isScrollChanged, down: true });
        }

        if (boxScrollAmout[0] <= SCROLL_DOWN_CHANGE && scrollDirection < 0) {
          //아래로 스크롤할 때 스크롤 이전으로 이동(무한 로딩)
          if (messagePage !== 0) scroll?.scrollTo(0, 28 / constant);
          setIsScrollChanged({ ...isScrollChanged, down: false });
        }
        if (boxScrollAmout[0] > CHANGE_DOWN_PAGE && isScrollChanged.down)
          //isScrollChanged가 최기화되지 않았을 때 초기화
          setIsScrollChanged({ ...isScrollChanged, down: false });
      }
      if (scroll) {
        boxScrollAmout.map((circles, index) => {
          _boxScrollAmout[index] = scroll.scrollTop * constant - index * 10;
          if (_boxScrollAmout[index] < 0) _boxScrollAmout[index] = 0;
        });
      }
    }

    setBoxScrollAmout([..._boxScrollAmout]);
  };

  const clickTitle = () => {
    setClickedPostUuid(boards[messagePage - 1].id);
    setIsTitleClicked(true);
    previousPage = messagePage;
    setMessagePage(1);

    postParams.set("mode", DETAIL);
    setPostParams(postParams);
  };

  const clickBack = () => {
    setPostParams();
    setMessagePage(previousPage);
    setIsTitleClicked(false);
  };

  const clickLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    alert("로그아웃 되었습니다");
  };

  useEffect(() => {
    query !== DETAIL && (setPostParams(), setIsTitleClicked(false));
  }, [query, setPostParams]);

  return (
    <WholeWrap>
      <BackgroundImg
        $path={BackImg}
        $widthSize={width}
        $isTitleClicked={isTitleClicked}
      >
        <PersonImg src={Person} />
        <FireImg src={Fire} />
        <SmokeImg src={Smoke} />
        {!isBoardLoading && !isPostsLoading && (
          <MessageScrollWrap>
            <MessageBoxImg
              src={MessageBox}
              $sizeNumber={boxScrollAmout[0]}
              $page={messagePage}
              $isUp={scrollDirection > 0}
              $isDown={scrollDirection < 0}
            />
            {boxScrollAmout.map((circles, index) => (
              <MessageCircleImg
                key={index}
                src={MessageCircle}
                $sizeNumber={circles}
                $isUp={scrollDirection > 0}
              />
            ))}
            {messagePage - 1 >= 0 && !isPostsLoading && !isBoardLoading && (
              <MessageContentWrap>
                {isTitleClicked ? (
                  <>
                    <PostTitle>
                      {posts[messagePage - 1]
                        ? posts[messagePage - 1].title
                        : "게시물이 없습니다."}
                    </PostTitle>
                    <PostBody>
                      {posts[messagePage - 1]
                        ? posts[messagePage - 1].body
                        : ""}
                    </PostBody>
                    {posts[messagePage - 1] &&
                      posts[messagePage - 1].images.length > 0 && (
                        <PostedImgWrap>
                          {posts[messagePage - 1].images.map(
                            (img: { image: string }, index: number) => (
                              <PostedImg
                                key={index}
                                src={`data:image/jpeg;base64, ${img.image}`}
                              />
                            ),
                          )}
                        </PostedImgWrap>
                      )}
                  </>
                ) : (
                  <BoardContent onClick={clickTitle}>
                    {boards[messagePage - 1].title}
                  </BoardContent>
                )}
              </MessageContentWrap>
            )}
            <MessageScroll id="MessageScrollId" onScroll={constantOfEachCircle}>
              <MessageSize />
            </MessageScroll>
          </MessageScrollWrap>
        )}
      </BackgroundImg>
      <NavigationBarWrap>
        <NavigationButton onClick={() => navigate("/login")}>
          로그인
        </NavigationButton>
        {isTitleClicked && (
          <NavigationButton onClick={clickBack}>뒤로가기</NavigationButton>
        )}
        <NavigationButton onClick={() => navigate("/post")}>
          포스트
        </NavigationButton>
        <NavigationButton onClick={clickLogout}>로그아웃</NavigationButton>
      </NavigationBarWrap>
    </WholeWrap>
  );
}

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
    props.$isTitleClicked && "scale(5) translateY(30%) translateX(-9%)"};
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
  margin-right: 30px;
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
  justify-content: center;
  align-items: center;
`;

const MessageContent = styled.div`
  word-break: break-all;

  cursor: pointer;
  transition: font-size 0.1s ease-in-out;
  &:hover {
    font-size: 115%;
  }
  font-weight: 600;
  z-index: 10;
`;

const MessageBoxImg = styled.img.attrs<{ $sizeNumber: number; $page: number }>(
  () => ({}),
)`
  width: 80%;
  position: absolute;

  top: 6%;
  right: 10%;
  opacity: ${(props) => props.$page === 0 && 0};
  animation: ${(props) => props.$sizeNumber >= CHANGE_UP_PAGE && fadeIn} 0.5s;
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

let scrollDirection = 0;
let introduce = true;

export function HomePage() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [boxScrollAmout, setBoxScrollAmout] = useState(new Array(3).fill(0));
  const [messagePage, setMessagePage] = useState(0);
  const [isScrollChanged, setIsScrollChanged] = useState({
    up: false,
    down: false,
  });
  const scroll = document.getElementById("MessageScrollId");

  const [isTitleClicked, setIsTitleClicked] = useState(false);
  const [postParams, setPostParams] = useSearchParams();
  const query = postParams.get("mode") ?? "";

  const { isLoading: isBoardLoading, data: boardData } = useQuery({
    queryKey: [`getBoards`],
    queryFn: () => getBoardInfo(),
    retry: 0,
  });

  const { isLoading: isPostsLoading, data: postsData } = useQuery({
    queryKey: [`getPosts`],
    queryFn: () => getPostInfo(),
    retry: 0,
  });

  const boards = boardData?.data.list;
  const posts = postsData?.data.list;

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
    if (!isBoardLoading && boards) {
      if (messagePage === boards.length && scrollDirection > 0) {
        scroll?.scrollTo(0, 25.9 / constant);
      } else {
        if (
          boxScrollAmout[0] >= CHANGE_UP_PAGE &&
          !isScrollChanged.up &&
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
        if (
          boxScrollAmout[0] <= CHANGE_DOWN_PAGE &&
          !isScrollChanged.down &&
          scrollDirection < 0 &&
          messagePage !== 0
        ) {
          //아래로 스크롤할 때 페이지 변경
          setMessagePage(messagePage - 1);
          setIsScrollChanged({ ...isScrollChanged, down: true });
        }

        if (
          boxScrollAmout[0] <= SCROLL_DOWN_CHANGE &&
          scrollDirection < 0 &&
          messagePage !== 0
        ) {
          //아래로 스크롤할 때 스크롤 이전으로 이동(무한 로딩)
          scroll?.scrollTo(0, 28 / constant);
          setIsScrollChanged({ ...isScrollChanged, down: false });
        }
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
    setIsTitleClicked(true);
    postParams.set("mode", DETAIL);
    setPostParams(postParams);
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
        {!isBoardLoading && (
          <MessageScrollWrap>
            <MessageBoxImg
              src={MessageBox}
              $sizeNumber={boxScrollAmout[0]}
              $page={messagePage}
            />
            {boxScrollAmout.map((circles, index) => (
              <MessageCircleImg
                key={index}
                src={MessageCircle}
                $sizeNumber={circles}
                $isUp={scrollDirection > 0}
              />
            ))}
            {messagePage - 1 >= 0 && (
              <MessageContentWrap>
                <MessageContent onClick={clickTitle}>
                  {boards[messagePage - 1].title}
                </MessageContent>
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
        <NavigationButton onClick={() => navigate("/post")}>
          포스트
        </NavigationButton>
      </NavigationBarWrap>
    </WholeWrap>
  );
}

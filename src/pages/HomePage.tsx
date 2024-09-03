import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import BackImg from "../../public/imgs/background-picture.svg";
import Person from "../../public/imgs/person.svg";

const WholeWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const BackgroundImg = styled.div<{
  $path: string;
  $widthSize: number | undefined;
}>`
  width: ${(props) => String(props.$widthSize)}px;
  height: ${(props) =>
    props.$widthSize && String(props.$widthSize * (765 / 1440))}px;
  background-image: url(${(props) => props.$path});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
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
`;

export function HomePage() {
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth)); //화면의 width 설정
    return () => {
      // cleanup
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  return (
    <WholeWrap>
      <BackgroundImg $path={BackImg} $widthSize={width}>
        <PersonImg src={Person} />
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

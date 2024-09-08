import { keyframes } from "styled-components";

export const rotation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
`;

export const smoke = keyframes`
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  80% {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px) scale(1.5, 1);
  }
  100% {
    opacity: 0;
  }
`;

export const fire = keyframes`
  0% {
    transform: skew(10deg, 0deg) translateX(-10px);
  }
  50% {
    transform: skew(15deg, 0deg) translateX(-15px) scale(1.0, 1);
  }
  100% {
    transform: skew(10deg, 0deg) translateX(-10px);
  }
`;

export const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export function HomePage() {
  const navigate = useNavigate();

  const test = () => {
    console.log(localStorage.getItem("test"));
  }

  return <button onClick={test}>home</button>;
}

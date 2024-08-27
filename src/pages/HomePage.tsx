import { useNavigate } from "react-router-dom";
import styled from "styled-components";

export function HomePage() {
  const navigate = useNavigate();

  navigate("/loginPage");

  return <div>home</div>;
}

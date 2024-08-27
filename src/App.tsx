import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";

const GlobalStyle = styled.div`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <GlobalStyle>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/loginPage" element={<LoginPage />} />
      </Routes>
    </GlobalStyle>
  );
}

export default App;

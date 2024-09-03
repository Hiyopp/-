import { Route, Routes } from "react-router-dom";
import styled from "styled-components";

import { HomePage } from "./pages/HomePage";
import { JoinPage } from "./pages/joinPage/JoinPage";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { PayloadProvider } from "./pages/PayloadContext";
import { PostPage } from "./pages/PostPage";

const GlobalStyle = styled.div`
  width: 100vw;
  height: 100vh;
`;

function App() {
  return (
    <PayloadProvider>
      <GlobalStyle>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/join" element={<JoinPage />} />
        </Routes>
      </GlobalStyle>
    </PayloadProvider>
  );
}

export default App;

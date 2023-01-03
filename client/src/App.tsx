import { Route, Routes } from "react-router-dom";
import ContextProvider from "./context/ContextProvider";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import ProtectedRoutes from "./routes/ProtectedRoutes";
import Home from "./routes/Home/Home";
import Game from "./routes/Game/Game";
import NotFound from "./routes/NotFound/NotFound";

import "./global.css";

const App = (): JSX.Element => {
  return (
    <ContextProvider>
      <Header />
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/game/:gameCode" element={<Game />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </ContextProvider>
  );
};

export default App;

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Search } from "./pages/Search";
import { Guide } from "./pages/Guide";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Search />} path="/search" />
        <Route element={<Guide />} path="/guide" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

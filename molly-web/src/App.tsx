import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Search } from "./pages/Search";
import { Guide } from "./pages/Guide";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Search />} path="/" />
          <Route element={<Guide />} path="/recipe/:id" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

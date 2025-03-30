import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { Search } from "./pages/Search";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Recipe } from "./pages/Recipe";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Search />} path="/" />
          <Route element={<Search />} path="/import" />
          <Route element={<Search />} path="/search" />
          <Route element={<Recipe />} path="/recipe/:id" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

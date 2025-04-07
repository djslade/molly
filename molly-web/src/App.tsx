import { BrowserRouter, Routes, Route } from "react-router";
import { Search } from "./pages/Search";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Recipe } from "./pages/Recipe";
import { Header } from "./modules/header/Header";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route element={<Search />} path="/" />
          <Route element={<Search />} path="/import" />
          <Route element={<Search />} path="/search" />
          <Route element={<Recipe />} path="/recipe/:id" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="signup" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

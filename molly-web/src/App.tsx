import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Hi banana!</h1>
      <Button variant="destructive">Hello world!</Button>
    </>
  );
}

export default App;

import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  return (
    <>
      <header className="h-20 flex items-center justify-between bg-accent-foreground">
        Molly
      </header>
      <h1>Cooking Made Easy</h1>
      <h2>
        Home cooking got you down? Leave it to Molly. Your personalized Sous
        Chef will guide you step by step through recipes, from prep to plating.
      </h2>
      <Button variant="default" size="lg">
        Get started
      </Button>
      <h2>No Hallucinations</h2>
      <p>Molly is not powered by an LLM. She's built for humans, by humans.</p>
    </>
  );
}

export default App;

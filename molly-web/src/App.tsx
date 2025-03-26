import "./App.css";
import { Guide } from "./modules/guide/Guide";

function App() {
  return (
    <>
      <header className="h-20 items-center justify-between bg-violet-950 flex">
        <div className="px-6">
          <a href="/">
            <h1 className="text-3xl font-black text-violet-50">molly</h1>
          </a>
        </div>
      </header>
      <main className="min-h-[calc(100vh-80px)] p-6 bg-violet-300 flex flex-col justify-center">
        <Guide />
      </main>
    </>
  );
}

export default App;

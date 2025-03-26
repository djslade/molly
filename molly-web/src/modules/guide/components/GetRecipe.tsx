import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { SocketResponse } from "../types/socketResponse";
import { Recipe } from "../types/recipe";

interface GetRecipeProps {
  setRecipeData: React.Dispatch<React.SetStateAction<Recipe | null>>;
  next: () => void;
}

export const GetRecipe = ({ setRecipeData, next }: GetRecipeProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [recipeURL, setRecipeURL] = useState<string>("");

  const changeRecipeURL = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (loading) return;
    setRecipeURL(evt.target.value);
  };

  const handleResult = (value: SocketResponse) => {
    try {
      if (value.status == "OK" && value.recipe) {
        setRecipeData(value.recipe);
      }
      next();
    } catch (err) {
      console.log(err);
    } finally {
      socket.off(`scrape.${recipeURL}`, handleResult);
      setLoading(false);
    }
  };

  const onSubmit = () => {
    if (loading) return;
    socket.on(`scrape.${recipeURL}`, handleResult);
    socket.emit("scrape.request", { url: recipeURL });
    setLoading(true);
  };

  useEffect(() => {
    const onError = (value: SocketResponse) => {
      console.log(value);
      socket.off(`scrape.${recipeURL}`, handleResult);
      setLoading(false);
    };

    socket.on("error", onError);

    return () => {
      socket.off("error", onError);
    };
  }, []);

  return (
    <section>
      <h1>Step 1: Find a recipe</h1>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="url"
          placeholder="Recipe URL"
          value={recipeURL}
          onChange={changeRecipeURL}
        />
        <Button onClick={onSubmit}>Next</Button>
      </div>
    </section>
  );
};

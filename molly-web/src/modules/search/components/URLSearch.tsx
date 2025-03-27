import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { SocketResponse } from "@/types/socketResponse";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSetAtom } from "jotai";
import { recipeAtom } from "@/store/recipe";
import { ClipLoader } from "react-spinners";

export const URLSearch = () => {
  const setRecipeData = useSetAtom(recipeAtom);

  const [loading, setLoading] = useState<boolean>(false);

  const [recipeURL, setRecipeURL] = useState<string>("");

  const changeRecipeURL = (evt: ChangeEvent<HTMLInputElement>): void => {
    if (loading) return;
    setRecipeURL(evt.target.value);
  };

  const handleResult = (value: SocketResponse) => {
    try {
      if (value.status != "OK") {
        throw new Error(value.status);
      }
      setRecipeData(value.recipe);
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
    <Card className="w-full">
      <CardContent className="flex flex-col gap-6">
        <CardTitle>Search with URL</CardTitle>
        <div className="flex w-full items-center space-x-2">
          <Input
            disabled={loading}
            type="url"
            placeholder="Recipe URL"
            value={recipeURL}
            onChange={changeRecipeURL}
          />
          <Button
            onClick={onSubmit}
            disabled={loading}
            className="disabled:bg-violet-500"
          >
            {loading ? <ClipLoader size={20} color="#f5f3ff" /> : "Search"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

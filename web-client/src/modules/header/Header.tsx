import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router";

export const Header = () => {
  return (
    <header className="h-20 items-center justify-between bg-amber-100 flex">
      <div className="px-6 max-w-5xl w-full mx-auto my-0 flex items-center justify-between">
        <a href="/">
          <h1 className="text-3xl font-black text-amber-800">molly</h1>
        </a>
        <div className="flex gap-3">
          <Link
            to={`/login`}
            className={buttonVariants({ variant: "secondary" })}
          >
            Log in
          </Link>
          <Link
            to={`/signup`}
            className={buttonVariants({ variant: "default" })}
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
};

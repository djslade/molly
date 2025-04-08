import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FormEvent } from "react";
import { Link } from "react-router";
import { Formik, Form } from "formik";

export const Signup = () => {
  const handleSignup = () => {};

  return (
    <main className="min-h-[calc(100vh-80px)] bg-amber-50 flex flex-col items-center py-6 px-3">
      <div className="w-full max-w-lg">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Signup</CardTitle>
            </CardHeader>
            <CardContent>
              <Formik
                initialValues={{ email: "", password: "", confirmPassword: "" }}
                onSubmit={handleSignup}
              ></Formik>
              <form onSubmit={handleSignup}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" required />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full">
                      Sign up
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="">
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled
                            >
                              Login with Google
                            </Button>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Coming soon!</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

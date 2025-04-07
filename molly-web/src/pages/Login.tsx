import { LoginForm } from "@/components/login-form";

export const Login = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] bg-amber-50 flex flex-col items-center py-6 px-3">
      <div className="w-full max-w-lg">
        <LoginForm />
      </div>
    </main>
  );
};

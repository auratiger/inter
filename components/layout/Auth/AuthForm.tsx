import { Suspense, useState } from "react";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("./Login"), { ssr: false });
const Register = dynamic(() => import("./Register"), { ssr: false });

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  // Toggle Sign/Signup
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <Suspense fallback={`Loading...`}>
        {isLogin ? (
          <Login switchToRegister={switchAuthModeHandler} />
        ) : (
          <Register switchToLoginIn={switchAuthModeHandler} />
        )}
      </Suspense>
    </div>
  );
}

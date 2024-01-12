import { useId } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

import { BaseUser } from "models/User";
import { trpc } from "utils/trpc";

import FormInput from "@/components/shared/inputs/FormInput";

type LoginProps = {
  switchToRegister: (isNewUser?: boolean, message?: string) => void;
};

export default function Login({ switchToRegister }: LoginProps) {
  const { mutateAsync: loginUser } = trpc.authRouter.loginUser.useMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const id = useId();
  const router = useRouter();

  const { ref: emailRef, ...emailControl } = register("email", {
    required: true,
    pattern: {
      value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
      message: "Invalid email",
    },
  });

  const { ref: passwordRef, ...passwordControl } = register("password", {
    required: "Password is required",
    maxLength: 20,
    pattern: {
      value: /^(\w+){7,}$/,
      message: "Invalid password",
    },
  });

  const onSubmit = async ({ email, password }: BaseUser) => {
    const user = await loginUser({
      email,
      password,
    });
    const result = await signIn("credentials", user);

    if (!result?.error) {
      // Successful signIn
      router.replace("/");
    } else {
      // setInvalidCredentials(result ? result.error : "Something went wrong...");
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit((e: any) => onSubmit(e as BaseUser))}
          id={id + "-info-form"}
        >
          <FormInput
            lable="Email Address"
            id={id + "-email"}
            type="email"
            innerRef={emailRef}
            placeholder="e.g. stephenking@lorem.com"
            errorMessage={errors?.email?.message}
            {...emailControl}
          />

          <FormInput
            lable="Password"
            id={id + "-password"}
            type="password"
            innerRef={passwordRef}
            placeholder="e.g. 1234"
            errorMessage={errors?.password?.message}
            {...passwordControl}
          />

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
        <span className="mt-4 flex flex-col justify-start gap-2 text-center text-sm text-gray-500">
          <p>Not a member?</p>
          <button
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            onClick={() => switchToRegister()}
          >
            How about registering!
          </button>
        </span>
      </div>
    </>
  );
}

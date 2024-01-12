import { useId } from "react";
import { useForm } from "react-hook-form";

import { BaseUser } from "models/User";
import { trpc } from "utils/trpc";

import FormInput from "@/components/shared/inputs/FormInput";

type RegisterProps = {
  switchToLoginIn: (isNewUser?: boolean, message?: string) => void;
};

export default function Register({ switchToLoginIn }: RegisterProps) {
  const { mutateAsync: registerUser } =
    trpc.authRouter.createUser.useMutation();
  const {
    register,
    handleSubmit,
    watch,
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

  const { ref: usernameRef, ...usernameControl } = register("username", {
    required: "Username is required",
    maxLength: 20,
  });

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

  const { ref: confirmPasswordRef, ...confirmPasswordControl } = register(
    "confirmPassword",
    {
      required: true,
      maxLength: 20,
      pattern: {
        value: /^(\w+){7,}$/,
        message: "Invalid password",
      },
      validate: (val: string) => {
        if (watch("password") != val) {
          return "Your passwords do no match";
        }
      },
    },
  );

  const onSubmit = async ({ username, email, password }: BaseUser) => {
    const newUser: BaseUser = {
      username,
      email,
      password,
    };

    await registerUser(newUser);

    switchToLoginIn(true, "User created");
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Please register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          onSubmit={handleSubmit((e: any) => onSubmit(e as BaseUser))}
          id={id + "-info-form"}
        >
          <FormInput
            lable="Username"
            id={id + "-username"}
            innerRef={usernameRef}
            placeholder="e.g. Stephen King"
            errorMessage={errors?.username?.message}
            {...usernameControl}
          />

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

          <FormInput
            lable="Confirm Password"
            id={id + "-confirm-password"}
            type="password"
            innerRef={confirmPasswordRef}
            placeholder="e.g. 1234"
            errorMessage={errors?.confirmPassword?.message}
            {...confirmPasswordControl}
          />

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-500">
          <button
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            onClick={() => switchToLoginIn()}
          >
            Back to login
          </button>
        </div>
      </div>
    </>
  );
}

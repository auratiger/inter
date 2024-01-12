import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import AuthForm from "@/components/layout/Auth/AuthForm";

export default function AuthPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isLoading = status === "loading";

  useEffect(() => {
    if (session) {
      // If there is a session, then just redirect user to the home page.
      router.replace("/");
    }
  }, [router, session]);

  // There is no session, hence we prompt the user to sign in.
  return (
    <>
      <Head>
        <title>Sign In to React Coffee!</title>
        <meta
          name="description"
          content="Sign in to react coffee! Or Sign up to see your past orders."
          title="title"
        />
      </Head>

      {isLoading && (
        <section>
          <p>Loading...</p>
        </section>
      )}
      {!isLoading && <AuthForm />}
    </>
  );
}

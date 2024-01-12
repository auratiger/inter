import type { AppProps } from "next/app";
import { getSession, SessionProvider } from "next-auth/react";

import GroupProvider from "providers/Provider";

import { trpc } from "../utils/trpc";

import "../styles/globals.scss";

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  return (
    <SessionProvider session={session}>
      <GroupProvider>
        <Component {...pageProps} />
      </GroupProvider>
    </SessionProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }: any) => {
  return {
    session: await getSession(ctx),
  };
};

export default trpc.withTRPC(MyApp);

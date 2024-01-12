/* eslint-disable @next/next/no-img-element */
import { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

import { trpc } from "utils/trpc";

import { LoadingPage } from "@/components/shared/icons/LoadingSpinner";

const Home = dynamic(() => import("@/components/layout/Home/Home"), {
  ssr: false,
});

function Main() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/auth");
    }
  }, [router, session, status]);

  const { isLoading } = trpc.roomRouter.getGroups.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  if (isLoading) return <LoadingPage />;

  return (
    <main className="flex h-[100svh] flex-col rounded-lg shadow-lg ">
      <Suspense fallback={`Loading...`}>
        <Home />
      </Suspense>
    </main>
  );
}

export default Main;

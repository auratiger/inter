import { router } from "../trpc";

import { authRouter } from "./auth";
import { messageRouter } from "./message";
import { roomRouter } from "./room";
import { userRouter } from "./user";

export const appRouter = router({
  authRouter,
  roomRouter,
  userRouter,
  messageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

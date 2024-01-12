import { TRPCError } from "@trpc/server";
import { BaseUser } from "models/User";
import { ObjectId } from "mongodb";

import { authedProcedure, router } from "../trpc";

export const userRouter = router({
  getUsers: authedProcedure.query(async ({ ctx }) => {
    const users = await ctx.collections.user.find({}).toArray();

    if (!users) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Users not found.",
      });
    }

    return users
      .filter((us) => us._id !== new ObjectId(String(ctx?.user?.id)))
      .map((us: BaseUser) => {
        return {
          _id: us._id,
          username: us.username,
          email: us.email,
        };
      });
  }),
});

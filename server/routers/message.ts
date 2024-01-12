import { TRPCError } from "@trpc/server";
import { ObjectId } from "mongodb";
import { authedProcedure, router } from "server/trpc";
import { z } from "zod";

export const messageRouter = router({
  getMessages: authedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      ctx.logger.info("Getting messages for group: " + input.groupId);

      const messages = await ctx.collections.message
        .find({
          groupId: new ObjectId(String(input.groupId)),
        })
        .toArray();

      if (!messages) {
        ctx.logger.error("Group not found.");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Group not found.",
        });
      }

      ctx.logger.info("Found messages: " + messages.length);
      return messages;
    }),
});

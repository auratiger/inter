import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { ObjectId } from "mongodb";
import { authedProcedure, router } from "server/trpc";
import { z } from "zod";

enum Events {
  SEND_MESSAGE = "SEND_MESSAGE",
}

export const roomRouter = router({
  sendMessage: authedProcedure
    .input(
      z.object({
        text: z.string(),
        groupId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { ee, collections, logger, user } }) => {
      logger.info("Creating message: " + input.text);

      const message = await collections.message.insertOne({
        text: input.text,
        userId: new ObjectId(String(user?.id)),
        groupId: new ObjectId(String(input.groupId)),
        createdAt: new Date(),
      });

      await collections.group.updateOne(
        { _id: new ObjectId(String(input.groupId)) },
        { $addToSet: { messages: message.insertedId } },
      );

      ee.emit(Events.SEND_MESSAGE, {
        groupId: input.groupId,
        text: input.text,
      });

      logger.info("Message created successfully.");
      return message;
    }),

  onSendMessage: authedProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .subscription(({ input, ctx: { ee } }) => {
      // return an `observable` with a callback which is triggered immediately
      return observable<{ groupId: string; text: string }>((emit) => {
        const onMessage = (data: { groupId: string; text: string }) => {
          if (input.groupId === data.groupId) {
            emit.next(data);
          }
        };

        // trigger `onAdd()` when `add` is triggered in our event emitter
        ee.on(Events.SEND_MESSAGE, onMessage);

        // unsubscribe function when client disconnects or stops subscribing
        return () => {
          ee.off(Events.SEND_MESSAGE, onMessage);
        };
      });
    }),
  createGroup: authedProcedure
    .input(
      z.object({
        name: z.string(),
        userIds: z.array(z.string()),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      ctx.logger.info("Creating group: " + input.name);

      const userIds = input.userIds.map((id) => new ObjectId(String(id)));
      const users = await ctx.collections.user
        .find({
          _id: { $in: userIds },
        })
        .toArray();

      // TODO: check if all users exist
      if (users.length !== input.userIds.length) {
        ctx.logger.error("User mismatch.");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User mismatch.",
        });
      }

      const group = await ctx.collections.group.insertOne({
        name: input.name,
        image_url: "image",
        createdAt: new Date(),
        users: users.map((user) => user._id),
        messages: [],
      });

      const idsFromDB = input.userIds.map((id) => new ObjectId(String(id)));

      const result = await ctx.collections.user.updateMany(
        // @ts-ignore - TS expects _id to be a string, but mongo expects it to be ObjectId
        { _id: { $in: idsFromDB } },
        { $addToSet: { groups: group.insertedId } },
      );

      if (result.matchedCount === 1) {
        ctx.logger.info("Group created successfully.");
      } else {
        ctx.logger.error("Failed to create group.");
      }
    }),
  getGroups: authedProcedure.query(async ({ ctx }) => {
    ctx.logger.info("Getting groups for user: " + ctx?.user?.id);

    const user = await ctx.collections.user.findOne({
      _id: new ObjectId(String(ctx?.user?.id)),
    });

    if (!user) {
      ctx.logger.error("User not found. " + ctx?.user?.id);
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User not found.",
      });
    }

    const groups = await ctx.collections.group
      .find({
        _id: { $in: user.groups },
      })
      .toArray();

    const groupWithLastMessage = await Promise.all(
      groups.map(async (group) => {
        if (!group.messages?.length)
          return { ...group, lastMessage: "No messages" };
        const message = await ctx.collections.message.findOne({
          _id: new ObjectId(String(group.messages[group.messages.length - 1])),
        });
        return {
          ...group,
          lastMessage: message?.text,
        };
      }),
    );

    ctx.logger.info("Found groups: " + groups.length);
    return groupWithLastMessage;
  }),
});

/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/router
 * @see https://trpc.io/docs/procedures
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { v4 as uuidv4 } from "uuid";

import type { Context } from "./context";

const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/data-transformers
   */
  transformer: superjson,
  /**
   * @see https://trpc.io/docs/error-formatting
   */
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * Create a router
 * @see https://trpc.io/docs/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/procedures
 **/
export const publicProcedure = t.procedure.use(addCorrIdToLogger);

function addCorrIdToLogger(opts: any) {
  const corrIdLogger = opts.ctx.logger.child({ correlationId: uuidv4() });

  return opts.next({
    ctx: {
      ...opts.ctx,
      logger: corrIdLogger,
    },
  });
}

/**
 * @see https://trpc.io/docs/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Protected base procedure
 */
export const authedProcedure = t.procedure
  .use(async (opts) => {
    const user = opts.ctx.user;

    if (!user?.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: {
        ...opts.ctx,
      },
    });
  })
  .use(addCorrIdToLogger);

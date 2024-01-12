import { getSession } from "next-auth/react";

import type { CreateNextContextOptions } from "@trpc/server/adapters/next";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import EventEmitter from "events";
import { Group } from "models/Group";
import { Message } from "models/Message";
import { BaseUser } from "models/User";
import { Db, MongoClient } from "mongodb";
import clientPromise from "utils/db/dbConnect";
import logger from "utils/logger";

class MyEventEmitter extends EventEmitter {}

const ee = new MyEventEmitter();

interface User {
  id: string;
  email: string;
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  opts: CreateNextContextOptions | CreateWSSContextFnOptions,
) => {
  const session = await getSession(opts);

  const client: MongoClient = await clientPromise;
  const db: Db = client.db(process.env.DB_NAME);

  const collections = {
    user: db.collection<BaseUser>("users"),
    message: db.collection<Message>("messages"),
    group: db.collection<Group>("groups"),
  };

  return {
    user: session?.user as User | undefined,
    ee,
    collections,
    logger,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

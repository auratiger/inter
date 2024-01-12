import cx from "classnames";
import { useUser } from "hooks/useUser";
import { useGroups } from "providers/Provider";
import { twMerge } from "tailwind-merge";
import { trpc } from "utils/trpc";

import MessageArea from "@/components/shared/inputs/MessageArea";

export default function ChatArea() {
  const { selectedGroupId } = useGroups();

  const { data: messages } = trpc.messageRouter.getMessages.useQuery(
    {
      groupId: selectedGroupId,
    },
    { refetchOnWindowFocus: true },
  );

  const utils = trpc.useUtils();
  // subscribe to new posts and add
  trpc.roomRouter.onSendMessage.useSubscription(
    { groupId: selectedGroupId },
    {
      onData(data: { groupId: string; text: string }) {
        console.log(data);
        utils.messageRouter.getMessages.invalidate();
        utils.roomRouter.getGroups.invalidate();
      },
      onError(err: any) {
        console.error("Subscription error:", err);
        // we might have missed a message - invalidate cache
        utils.messageRouter.getMessages.invalidate();
      },
    },
  );

  const sessionUser = useUser();

  return (
    <div className="flex w-full flex-col justify-between px-5">
      <div className="mt-5 flex flex-col">
        {messages?.map(({ text, userId, createdAt }, index) => {
          const isMe: boolean = sessionUser?.id === userId.toString();

          return (
            <div
              key={`${index}+${createdAt}`}
              className={cx(
                "mb-4 flex justify-end",
                !isMe && "flex-row-reverse",
              )}
            >
              <div
                className={twMerge(
                  cx(
                    "mr-2 rounded-bl-3xl rounded-br-xl rounded-tl-3xl bg-indigo-600 px-4 py-3 text-white",
                    !isMe &&
                      "m-0 ml-2 rounded-bl-xl rounded-br-3xl rounded-tl-none rounded-tr-3xl bg-gray-400",
                  ),
                )}
              >
                {text}
              </div>
              <img
                src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                className="h-8 w-8 rounded-full object-cover"
                alt=""
              />
            </div>
          );
        })}
      </div>
      <MessageArea />
    </div>
  );
}

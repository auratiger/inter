import { useState } from "react";

import { useUser } from "hooks/useUser";
import { useGroups } from "providers/Provider";
import { trpc } from "utils/trpc";

import CircleButton from "../buttons/CircleButton";

export default function MessageArea() {
  const [message, setMessage] = useState("");
  const sessionUser = useUser();
  const { selectedGroupId } = useGroups();

  const { mutateAsync: sendMessage } =
    trpc.roomRouter.sendMessage.useMutation();

  const handleClick = () => {
    if (message && sessionUser?.id) {
      sendMessage({
        text: message,
        groupId: selectedGroupId,
      });

      setMessage("");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label
        htmlFor="comment"
        className="sr-only block text-sm font-medium leading-6 text-gray-900"
      >
        type your message here...
      </label>
      <div className="my-3 flex-grow">
        <textarea
          rows={2}
          name="comment"
          id="comment"
          className="block w-full resize-none overflow-hidden rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="type your message here..."
          autoFocus
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <CircleButton onClick={handleClick} />
    </div>
  );
}

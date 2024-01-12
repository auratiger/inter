import { useState } from "react";
import { signOut } from "next-auth/react";

import { useUser } from "hooks/useUser";

import Button from "@/components/shared/buttons/Button";
import Search from "@/components/shared/inputs/Search";

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const sessionUser = useUser();
  console.log(sessionUser);

  return (
    <div className="flex h-fit items-center justify-between border-b-2 bg-white px-5 py-2">
      <div className="text-2xl font-semibold">MyChat</div>
      {/* <Search /> */}
      <div className="relative">
        <button
          className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 p-2 font-semibold text-white"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          RA
        </button>
        {showMenu && (
          <div className="l-0 absolute grid w-[200px] -translate-x-full gap-4 rounded-bl-lg rounded-br-xl rounded-tl-lg border bg-white p-4 shadow-lg">
            <div className="flex justify-center text-xs">
              <span>{sessionUser?.email}</span>
            </div>
            <Button size="sm" text="Logout" onClick={() => signOut()} />
          </div>
        )}
      </div>
    </div>
  );
}

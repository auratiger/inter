import { Dispatch, SetStateAction } from "react";

import { BaseUser } from "models/User";

type MembersListProps = {
  users: BaseUser[];
  selectedUsers: string[];
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
};

export default function MembersList({
  users,
  selectedUsers,
  setSelectedUsers,
}: MembersListProps) {
  const handleCheck = (userId: string) => {
    setSelectedUsers((prev) => {
      const userSelected = prev.includes(userId);
      if (!userSelected) return [...prev, userId];
      return prev.filter((id) => id !== userId);
    });
  };

  return (
    <fieldset>
      <legend className="text-base font-semibold leading-6 text-gray-900">
        Add Members
      </legend>
      <div className="mt-4 h-[200px] divide-y divide-gray-200 overflow-y-auto border-b border-t border-gray-200">
        {users?.map(({ _id, username }, index) => (
          <div key={index} className="relative flex items-start py-2 pr-2">
            <div className="min-w-0 flex-1 text-sm leading-6">
              <label
                htmlFor={`person-${_id}`}
                className="select-none font-medium text-gray-900"
              >
                {username}
              </label>
            </div>
            <div className="ml-3 flex h-6 items-center">
              <input
                id={`person-${_id}`}
                name={`person-${_id}`}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                checked={selectedUsers.includes(_id.toString())}
                onChange={() => handleCheck(_id.toString())}
              />
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

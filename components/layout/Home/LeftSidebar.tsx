import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import cx from "classnames";
import { useUser } from "hooks/useUser";
import { useGroups, useGroupsApi } from "providers/Provider";
import { trpc } from "utils/trpc";

import Button from "@/components/shared/buttons/Button";
import Dialog from "@/components/shared/dialog/Dialog";
import FormInput from "@/components/shared/inputs/FormInput";
import GroupFilter from "@/components/shared/inputs/GroupFilter";

import MembersList from "./MembersList";

export default function LeftSidebar() {
  const [groupFilter, setGroupFilter] = useState("");

  const { mutateAsync: createGroup } =
    trpc.roomRouter.createGroup.useMutation();
  const sessionUser = useUser();
  const { selectedGroupId } = useGroups();
  const { setSelectedGroupId } = useGroupsApi();

  const { data: groups } = trpc.roomRouter.getGroups.useQuery(undefined, {
    refetchOnWindowFocus: true,
  });

  const filteredGroups = useMemo(() => {
    return groups?.filter((gr) =>
      gr.name.toLocaleLowerCase().startsWith(groupFilter.toLocaleLowerCase()),
    );
  }, [groups, groupFilter]);

  const { data: users } = trpc.userRouter.getUsers.useQuery();

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const utils = trpc.useUtils();

  const onSubmit = async ({ groupName }: { groupName: string }) => {
    if (sessionUser?.id) {
      await createGroup({ name: groupName, userIds: selectedUsers });

      reset();
      setSelectedUsers([]);

      utils.roomRouter.getGroups.invalidate();
    }

    closeDialog();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    defaultValues: {
      groupName: "",
    },
  });

  const { ref: groupnameRef, ...groupnameControl } = register("groupName", {
    required: "Group name is required",
    maxLength: 20,
  });

  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.close();
  };

  const toggleDialog = () => {
    if (!dialogRef.current) {
      return;
    }
    dialogRef.current.hasAttribute("open")
      ? dialogRef.current.close()
      : dialogRef.current.showModal();
  };

  const handleGroupClick = (groupId: string) => {
    console.log("selected", groupId);
    setSelectedGroupId(groupId);
  };

  return (
    <aside className="flex w-2/5 flex-col overflow-y-auto border-r-2">
      <GroupFilter
        type="text"
        placeholder="search chatting"
        value={groupFilter}
        onChange={(e) => setGroupFilter(e.target.value)}
      />
      <Button text="Create Group" onClick={toggleDialog} />
      <div className="overflow-y-auto">
        {filteredGroups?.map(({ name, _id, lastMessage }, index) => {
          const active = _id.toString() === selectedGroupId;
          return (
            <div
              key={`${index}+${name}`}
              className={cx(
                "flex cursor-pointer flex-row items-center justify-center border-b-2 px-2 py-4",
                active && "border-b-2 border-l-4 border-indigo-600",
              )}
              onClick={() => handleGroupClick(_id.toString())}
            >
              <div className="w-1/4">
                <img
                  src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                  className="h-12 w-12 rounded-full object-cover"
                  alt=""
                />
              </div>
              <div className="w-full">
                <div className="text-lg font-semibold">{name}</div>
                <span className="text-gray-500">{lastMessage}</span>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog
        toggleDialog={toggleDialog}
        ref={dialogRef}
        className="w-[400px] overflow-hidden rounded-lg p-4"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <FormInput
            lable="Group name"
            id={"createGroup"}
            innerRef={groupnameRef}
            placeholder="e.g. Group 1"
            errorMessage={errors?.groupName?.message}
            {...groupnameControl}
          />
          <MembersList
            users={users ?? []}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
          <div className="flex gap-4">
            <Button type="submit" text="Submit" onClick={toggleDialog} />
            <Button text="Close" onClick={toggleDialog} />
          </div>
        </form>
      </Dialog>
    </aside>
  );
}

import {
  Context,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";

export type GroupState = {
  selectedGroupId: string;
};

// Types are broken and values don't matter here so we use [] as any
export const GroupContext: Context<GroupState> = createContext(
  {} as GroupState,
);

export type GroupSetFn = Dispatch<SetStateAction<string>>;

export type GroupAPI = {
  setSelectedGroupId: GroupSetFn;
};

export const GroupContextApi: Context<GroupAPI> = createContext({} as GroupAPI);

const GroupProvider = ({ children }: any) => {
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const groupContext: GroupState = useMemo(() => {
    return { selectedGroupId };
  }, [selectedGroupId]);

  const groupContextApi: GroupAPI = useMemo(() => {
    return {
      setSelectedGroupId,
    };
  }, [setSelectedGroupId]);

  return (
    <GroupContext.Provider value={groupContext}>
      <GroupContextApi.Provider value={groupContextApi}>
        {children}
      </GroupContextApi.Provider>
    </GroupContext.Provider>
  );
};

export default GroupProvider;

export const useGroups = () => {
  const groups = useContext(GroupContext);
  return groups;
};

export const useGroupsApi = () => {
  const api = useContext(GroupContextApi);
  return api;
};

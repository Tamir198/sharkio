import { TextField } from "@mui/material";
import { useState } from "react";
import { CgSearch } from "react-icons/cg";
import { LuRefreshCcw } from "react-icons/lu";
import { useSniffersStore } from "../../stores/sniffersStores";
import { Invocation } from "./Invocation";
import { LoadingIcon } from "./LoadingIcon";
import { useParams } from "react-router-dom";

type InvocationsBottomBarProps = {
  title: string;
  refresh?: () => void;
  handleInvocationClicked: (invocationId: string) => void;
};
export const InvocationsBottomBar = ({
  handleInvocationClicked,
  title,
  refresh,
}: InvocationsBottomBarProps) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { invocations, loadingInvocations } = useSniffersStore();
  const { invocationId } = useParams();

  const filteredInvocations =
    invocations?.filter((invocation) => {
      if (!search) return true;
      const filterByMethod = invocation?.response?.status
        .toString()
        .includes(search.toLowerCase());
      const filterByUrl = invocation?.url
        .toLowerCase()
        .includes(search.toLowerCase());

      const filterByDate = new Date(invocation.createdAt)
        .toLocaleString()
        .includes(search.toLowerCase());

      return filterByMethod || filterByUrl || filterByDate;
    }) || [];

  return (
    <>
      <div className="flex flex-row justify-between items-center text-center mb-4">
        <div className="text-xl font-bold font-mono ">{title}</div>
        <div className="flex flex-row-reverse items-center space-x-4 w-1/2">
          {refresh && (
            <LuRefreshCcw
              className="flex text-gray-500 text-xl cursor-pointer ml-4"
              onClick={refresh}
            />
          )}
          {!showSearch ? (
            <CgSearch
              className="flex text-gray-500 text-xl cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          ) : (
            <TextField
              label="Search Invocations"
              variant="outlined"
              size="small"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="flex w-2/3"
            />
          )}
        </div>
      </div>

      <div className="flex flex-col w-full overflow-y-auto">
        {loadingInvocations ? (
          <div className="flex h-[25vh] w-full justify-center items-center">
            <LoadingIcon />
          </div>
        ) : (
          filteredInvocations.map((invocation, i) => {
            return (
              <Invocation
                method={invocation.method}
                isSelected={invocation.id === invocationId}
                onClick={() => handleInvocationClicked(invocation.id)}
                key={i}
                date={new Date(invocation.createdAt).toLocaleString()}
                status={invocation?.response?.status}
                url={invocation.url}
              />
            );
          })
        )}
      </div>
    </>
  );
};

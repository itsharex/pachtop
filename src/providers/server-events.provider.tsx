import useServerEventsStore from "@/hooks/useServerEventsStore";
import { createContext } from "react";
import { Cpu, Disk, GlobalCpu, Memory, Network, Process, ServerEvent, Swap, SysInfo } from "@/lib/types";
import { VIEWABLE_ELEMENT_COUNT } from "@/contants";
import useServerEventsEnumerableStore, { Enumerable } from "@/hooks/useServerEventsEnumerableStore";

interface ServerEventsProviderProps {
  children: React.ReactNode;
}

interface ServerEventsContext {
  globalCpu: GlobalCpu[];
  memory: Memory[];
  swap: Swap[];
  sysInfo: SysInfo;
  processes: Process[];
  networks: Enumerable<Network>[];
  cpus: Enumerable<Cpu>[];
  disks: Enumerable<Disk>[];
}

export const ServerEventsContext = createContext<ServerEventsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  sysInfo: {
    osVersion: "Unknown",
    coreCount: "0",
    hostname: "Unknown",
    kernelVersion: "Unknown",
    timestamp: 0,
  },
  processes: [],
  networks: [],
  cpus: [],
  disks: [],
});

const maxSize = VIEWABLE_ELEMENT_COUNT;

const ServerEventsProvider: React.FC<ServerEventsProviderProps> = ({ children }) => {
  const [sysInfo] = useServerEventsStore<SysInfo>(ServerEvent.SysInfo, { maxSize: 1 });
  const [globalCpu] = useServerEventsStore<GlobalCpu>(ServerEvent.GlobalCpu, { maxSize });
  const [memory] = useServerEventsStore<Memory>(ServerEvent.Memory, { maxSize });
  const [swap] = useServerEventsStore<Swap>(ServerEvent.Swap, { maxSize });
  const [processes] = useServerEventsStore<Process[]>(ServerEvent.Processes, { maxSize: 1 });
  const [networks] = useServerEventsEnumerableStore<Network>(ServerEvent.Networks, { maxSize });
  const [cpus] = useServerEventsEnumerableStore<Cpu>(ServerEvent.Cpus, { maxSize: 1 });
  const [disks] = useServerEventsEnumerableStore<Disk>(ServerEvent.Disks, { maxSize });

  return (
    <ServerEventsContext.Provider
      value={{
        sysInfo: sysInfo[sysInfo.length - 1] ?? null, // Get latest sysInfo
        globalCpu,
        memory,
        swap,
        processes: processes[processes.length - 1] ?? [], // Get latest processes
        networks,
        cpus,
        disks,
      }}
    >
      {children}
    </ServerEventsContext.Provider>
  );
};

export default ServerEventsProvider;

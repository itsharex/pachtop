import { createContext } from 'react';

import { VIEWABLE_ELEMENT_COUNT } from '@/contants';
import useServerEventsEnumerableStore, { Enumerable } from '@/hooks/useServerEventsEnumerableStore';
import useServerEventsStore from '@/hooks/useServerEventsStore';
import {
    Cpu, Disk, GlobalCpu, Memory, Network, Process, ServerEvent, Swap, SysInfo
} from '@/lib/types';

interface ServerEventsProviderProps {
  children: React.ReactNode;
}

interface ServerEventsContext {
  globalCpu: GlobalCpu[];
  memory: Memory[];
  swap: Swap[];
  sysInfo: SysInfo | null;
  processes: Process[];
  networks: Enumerable<Network>[];
  cpus: Enumerable<Cpu>[];
  disks: Enumerable<Disk>[];
}

export const ServerEventsContext = createContext<ServerEventsContext>({
  globalCpu: [],
  memory: [],
  swap: [],
  sysInfo: null,
  processes: [],
  networks: [],
  cpus: [],
  disks: [],
});

const maxSize = VIEWABLE_ELEMENT_COUNT;

const ServerEventsProvider: React.FC<ServerEventsProviderProps> = ({ children }) => {
  const [sysInfo] = useServerEventsStore<SysInfo>(ServerEvent.SysInfo, { maxSize: 1 });
  const [cpus] = useServerEventsEnumerableStore<Cpu>(ServerEvent.Cpus, { maxSize: 1 });
  const [disks] = useServerEventsEnumerableStore<Disk>(ServerEvent.Disks, { maxSize: 1 });
  const [processes] = useServerEventsStore<Process[]>(ServerEvent.Processes, { maxSize: 1 });
  const [globalCpu] = useServerEventsStore<GlobalCpu>(ServerEvent.GlobalCpu, { maxSize });
  const [memory] = useServerEventsStore<Memory>(ServerEvent.Memory, { maxSize });
  const [swap] = useServerEventsStore<Swap>(ServerEvent.Swap, { maxSize });
  const [networks] = useServerEventsEnumerableStore<Network>(ServerEvent.Networks, { maxSize });

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

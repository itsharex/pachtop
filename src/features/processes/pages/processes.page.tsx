import sortBy from 'lodash.sortby';
import { DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useMemo, useState } from 'react';

import PageWrapper from '@/components/page-wrapper';
import KillProcessVerification from '@/features/processes/components/processes.kill-verification';
import ProcessesTable from '@/features/processes/components/processes.table';
import useServerEventsContext from '@/hooks/useServerEventsContext';
import { Process } from '@/lib';
import { TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

const ProcessesPage = () => {
  const { processes } = useServerEventsContext();
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<Process[]>([]);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "name",
    direction: "asc",
  });

  const filteredAndSortedRecords = useMemo(() => {
    let filteredRecords = processes;
    if (query) {
      filteredRecords = filteredRecords.filter((process) => {
        const filteredName = process.name.toLowerCase().includes(query.toLowerCase());
        const filteredPid = process.pid.toString().toLowerCase().includes(query.toLowerCase());

        return filteredName || filteredPid;
      });
    }

    const sortedRecords = sortBy(filteredRecords, sortStatus.columnAccessor);
    return sortStatus.direction === "desc" ? sortedRecords.reverse() : sortedRecords;
  }, [processes, query, sortStatus]);

  useEffect(() => {
    setRecords(filteredAndSortedRecords);
  }, [filteredAndSortedRecords]);

  return (
    <PageWrapper name="Processes">
      <TextInput
        placeholder="Search Process..."
        icon={<IconSearch size={16} />}
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
      />
      <ProcessesTable
        records={records ?? []}
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        setRecords={setRecords}
        setSortStatus={setSortStatus}
        sortStatus={sortStatus}
      />
      <KillProcessVerification
        selectedProcess={selectedProcess}
        setSelectedProcess={setSelectedProcess}
        setRecords={setRecords}
      />
    </PageWrapper>
  );
};

export default ProcessesPage;

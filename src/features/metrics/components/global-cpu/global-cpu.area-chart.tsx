import AreaChart, { DatasetOptions } from "@/components/area-chart";
import { ChartProps } from "@/features/metrics/utils/types";
import useMetricsContext from "@/features/metrics/hooks/useMetricsContext";

interface GlobalCpuAreaChartProps extends ChartProps {}

const GlobalCpuAreaChart: React.FC<GlobalCpuAreaChartProps> = ({
  xAxisMin,
}) => {
  const { globalCpu } = useMetricsContext();

  const title = "CPU Usage";
  const labels = globalCpu.map((cpu) => cpu.timestamp);
  const datasets: DatasetOptions[] = [
    {
      label: `CPU Usage`,
      data: globalCpu.map((cpu) => ({
        x: cpu.timestamp,
        y: cpu.usage,
      })),
      backgroundColor: "rgba(255, 99, 132, 0.45)",
      borderColor: "rgba(255, 99, 132, 1)",
      fill: true,
      yAxisId: "global-cpu-usage",
    },
  ];

  const callbacks = {
    label: (context: any) => {
      const label = context.dataset.label || "";
      const value = context.parsed.y.toFixed(2);
      return `${label}: ${value}%`;
    },
  };
  return (
    <AreaChart
      title={title}
      labels={labels}
      xAxisMin={xAxisMin}
      datasets={datasets}
      callbacks={callbacks}
    />
  );
};

export default GlobalCpuAreaChart;

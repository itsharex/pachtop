import Card from "@/components/card";
import formatBytes from "@/features/metrics/utils/format-bytes";
import AreaChart, { useAreaChartState } from "@/components/area-chart";
import useServerEventsContext from "@/hooks/useServerEventsContext";
import { useEffect } from "react";
import { useMantineTheme } from "@mantine/core";

const SwapAreaChart: React.FC = ({}) => {
  const { swap } = useServerEventsContext();
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useAreaChartState({
    title: {
      text: "Swap Memory Usage",
    },
    yAxis: {
      labels: {
        formatter: (x) => formatBytes(x.value as number),
      },
    },
    tooltip: {
      pointFormatter: function () {
        return `<span style="color:${this.color}">\u25CF</span> ${this.series.name}: <b>${formatBytes(
          this.y as number
        )}</b><br/>`;
      },
    },
  });

  useEffect(() => {
    setChartOptions({
      series: [
        {
          name: "Swap Usage",
          type: "area",
          data: swap.map((swap) => [swap.timestamp, swap.used]),
          color: other.charts.area.swap.color,
        },
      ],
    });
  }, [swap]);

  return (
    <Card style={{ height: "450px" }}>
      <AreaChart options={chartOptions} />
    </Card>
  );
};

export default SwapAreaChart;

import Highcharts, { Point } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsTreemap from "highcharts/modules/treemap";
import DarkUnica from "highcharts/themes/dark-unica";
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import formatBytes from "@/features/metrics/utils/format-bytes";
import { useViewportSize } from "@mantine/hooks";

HighchartsTreemap(Highcharts);
DarkUnica(Highcharts);

export interface InitialTreemapChartStateInput {
  title: {
    text: string;
  };
  series?: Highcharts.SeriesOptionsType[];
  yAxis?: {
    labels: {
      formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
    };
    max?: number;
  };

  legend?: boolean;
}

// Crutch because types are incorrect in HighChartsReact lib
interface FormatterScope extends Point {
  value: number;
}

export const useTreemapChartState = (
  opts: InitialTreemapChartStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    accessibility: {
      enabled: true,
    },

    tooltip: {
      formatter: function () {
        // TODO: Move this to Disk to be more generic
        console.log(this.point);
        const point: FormatterScope = this.point as FormatterScope;
        return `<b>${this.point.name}</b>: ${formatBytes(point["value"]) as any}`;
      },
    },
    chart: {
      backgroundColor: "transparent",
    },
    boost: {
      enabled: true,
      useGPUTranslations: true,
      allowForce: true,
    },
    title: {
      text: opts.title.text,
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "700",
        fontSize: "20",
        color: "#c1c2c5",
      },
    },
    credits: {
      enabled: false,
    },

    series: [
      {
        type: "treemap",
        layoutAlgorithm: "squarified",
        animationLimit: 1000,
        allowTraversingTree: true,
        allowPointSelect: true,
        accessibility: {
          exposeAsGroupOnly: true,
        },
        dataLabels: {
          enabled: false,
        },
        levels: [
          {
            level: 1,
            dataLabels: {
              enabled: true,
            },
            borderWidth: 3,
            layoutAlgorithm: "squarified",
            color: "red",
            borderColor: "black",
          },
          {
            level: 1,
            dataLabels: {
              style: {
                fontSize: "14px",
              },
            },
            borderColor: "black",
            color: "red",
          },
        ],
        data: [],
      },
    ],
  });

  return [chartOptions, setChartOptions];
};

const TreemapChart: React.FC<HighchartsReact.Props> = (props) => {
  const { width } = useViewportSize();
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  // Reflow chart on window resize
  useEffect(() => {
    chartComponentRef.current?.chart?.reflow();
  }, [width]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  );
};

export default TreemapChart;

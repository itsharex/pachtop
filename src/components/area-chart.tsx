import * as Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useState } from "react";
import { useColorScheme, useViewportSize } from "@mantine/hooks";
import { useMantineTheme } from "@mantine/core";

export interface InitialAreaChatStateInput {
  title: {
    text: string;
  };
  series?: Highcharts.SeriesOptionsType[];
  yAxis: {
    labels: {
      formatter: Highcharts.AxisLabelsFormatterCallbackFunction;
    };
    max?: number;
  };
  tooltip: {
    pointFormatter: Highcharts.FormatterCallbackFunction<Highcharts.Point>;
  };
}

export const useAreaChartState = (
  opts: InitialAreaChatStateInput
): [Highcharts.Options, Dispatch<SetStateAction<Highcharts.Options>>] => {
  const { other } = useMantineTheme();
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>({
    title: {
      text: opts.title.text,
      style: {
        fontFamily: "Geist Variable, Roboto, Arial, sans-serif",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#dce1e8",
      },
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
      area: {
        stacking: "stream",

        lineWidth: 1,
        marker: {
          lineWidth: 1,
        },
      },
    },
    xAxis: {
      type: "datetime",
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        step: 2,
        format: "{value:%I:%M %p}",
        style: {
          color: other.charts.area.default.labelColor,
        },
      },
    },
    legend: {
      itemStyle: {
        color: other.charts.area.default.legend.color,
      },
      enabled: true,
    },
    time: {
      useUTC: false,
    },

    yAxis: {
      max: opts.yAxis.max,
      title: {
        text: null,
      },
      startOnTick: true,
      gridLineColor: other.charts.area.default.gridLineColor,
      lineColor: other.charts.area.default.lineColor,
      labels: {
        formatter: opts.yAxis.labels.formatter,
        style: {
          color: "white",
        },
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      xDateFormat: "%Y-%m-%d %I:%M:%S %p",
      pointFormatter: opts.tooltip.pointFormatter,
      style: {
        color: other.charts.area.default.tooltip.color,
      },
      backgroundColor: other.charts.area.default.tooltip.backgroundColor,
    },
    // Scrollbar at the bottom of the chart
    scrollbar: {
      rifleColor: other.charts.area.default.scrollbar.rifleColor,
      barBackgroundColor: other.charts.area.default.scrollbar.barBackgroundColor,
      buttonBackgroundColor: other.charts.area.default.scrollbar.buttonBackgroundColor,
      trackBorderColor: other.charts.area.default.scrollbar.trackBorderColor,
    },
    // This is the calendar thing on the top right
    rangeSelector: {
      labelStyle: {
        color: other.charts.area.default.rangeSelector.labelStyle.color,
        backgroundColor: other.charts.area.default.rangeSelector.labelStyle.backgroundColor,
      },

      inputStyle: {
        color: other.charts.area.default.rangeSelector.inputStyle.color,
      },
      buttonTheme: {
        fill: "none",
        display: "none",
        r: 8,
        style: {
          background: "none",
          color: other.charts.area.default.buttonTheme.style.color,
          backgroundColor: other.charts.area.default.buttonTheme.style.backgroundColor,
          fontWeight: "bold",
        },
      },
      buttons: [
        {
          count: 1,
          type: "minute",
          text: "1M",
        },
        {
          count: 5,
          type: "minute",
          text: "5M",
        },
        {
          count: 30,
          type: "minute",
          text: "30M",
        },
        {
          type: "all",
          text: "All",
        },
      ],
      // inputEnabled: false,
      selected: 0,
    },
    boost: {
      enabled: true,
      useGPUTranslations: true,
      allowForce: true,
    },
    chart: {
      backgroundColor: "transparent",
    },
  });

  return [chartOptions, setChartOptions];
};

const AreaChart: React.FC<HighchartsReact.Props> = (props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const { width } = useViewportSize();

  // Reflow chart on window resize
  useEffect(() => {
    chartComponentRef.current?.chart?.reflow();
  }, [width]);

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={props.options}
      ref={chartComponentRef}
      constructorType={"stockChart"}
      containerProps={{ style: { height: "100%", width: "100%" } }}
    />
  );
};

export default AreaChart;

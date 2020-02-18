import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Series } from "../types";
import { MONTH_NAMES } from "./constants";
import "./StokrManagerChart.scss";

type StokrManagerChartProps = {
  symbol: string;
};

const StokrManagerChart: React.FC<StokrManagerChartProps> = ({ symbol }) => {
  const [series, setSeries] = useState<Series | null>(null);

  const fetchSeries = async (symbol: string, period: string) => {
    const { data } = await axios.get(
      `http://localhost:8080/api/v1/series?symbol=${symbol}&period=${period}`
    );

    return data.series;
  };

  const defineSeries = useCallback(async () => {
    try {
      const series = await fetchSeries(symbol, "month");

      setSeries(series);
    } catch (error) {
      console.log(error);
    }
  }, [symbol]);

  useEffect(() => {
    defineSeries();
  }, [defineSeries, symbol]);

  const chartData = {
    labels: [
      ...Object.keys(series ? series : {})
        .reverse()
        .map(
          date =>
            `${MONTH_NAMES[new Date(Number(date)).getMonth()]} ${new Date(
              Number(date)
            ).getFullYear()}`
        )
    ],
    datasets: [
      {
        data: [...Object.values(series ? series : {}).reverse()],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    defaultFontFamily: "'Avenir', 'Helvetica Neue', sans-serif",
    maintainAspectRatio: false,
    tooltips: {
      mode: "x",
      intersect: false
    },
    hover: {
      intersect: false
    },
    layout: {
      padding: {
        top: 50,
        bottom: 50
      }
    },
    legend: {
      display: false
    }
  };

  return (
    <div className="company-chart">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export { StokrManagerChart };

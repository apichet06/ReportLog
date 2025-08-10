import { type ChartData as ChartJsData, type ChartOptions } from "chart.js";

export const colors = [
  { bg: "rgba(75, 192, 192, 1)", border: "rgba(75, 192, 192, 2)" },
  { bg: "rgba(54, 162, 235, 1)", border: "rgba(54, 162, 235, 2)" },
  { bg: "rgba(54, 162, 190, 1)", border: "rgba(255, 99, 132, 2)" },
  { bg: "rgba(90, 150, 120, 1)", border: "rgba(255, 206, 86, 2)" },
];

export const initialChartBarData: ChartJsData<"bar"> = {
  labels: [],
  datasets: [],
};

export const initialChartData: ChartJsData<"pie"> = {
  labels: [],
  datasets: [
    {
      label: "",
      data: [],
      backgroundColor: colors.map((c) => c.bg),
      borderColor: colors.map((c) => c.border),
      borderWidth: 1,
      hoverOffset: 4,
    },
  ],
};

export const optionBar: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Last 12 Months Data",
    },
    datalabels: {
      formatter: (value) => {
        return value;
      },
      color: "#fff",
      font: {
        weight: "lighter",
        size: 13,
      },
    },
  },
};

export const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Report Log Summary",
    },
    datalabels: {
      formatter: (value) => {
        return value;
      },
      color: "#fff",
      font: {
        weight: "bold",
        size: 16,
      },
    },
  },
};

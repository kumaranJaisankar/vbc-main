import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  {
    name: "JAN",
    count: 60,
  },
  {
    name: "FEB",
    count: 13,
  },
  {
    name: "MAR",
    count: 98,
  },
  {
    name: "APR",
    count: 39,
  },
  {
    name: "MAY",
    count: 40,
  },
  {
    name: "JUN",
    count: 30,
  },
  {
    name: "JUL",
    count: 40,
  },
  {
    name: "AUG",
    count: 20,
  },
  {
    name: "SEP",
    count: 18,
  },
  {
    name: "OCT",
    count: 90,
  },
  {
    name: "NOV",
    count: 38,
  },
  {
    name: "DEC",
    count: 40,
  },
];

const LeadsGraph = () => {
  return (
    <BarChart
      width={1000}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
      barSize={20}
    >
      <XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
      {/* <YAxis /> */}
      <Tooltip />
      {/* <Legend /> */}
      <CartesianGrid strokeDasharray="3 3" />
      <Bar dataKey="count" fill="#555ef2" background={{ fill: "#eee" }} />
    </BarChart>
  );
};

export default LeadsGraph;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Spinner } from "reactstrap";
import Grid from "@mui/material/Grid";
import moment from "moment";
const StatsBarChart = (props) => {
  const data = Object.values(props.paymentStatsData).map((users) => {
    return {
      amount: parseFloat(users.amount),
      date: moment(users.date).format("DD/MM"),
    };
  });
  const renderCustomizedLabel = (props) => {
    const { x, y, width, height, value } = props;
    function nFormatter(num) {
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(0).replace(/\.0$/, "") + "G";
      }
      if (num >= 1000000) {
        return (num / 1000000).toFixed(0).replace(/\.0$/, "") + "M";
      }
      if (num >= 1000) {
        return (num / 1000).toFixed(0).replace(/\.0$/, "") + "K";
      }
      return num;
    }
    let newData = nFormatter(value);
    console.log(newData, "newData");
    return (
      <text
        x={x}
        y={y}
        dy={-1}
        height={10}
        // transform="rotate(-45)"
        // className="text123"
        fontSize="10"
        fontFamily="sans-serif"
        textAnchor="start"
        paddingTop="10px"
        zIndex="200"
      >
        {newData}
      </text>
    );
  };
  return (
    <>
      <Grid container spacing={1} width="97%" height="97%">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {props.loaderSpinneer ? (
            <Spinner size="lg" className="dashboard_spinner">
              {" "}
            </Spinner>
          ) : (
            <ResponsiveContainer>
              <BarChart
                width={600}
                height={200}
                data={data}
                // margin={{
                //   top: 5,
                //   right: 30,
                //   left: 20,
                //   bottom: 5,
                // }}
                barSize={20}
                barGap={50}
                // barSize={0}
                // barCategoryGap={50}
              >
                <CartesianGrid vertical={false} array="3 3" />
                {/* <Legend layout="vetical" verticalAlign="top" align="right"
                /> */}
                <XAxis
                  dataKey="date"
                  // axisLine={true}
                  minTickGap={-20}
                  tickMargin={10}
                  angle={-45}
                />
                <YAxis
                  axisLine={false}
                  // stroke="false"
                  // tick={0}
                  // tick={false} hide
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("en").format(value)
                  }
                />
                <Bar
                  isAnimationActive={true}
                  dataKey="amount"
                  fill="#4a79e5"
                  label={renderCustomizedLabel}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default StatsBarChart;

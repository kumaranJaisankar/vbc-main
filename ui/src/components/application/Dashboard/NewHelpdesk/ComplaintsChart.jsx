import React from "react";
import { BarChart, Bar, XAxis, Cell, ResponsiveContainer } from "recharts";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
const barColors = ["#4A79E5", "#FF8B7B", "#FCC54B", "#f5afb9", "#10CEB5"];
const ComplaintsBarChart = (props) => {
  console.log(props.headerData, "props.headerData");
  const ChartData = [
    {
      name: "Open",
      count: props.headerData.context?.opn
        ? props.headerData.tickets_by_status?.opn
        : "0",
    },
    {
      name: "Assigned",
      count: props.headerData.context?.asn
        ? props.headerData.context?.asn
        : "0",
    },
    {
      name: "In Progress",
      count: props.headerData.context?.inp
        ? props.headerData.context?.inp
        : "0",
    },
    {
      name: "Resolved",
      count: props.headerData.context?.rsl
        ? props.headerData.context?.rsl
        : "0",
    },
    {
      name: "Closed",
      count: props.headerData.context?.cld
        ? props.headerData.context?.cld
        : "0",
    },
  ];

  // added link to complaints count by Marieya
  return (
    <>
      <Grid container spacing={1} style={{ position: "relative", top: "25%" }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{
            textAlign: "center",
            marginTop: "-4%",
            height: "200px",
            position: "relative",
            left: "0px",
          }}
        >
          <ResponsiveContainer>
            <BarChart
              width={450}
              height={250}
              data={ChartData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
              barSize={10}
              radius={40}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={0}
                style={{ fontSize: "13px" }}
              />
{/* . */}
              <Bar
                dataKey="count"
                fill="#4ae5ca"
                background={{ fill: "#eee" }}
                radius={40}
              >
                {ChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={barColors[index % 20]}
                    radius={40}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid container spacing={0} style={{ marginLeft: "13%" }}>
          <Grid md={2}>
            <span>
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                  state: {
                    billingDateRange: "opn",
                    customstartdate: props?.filterStartDate,
                    customenddate: props?.filterEndDate,
                  },
                }}
              >
                {props.headerData.context?.opn
                  ? props.headerData.context?.opn
                  : "0"}
              </Link>
            </span>
          </Grid>
          <Grid md={2} className="act_count">
            <span>
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                  state: {
                    billingDateRange: "asn",
                    customstartdate: props?.filterStartDate,
                    customenddate: props?.filterEndDate,
                  },
                }}
              >
                {props.headerData.context?.asn
                  ? props.headerData.context?.asn
                  : "0"}
              </Link>
            </span>
          </Grid>
          <Grid md={2} className="act_count">
            <span>
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                  state: {
                    billingDateRange: "inp",
                    customstartdate: props?.filterStartDate,
                    customenddate: props?.filterEndDate,
                  },
                }}
              >
                {props.headerData.context?.inp
                  ? props.headerData.context?.inp
                  : "0"}
              </Link>
            </span>
          </Grid>
          <Grid md={2} className="act_count">
            <span>
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                  state: {
                    billingDateRange: "rsl",
                    customstartdate: props?.filterStartDate,
                    customenddate: props?.filterEndDate,
                  },
                }}
              >
                {props.headerData.context?.rsl
                  ? props.headerData.context?.rsl
                  : "0"}
              </Link>
            </span>
          </Grid>
          <Grid md={2} className="act_count">
            <span>
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/ticket/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                  state: {
                    billingDateRange: "cld",
                    customstartdate: props?.filterStartDate,
                    customenddate: props?.filterEndDate,
                  },
                }}
              >
                {props.headerData.context?.cld
                  ? props.headerData.context?.cld
                  : "0"}
              </Link>
            </span>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
export default ComplaintsBarChart;

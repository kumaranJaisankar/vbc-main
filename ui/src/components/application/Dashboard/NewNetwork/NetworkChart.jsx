import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

const CustomerNetwrok = (props) => {
  console.log(props,"propsprops")
  const ChartData = [
    {
      name: "NAS",
      count: props?.networkData.nas ? props?.networkData.nas : 0,
    },
    {
      name: "OLT",
      count: props?.networkData.olt ? props?.networkData.olt : 0,
    },
    {
      name: "PDP",
      count: props?.networkData.pdp ? props?.networkData.pdp : 0,
    },
    {
      name: "CDP",
      count: props?.networkData.cdp ? props?.networkData.cdp : 0,
    },
    {
      name: "CPE",
      count: props?.networkData.cpe ? props?.networkData.cpe : 0,
    },
  ];

  const dataBar = {
    labels: ["NAS", "OLT", "DP", "CPE"],
    datasets: [
      {
        label: "",
        backgroundColor: "#475DC7",
        borderColor: "#475DC7",
        borderWidth: 0,
        hoverBackgroundColor: "#475DC7",
        hoverBorderColor: "#475DC7",
        data: [
          props.networkData.nas ? props.networkData.nas : 0,
          props.networkData.olt ? props.networkData.olt : 0,
          props.networkData.pdp ? props.networkData.pdp : 0,
          props.networkData.cdp ? props.networkData.cdp : 0,
          props.networkData.cpe ? props.networkData.cpe : 0,
        ],
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        display: true,
        color: "black",
        align: "end",
        anchor: "end",
        offset: -20,
        font: { size: "14" },
      },
    },
    scales: {
      xAxes: [
        {
          barThickness: 6, // number (pixels) or 'flex'
          maxBarThickness: 8, // number (pixels)
          gridLines: {
            display: false,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
  };
  //added chart redirection counts
  return (
    <>
      {/* <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className="grid_container_align"
          // style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px' }}
          // style={{ textAlign: "center", padding: "0px" }}
        > */}
           <ResponsiveContainer width="100%" height="100%" className="network_card_res">
          <BarChart
            className="network_recharts"
            width={500}
            height={270}
            data={ChartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={10}
            radius={40}
          >
            <CartesianGrid vertical={false} array="3 3" />
            <XAxis dataKey="name" axisLine={false} tickLine={false}/>
            <YAxis axisLine={false} tickLine={false} />
            <Bar
              dataKey="count"
              fill="#475DC7"
              radius={40}
              //  isAnimationActive={false}
            >
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
          </ResponsiveContainer>
        {/* </Grid>
      </Grid> */}
      <Grid container spacing={0} id="network_margin" className="network_card_res_data">
     
          <span className="act_count1">
            <Link
              to={{
                pathname: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
              }}
            >
              {props.networkData.nas ? props.networkData.nas : 0}
            </Link>
          </span>
          <span className="act_count2">
            <Link
              to={{
                pathname: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                state: { selectedTabolt: "olt" },
              }}
            >
              {props.networkData.olt ? props.networkData.olt : 0}
            </Link>
          </span>
          <span className="act_count3">
            <Link
              to={{
                pathname: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                state: { selectedTabolt: "dp" },
              }}
            >
              {props.networkData.pdp ? props.networkData.pdp : 0}
            </Link>
          </span>
          <span className="act_count5">
            <Link
              to={{
                pathname: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                state: { selectedTabolt: "dp" },
              }}
            >
              {props.networkData.cdp ? props.networkData.cdp : 0}
            </Link>
          </span>
          <span   className="act_count4">
            <Link
              to={{
                pathname: `${process.env.PUBLIC_URL}/app/project/opticalnew/all/${process.env.REACT_APP_API_URL_Layout_Name}`,
                state: { selectedTabolt: "cpe" },
              }}
            >
              {props.networkData.cpe ? props.networkData.cpe : 0}
            </Link>
          </span>
      </Grid>
    </>
  );
};

export default CustomerNetwrok;



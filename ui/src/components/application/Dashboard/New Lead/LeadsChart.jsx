import React, { useState, useCallback } from "react";
import moment from "moment";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   Tooltip,
// } from "recharts";

import { Line } from "react-chartjs-2";
import Grid from "@mui/material/Grid";
export default function LeadsAndNewRegistrations(props) {
  const data = [
    // {
    //   name: (
    //     <span>
    //       <div>
    //         {props.leadData.leads?.map((item) => (
    //           <div>
    //             {item.created_at__date}
    //           </div>
    //         ))}
    //       </div>
    //     </span>
    //   ),
    //   L: (
    //     <span>
    //       <div>
    //         {props.leadData.leads?.forEach((item) => (
    //           <div>
    //             {item.count}
    //           </div>
    //         ))}
    //       </div>
    //     </span>
    //   ),
    //   R:(<span>
    //     <div>
    //       {props.leadData.registered_leads?.forEach((item) => (
    //         <div>
    //           {item.count}
    //         </div>
    //       ))}
    //     </div>
    //   </span>),

    //   amt: 0,
    // },

    {
      name: "5/7",
      R: 5550,
      L: 5800,
      amt: 3290,
    },
    {
      name: "6/7",
      R: 3550,
      L: 3800,
      amt: 2000,
    },
    {
      name: "7/7",
      R: 1380,
      L: 1708,
      amt: 2000,
    },

    {
      name: "8/9",
      R: 5890,
      L: 5800,
      amt: 2500,
    },
    {
      name: "9/9",
      R: 3000,
      L: 3000,
      amt: 2500,
    },
    {
      name: "Today",
      R: 4500,
      L: 4000,
      amt: 2500,
    },
  ];
  const [opacity, setOpacity] = useState({
    R: 1,
    L: 1,
  });

  const handleMouseEnter = useCallback(
    (o) => {
      const { dataKey } = o;

      setOpacity({ ...opacity, [dataKey]: 0.5 });
    },
    [opacity, setOpacity]
  );

  const handleMouseLeave = useCallback(
    (o) => {
      const { dataKey } = o;
      setOpacity({ ...opacity, [dataKey]: 1 });
    },
    [opacity, setOpacity]
  );

  const datasetKeyProvider = () => {
    return Math.random();
  };

  const lineChartOptions = {
    maintainAspectRatio: true,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          display: false,
        },
      ],
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };

  const Data =
    props.leadData &&
    props.leadData.leads &&
    props.leadData.leads.map((ele) => ele.count);
  const LeadDate =
    props.leadData &&
    props.leadData.leads &&
    props.leadData.leads.map((ele) =>
      moment(ele.created_at__date).format("DD/MM")
    );
  const Data1 =
    props.leadData &&
    props.leadData.registered_leads &&
    props.leadData.registered_leads.map((ele) => ele.count);

  // const LeadData = () =>{
  //   props.leadData &&  props.leadData.registered_leads.forEach(ele => diplayleadData.push(ele.count))
  // };

  const lineChartData = {
    labels: LeadDate,
    datasets: [
      {
        data: Data,
        borderColor: "#1D75FF",
        backgroundColor: "rgba(39, 99, 255, 0.25)",
        borderWidth: 2,
        pointBorderColor: "#2763FF",
        pointBackgroundColor: "#FFFFFF",
      },
      {
        data: Data1,
        borderColor: "#00ACFF",
        backgroundColor: "#97CDFF",

        pointBorderColor: "#00ACFF",
        pointBackgroundColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
    plugins: {
      datalabels: {
        display: false,
        color: "white",
      },
    },
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Line
          // className="leads-chart"
          data={lineChartData}
          options={lineChartOptions}
          datasetKeyProvider={datasetKeyProvider}
          width={778}
          height={300}
        />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} id="lead_dot">
        <span className="dot"></span>
        <p className="label">Leads</p>
     <p></p>
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6}  id="lead_dot">
        <span className="dot1"></span>
        <p className="label"> New Registrations</p>
        <p></p>
      </Grid>
      <br/>
    </Grid>

    //     <div>

    // <Line data={lineChartData} options={lineChartOptions}  datasetKeyProvider={datasetKeyProvider} width={778} height={400} />
    // <Row className="leads-col">
    //   <Col md={4}>
    //     <span className="dot"></span>
    //     <p className="label">Leads</p>
    //   </Col>
    //   <Col md={8}>
    //     <span className="dot1"></span>
    //     <p className="label"> New Registrations</p>
    //   </Col>
    // </Row>
    //     </div>
  );
}

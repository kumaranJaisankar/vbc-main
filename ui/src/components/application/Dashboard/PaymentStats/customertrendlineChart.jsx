import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import moment from "moment";
import {
  Spinner
} from "reactstrap";
const CustomerLinetrendChart = (props) => {
  const [expiry, setExpiry] = useState([]);
  const [renewal, setRenewal] = useState([])
  const [total, setTotal] = useState([])
  const [expirydate, setExpiryDate] = useState([]);

  useEffect(() => {
    if (props.trendData.expiried_users) {
      const ser = props.trendData.expiried_users.map((w) => w.account_status__count);
      const cat = props.trendData.expiried_users.map((w) => moment(w.expiried_date).format("DD/MM"));
      setExpiry(ser);
      setExpiryDate(cat)
    }
    if (props.trendData.renewal_users) {
      const ser = props.trendData.renewal_users.map((w) => w.user_id__count);
      const cat = props.trendData.expiried_users.map((w) => moment(w.renewal_date).format("DD/MM"));
      setRenewal(ser);
    }
    if (props.trendData.total_users) {
      const ser = props.trendData.total_users.map((w) => w.user_id__count);
      const cat = props.trendData.expiried_users.map((w) => moment(w.total_users_date).format("DD/MM"));
      setTotal(ser);
    }
  }, [props.trendData]);


  const chartOptions = {
    credits: {
      enabled: false,
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
      },
    },
    marker: {
      fillColor: "transparent",
      lineColor: Highcharts.getOptions().colors[0],
    },
    title: {
      text: null,
    },
    yAxis: {
      title: {
        text: null,
      },
    },
    xAxis: {
      categories: expirydate ,
      title: {
        // text: 'Monthly Dates'
      },

    },

    series: [
      {
        name: "Expired",
        type: "line",
        data: expiry,
      },
      {
        name: "Total",
        type: "line",
        data: total,
        visible: false

      },
      {
        name: "Renewal",
        type: "line",
        data: renewal,
      },
    ],

    legend: {
      layout: "horizontal",
      align: "right",
      verticalAlign: "top",
      itemMarginTop: 10,
      //   itemMarginBottom: 10
    },
  };
  return (
    <Grid container spacing={1}>
      {props.loaderSpinneer?
      
      <Spinner size="lg" className="dashboard_spinner"> </Spinner>
      :<Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        style={{ textAlign: "center", padding: "0px" }}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          containerProps={{
            style: {
              height: "90%",
              width: "92%",
              position: "absolute",
              top: "10px",
              marginLeft: "20px",
              transition: "ease",
            },
          }}
        />
      </Grid>}
    </Grid>
  );
};
export default CustomerLinetrendChart;

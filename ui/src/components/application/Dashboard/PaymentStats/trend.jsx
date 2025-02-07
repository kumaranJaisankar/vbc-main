import React, { useState, useEffect } from "react";
import { customeraxios } from "../../../../axios";
import CloseIcon from "@mui/icons-material/Close";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import CustomerLinetrendChart from "./customertrendlineChart";

const TrendChart = (props) => {
  const [trendData, setTrendData] = useState([]);
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)

  useEffect(() => {
    var nowDate = new Date();
    var date1 = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    console.log(date1, "date1")
    setLoaderSpinner(true)
    customeraxios
      .get(`customers/users/count?date=${date1}`)
      // .get(`https://42b2-14-143-13-114.in.ngrok.io/payment/users/count?date=2022-11-02`)
      .then((response) => {
        setTrendData(response.data);
    setLoaderSpinner(false)
      })
      .catch(function (error) {
        console.log(error, "error");
      });
  }, []);
  return (

    <Grid item xs={12} md={12} sm={12} lg={12}>
      <Card
        style={{ borderRadius: "10px", flex: "0 0 100%", height: "100%" }}
      >
        <CardHeader style={{ padding: "5px", borderBottom: "0px" }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={6} sm={6} lg={6}>
              <div style={{ display: "flex" }}>
                <div
                  className="dashboard-font"
                  style={{
                    zIndex:"1",
                    paddingTop: "6px",
                    paddingLeft: "10px"
                }}
                >
                  LAST & NEXT WEEK EXPIRY USERS
                </div>{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;
              </div>
              <Grid
                item
                xs={6}
                md={6}
                sm={6}
                lg={6}
                style={{
                  position: "relative",
                  left: "0px",
                  paddingTop: "0px",
                }}
              >
              </Grid>
            </Grid>
            <Grid item xs={6} md={6} sm={6} lg={6}>
              <CloseIcon
                className="CloseIcon"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  props.setCustomerState(!props.customerState)
                }
              />
            </Grid>
          </Grid>
        </CardHeader>
        <CardBody style={{ padding: "0px" }}>
          <CustomerLinetrendChart trendData={trendData} setTrendData={setTrendData} loaderSpinneer={loaderSpinneer} setLoaderSpinner={setLoaderSpinner}/>
        </CardBody>
      </Card>
    </Grid>
  )
}
export default TrendChart;

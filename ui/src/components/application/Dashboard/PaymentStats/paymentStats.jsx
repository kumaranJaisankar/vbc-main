import React, { useState, useEffect } from "react";
import { billingaxios } from "../../../../axios";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody } from "reactstrap";
import StatsBarChart from "./paymentstatsChart";
import CloseIcon from "@mui/icons-material/Close";

const PaymentStats = (props) => {
  const [paymentStatsData, setPaymentStatsData] = useState([]);
  const [loaderSpinneer, setLoaderSpinner ] = useState(false)

  useEffect(() => {
    var nowDate = new Date();
    var date1 = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
    setLoaderSpinner(true)
    billingaxios
      .get(`payment/enh/amount/display?date=${date1}`)
      .then((response) => {
        setPaymentStatsData(response.data.parent_amount);
    setLoaderSpinner(false)
      })
      .catch(function (error) {
        console.log(error, "error");
      });
  }, []);
  return (
    <>
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
                      position: "relative",
                      left: "15px",
                      marginTop: "10px",
                    }}
                  >
                     PAYMENT STATS
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
                  <p
                    className="complaint_count"
                    style={{
                      marginTop: "-5px",
                      marginBottom: "0px",
                      fontSize: "20px",
                    }}
                  >
                    <span>{""}</span>
                  </p>
                </Grid>
              </Grid>
              <Grid item xs={6} md={6} sm={6} lg={6}>
                <CloseIcon
                  className="CloseIcon"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    props.SetInvoiceDownload(!props.invoiceDownload)
                  }
                />
              </Grid>
            </Grid>
          </CardHeader>
          <CardBody style={{ padding: "0px" }}>
            <StatsBarChart paymentStatsData={paymentStatsData} setPaymentStatsData={setPaymentStatsData}  loaderSpinneer={loaderSpinneer} setLoaderSpinner={setLoaderSpinner}/>
            {console.log(paymentStatsData, "paymentStatsData")}
          </CardBody>
        </Card>
      </Grid>
    </>
  );
};

export default PaymentStats;

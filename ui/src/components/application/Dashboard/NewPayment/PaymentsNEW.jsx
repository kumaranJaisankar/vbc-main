import React from "react";
import Grid from "@mui/material/Grid";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor:
      theme.palette.mode === "#EFF4FB" ? "#4A79E5 " : " #4A79E5 ",
  },
}));

const BorderLinearProgress1 = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },

  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,

    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#FF8B7B" : "#FF8B7B",
  },
}));

const BorderLinearProgress2 = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#fccd3a" : "#fccd3a",
  },
}));

const BorderLinearProgress3 = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#00dab5" : "#00dab5",
  },
}));

const BorderLinearProgress4 = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#ffc6b3" : "#ffc6b3",
  },
}));

const PaymentsChart = (props) => {
  var cash = props.paymentData?.cheque_payment_count
    ? props.paymentData?.cheque_payment_count
    : 0;
  // console.log(cash);

  var Total = props.paymentData?.total_payment_count
    ? parseFloat(props.paymentData?.total_payment_count).toFixed(2)
    : 0;

  var cheque = props.paymentData?.cheque_payment_count
    ? props.paymentData?.cheque_payment_count
    : 0;

  var online = props.paymentData?.upi_payment_count
    ? props.paymentData?.upi_payment_count
    : 0;

  var payment_gateway = props.paymentData?.payment_gatway_count
    ? props.paymentData?.payment_gatway_count
    : 0;
  var bank_transfers = props.paymentData?.bank_transfer_count
    ? props.paymentData?.bank_transfer_count
    : 0;


  return (
    <>
      <Grid container spacing={1} className="payment-chart">
        <Grid item xs={3} sm={3} md={3} lg={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              Cash
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              Cheque
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              UPI
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              Online
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            {/* Sailaja changed DashBoard->Payments->Bank T/F to Banking on 23rd March 2023  */}
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              Banking
            </span>
          </Grid>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              ₹&nbsp;
              {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.cash_payment_count
                  ? parseFloat(props.paymentData?.cash_payment_count).toFixed(2)
                  : "0"
              )}
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              ₹&nbsp;
              {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.cheque_payment_count
                  ? parseFloat(props.paymentData?.cheque_payment_count).toFixed(2)
                  : "0"
              )}
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              ₹&nbsp;
              {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.upi_payment_count
                  ? parseFloat(props.paymentData?.upi_payment_count).toFixed(2)
                  : "0"
              )}
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              ₹&nbsp;
              {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.payment_gatway_count
                  ? parseFloat(
                    props.paymentData?.payment_gatway_count
                  ).toFixed(2)
                  : "0"
              )}
            </span>
          </Grid>
          <br />
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
            <span
              style={{ fontSize: "15px", fontWeight: "400", color: "#7c7676" }}
            >
              ₹&nbsp;
              {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.bank_transfer_count
                  ? parseFloat(
                    props.paymentData?.bank_transfer_count
                  ).toFixed(2)
                  : "0"
              )}
            </span>
          </Grid>
        </Grid>
        <Grid item xs={4} sm={4} md={4} lg={4} style={{ padding: "0px" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{
              position: "relative",
              bottom: "-6%",
            }}
          >
            <BorderLinearProgress
              variant="determinate"
              value={cash === 0 ? 0 : Math.floor((cash / Total) * 100)}
              id="progressbar1"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ position: "relative", bottom: "-23%" }}
          >
            <BorderLinearProgress1
              variant="determinate"
              value={cash === 0 ? 0 : Math.floor((cheque / Total) * 100)}
              id="progressbar1"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ position: "relative", bottom: "-42%" }}
          >
            <BorderLinearProgress2
              variant="determinate"
              value={cash === 0 ? 0 : Math.floor((online / Total) * 100)}
              id="progressbar1"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ position: "relative", bottom: "-57%" }}
          >
            <BorderLinearProgress3
              variant="determinate"
              value={
                cash === 0 ? 0 : Math.floor((payment_gateway / Total) * 100)
              }
              id="progressbar1"
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            style={{ position: "relative", bottom: "-72%" }}
          >
            <BorderLinearProgress4
              variant="determinate"
              value={
                cash === 0 ? 0 : Math.floor((bank_transfers / Total) * 100)
              }
              id="progressbar1"
            />
          </Grid>
        </Grid>
      </Grid>
      {/* <Box sx={{ width: "100%" }}> */}
      {/* <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 0, sm: 0, md: 0, lg: 2 }}
        > */}
      {/* <Grid md={12} xs={4}>
            <Row style={{ padding: "4px", marginBottom: "22px" }}>
              <Col md={4} xs={4} className="font-col">
                <span>Cash</span>
              </Col>
              <Col
                md={4}
                xs={4}
                sm={4}
                lg={4}
                xl={4}
                className="payment-col-media"
                style={{
                  textAlign: "end",
                  paddingLeft: "0px",
                  paddingRight: "10%",
                }}
              >
                <span className="firstprogress">
                  ₹&nbsp; */}
      {/* { new Intl.NumberFormat().format(               
                      props.paymentData?.cash_payments
                    ?  parseFloat(props.paymentData?.cash_payments).toFixed(2)
                    : "0")} */}
      {/* {new Intl.NumberFormat("en-IN").format(
                    props.paymentData?.cash_payments
                      ? parseFloat(props.paymentData?.cash_payments).toFixed(2)
                      : "0"
                  )}
                </span>
              </Col>
              <Col md={4} xs={4} lg={4} xl={4} className="progress-col">
                <BorderLinearProgress
                  variant="determinate"
                  value={Math.floor((cash / Total) * 100)}
                  id="progressbar1"
                />
              </Col>
            </Row>
          </Grid> */}
      {/* <Grid md={12} xs={4}>
        <Row style={{ padding: "4px", marginBottom: "22px" }}>
          <Col md={4} xs={4} className="font-col">
            <span>Cheque</span>
          </Col>
          <Col
            md={4}
            xs={4}
            lg={4}
            xl={4}
            className="payment-col"
            style={{
              textAlign: "end",
              paddingLeft: "0px",
              paddingRight: "10%",
            }}
          >
            <span>
              ₹&nbsp; */}
      {/* {props.paymentData?.bank_transfers
                    ? props.paymentData?.bank_transfers
                    : "0"} */}
      {/* {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.bank_transfers
                  ? parseFloat(props.paymentData?.bank_transfers).toFixed(2)
                  : "0"
              )}
            </span>
          </Col>
          <Col md={4} xs={4} lg={4} xl={4} className="progress-col">
            <BorderLinearProgress1
              variant="determinate"
              value={Math.floor((cheque / Total) * 100)}
              id="progressbar1"
            />
          </Col>
        </Row>
      </Grid> */}
      {/* <Grid md={12} xs={4}>
        <Row style={{ padding: "4px", marginBottom: "22px" }}>
          <Col md={4} xs={4} className="font-col">
            <span>UPI</span>
          </Col>
          <Col
            md={4}
            xs={4}
            className="payment-col"
            style={{
              textAlign: "end",
              paddingLeft: "0px",
              paddingRight: "10%",
            }}
          >
            <span>
              ₹&nbsp; */}
      {/* {props.paymentData?.upi_payments
                    ? props.paymentData?.upi_payments
                    : "0"} */}
      {/* {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.upi_payments
                  ? parseFloat(props.paymentData?.upi_payments).toFixed(2)
                  : "0"
              )}
            </span>
          </Col>
          <Col md={4} xs={4} lg={4} xl={4} className="progress-col">
            <BorderLinearProgress2
              variant="determinate"
              value={Math.floor((online / Total) * 100)}
              id="progressbar1"
            />
          </Col>
        </Row>
      </Grid> */}
      {/* <Grid md={12} xs={4}>
        <Row style={{ marginBottom: "22px" }}>
          <Col xs={4} sm={4} lg={4} xl={4} md={4} className="font-col">
            <span>Payment Gateway</span>
          </Col>
          <Col
            md={4}
            xs={4}
            lg={4}
            xl={4}
            sm={4}
            className="payment-col-media"
            style={{
              textAlign: "end",
              paddingLeft: "0px",
              paddingRight: "10%",
            }}
          >
            <span>
              ₹&nbsp;
              {new Intl.NumberFormat("en-IN").format(
                props.paymentData?.payment_gateway_payments
                  ? parseFloat(
                      props.paymentData?.payment_gateway_payments
                    ).toFixed(2)
                  : "0"
              )} */}
      {/* {props.paymentData?.payment_gateway_payments
                    ? props.paymentData?.payment_gateway_payments
                    : "0"} */}
      {/* </span>
          </Col>
          <Col md={4} xs={4} lg={4} xl={4} className="progress-col">
            <BorderLinearProgress3
              variant="determinate"
              value={Math.floor((payment_gateway / Total) * 100)}
              id="progressbar1"
            />
          </Col>
        </Row>
      </Grid> */}
      {/* </Grid> */}
      {/* </Box> */}
    </>
  );
};
export default PaymentsChart;

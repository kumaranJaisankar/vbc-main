import React from "react";
import Grid from "@mui/material/Grid";
import { Row, Col } from "reactstrap";
import Box from "@mui/material/Box";
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
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#4A79E5 " :" #4A79E5 ",
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
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#FF8B7B" :"#FF8B7B",
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
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#fccd3a" :"#fccd3a",
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
    backgroundColor: theme.palette.mode === "#EFF4FB" ? "#00dab5" :"#00dab5",
  },
}));
const PaymentsUpdateChart = (props) => {
  var cash = props.paymentDataUdate?.cash_payments
    ? props.paymentDataUdate?.cash_payments
    : "0";



  var Total = props.paymentDataUdate?.total_payments
    ? parseFloat(props.paymentDataUdate?.total_payments).toFixed(2)
    : "0";

  var cheque = props.paymentDataUdate?.bank_transfers
    ? props.paymentDataUdate?.bank_transfers
    : "0";

  var online = props.paymentDataUdate?.upi_payments
    ? props.paymentDataUdate?.upi_payments
    : "0";

  var payment_gateway = props.paymentDataUdate?.payment_gateway_payments
    ? props.paymentDataUdate?.payment_gateway_payments
    : "0";


//     formatedNumber = new Intl.NumberFormat().format(2561556862056.12)
// console.log(formatedNumber)
// const num ={props.paymentDataUdate?.payment_gateway_payments}





  return (
    <>
      <Box sx={{ width: "100%" }}>
      <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 0, sm: 0, md: 0, lg: 2 }}
        >
          <Grid md={12} xs={4}>
            <Row style={{ padding: "4px", marginBottom:"22px" }}>
              <Col md={4} xs={4} className="font-col">
                <span>Cash</span>
              </Col>
              <Col md={4} xs={4} sm={4} lg={4} xl={4} className="payment-col-media">
                <span className="firstprogress">
                  ₹&nbsp;
                 {/* { new Intl.NumberFormat().format(               
                      props.paymentDataUdate?.cash_payments
                    ?  parseFloat(props.paymentDataUdate?.cash_payments).toFixed(2)
                    : "0")} */}
                     {new Intl.NumberFormat("en-IN").format( props.paymentDataUdate?.cash_payments
                        ? parseFloat( props.paymentDataUdate?.cash_payments).toFixed(2)
                        : "0"   )}
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
          </Grid>
          <Grid md={12} xs={4}>
            <Row style={{ padding: "4px" , marginBottom:"22px"}}>
              <Col md={4} xs={4} className="font-col">
                <span>Cheque</span>
              </Col>
              <Col md={4} xs={4} lg={4} xl={4} className="payment-col">
                <span>
                  ₹&nbsp;
                  {/* {props.paymentDataUdate?.bank_transfers
                    ? props.paymentDataUdate?.bank_transfers
                    : "0"} */}
                        {new Intl.NumberFormat("en-IN").format(props.paymentDataUdate?.bank_transfers
                        ? parseFloat( props.paymentDataUdate?.bank_transfers).toFixed(2)
                        : "0"   )}
                </span>
              </Col>
              <Col md={4} xs={4} lg={4} xl={4}className="progress-col">
                <BorderLinearProgress1
                  variant="determinate"
                  value={Math.floor((cheque / Total) * 100)}
                  id="progressbar1"
                />
              </Col>
            </Row>
          </Grid>
          <Grid md={12} xs={4}>
            <Row style={{ padding: "4px" , marginBottom:"22px"}}>
              <Col md={4} xs={4} className="font-col">
                <span>UPI</span>
              </Col>
              <Col md={4} xs={4} className="payment-col">
                <span>
                  ₹&nbsp;
                  {/* {props.paymentDataUdate?.upi_payments
                    ? props.paymentDataUdate?.upi_payments
                    : "0"} */}
                     {new Intl.NumberFormat("en-IN").format(props.paymentDataUdate?.upi_payments
                        ? parseFloat( props.paymentDataUdate?.upi_payments).toFixed(2)
                        : "0"   )}
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
          </Grid>
          <Grid md={12} xs={4}>
            <Row style={{ marginBottom:"22px"}}>
              <Col  xs={4} sm={4} lg={4} xl={4} md={4} className="font-col">
                <span>Payment Gateway</span>
              </Col>
              <Col md={4} xs={4} lg={4} xl={4} sm={4}className="payment-col-media">
                <span>
                  ₹&nbsp;
                  {new Intl.NumberFormat("en-IN").format(props.paymentDataUdate?.payment_gateway_payments
                        ? parseFloat(props.paymentDataUdate?.payment_gateway_payments).toFixed(2)
                        : "0"   )}
                  {/* {props.paymentDataUdate?.payment_gateway_payments
                    ? props.paymentDataUdate?.payment_gateway_payments
                    : "0"} */}
                </span>
              </Col>
              <Col md={4} xs={4} lg={4} xl={4}className="progress-col">
                <BorderLinearProgress3
                  variant="determinate"
                  value={Math.floor((payment_gateway / Total) * 100)}
                id="progressbar1"
                />
              </Col>
            </Row>
          </Grid>
          </Grid>
      </Box>
    </>
  );
};
export default PaymentsUpdateChart;

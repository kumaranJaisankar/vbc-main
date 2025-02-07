import React, { useState, useEffect } from "react";
import moment from "moment";
import Grid from "@mui/material/Grid";
import { Card, CardHeader, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import PaymentsChart from "./PaymentsNEW";
import { billingaxios } from "../../../../axios";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PaymentsUpdateChart from "./paymentupdates";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
const PaymentCard = (props) => {
  //Paymnet dashboard states
  const [paymentDaterange, setPaymentDaterange] = useState("today");
  const [paymentCalender, setPaymentCalender] = useState(false);
  const [paymentDataUdate, setPaymentDataUpdate] = useState([]);
  const [paymentcustomstartdate, setPaymentcustomstartdate] = useState(
    new Date()
  );
  const [paymentcustomenddate, setPaymentCustomenddate] = useState(new Date());
  const [totalPayment, setTotalPayment] = useState("total");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //Payment UseEffect API Call
  // today

  // select option function

  const getstartdateenddate = (e) => {
    setPaymentDaterange(e);

    if (e === "custom") {
      setPaymentCalender(true);
    }
    if (e === "today" || e === "yesterday" || e.target.vale === "custom") {
      setPaymentCalender(false);
    }

    //today
    let startdate = moment().format("YYYY-MM-DD");
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let enddate = moment().format("YYYY-MM-DD");
    if (e === "today") {
      //yesterday
    } else if (e === "yesterday") {
      startdate = moment().subtract(1, "d").format("YYYY-MM-DD");
      enddate = moment(date).subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days

    //end
    //end
    // last week
    else if (e.target.value === "lastweek") {
      startdate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      enddate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    //last month
    else if (e.target.value === "lastmonth") {
      startdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      enddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .add(1, "day")
        .format("YYYY-MM-DD");
    }
    //custom
    else if (e.target.value === "custom") {
      startdate = e.target.value;

      enddate = e.target.value;
    }
    return { startdate: startdate, enddate: enddate };
  };

  // payment Date Range

  const daterangeselection = (e, value) => {
    // handleClose();
    // let startdateenddateobj = getstartdateenddate(e);
    // var config = {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // };
    // //

    // const data1 = {};
    // data1.start_date = startdateenddateobj.startdate;
    // data1.end_date = startdateenddateobj.enddate;

    // billingaxios
    //   .get(
    //     `payment/list?start_date=${startdateenddateobj.startdate}&end_date=${startdateenddateobj.enddate}`,
    //     { start_date: paymentcustomstartdate, end_date: paymentcustomenddate },

    //     data1,
    //     config
    //   )
    //   .then((response) => {
    //     setPaymentDataUpdate(response.data);

    //     console.log("testing");
    //   })
    //   .catch(function (error) {});
  };

  // useEffect(() => {
  //   handleClose();
  //   let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");

  //   let startdate = moment().format("YYYY-MM-DD");
  //   let enddate = moment(date).format("YYYY-MM-DD");

  //   setPaymentDaterange("today");
  //   // setCalender(false);
  //   startdate = moment().format("YYYY-MM-DD");
  //   enddate = moment().format("YYYY-MM-DD");

  //   if (paymentCalender) {
  //     startdate = moment(paymentcustomstartdate).format("YYYY-MM-DD");

  //     let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
  //     enddate = moment(paymentcustomenddate).add(1, "day").format("YYYY-MM-DD");
  //   }

  //   // Payment API Call
  //   billingaxios
  //     .get(`/payment/list?start_date=${startdate}&end_date=${enddate}&`)
  //     .then((response) => {
  //       setPaymentDataUpdate(response.data);
  //     })
  //     .catch(function (error) {
  //       console.log(error, "error");
  //     });
  // }, [paymentcustomstartdate, paymentcustomenddate]);

  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let ShowTrendIcon = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Admin") ||
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Franchise Owner") ||
    (tokenInfo && tokenInfo.user_type === "Branch Owner")
  ) {
    ShowTrendIcon = true;
  }

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
                      // justifyContent: "left",
                      position: "relative",
                      left: "15px",
                      // marginBottom: "10px",
                      marginTop: "5px",
                    }}
                  >
                    PAYMENTS
                    <Button
                      id="demo-positioned-button"
                      aria-controls={open ? "demo-positioned-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      style={{
                        marginTop: "-5px",
                        marginBottom: "0px",
                        fontSize: "20px",
                      }}
                    >
                      {/* <KeyboardArrowDownIcon /> */}
                    </Button>
                  </div>{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;
                  {/* <PaymentDateRange
                  setPaymentcustomstartdate={setPaymentcustomstartdate}
                  paymentcustomstartdate={paymentcustomstartdate}
                  setPaymentCustomenddate={setPaymentCustomenddate}
                  paymentcustomenddate={paymentcustomenddate}
                  paymentCalender={paymentCalender}
                  paymentDaterange={paymentDaterange}
                  paymentDaterangeselection={paymentDaterangeselection}
                /> */}
                </div>

                {/* menu */}

                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      setTotalPayment("total");
                    }}
                  >
                    Total
                  </MenuItem>

                  <MenuItem
                    onClick={() => {
                      daterangeselection("today");
                      setTotalPayment("today");
                    }}
                  >
                    Today
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      daterangeselection("yesterday");
                      setTotalPayment("yesterday");
                    }}
                  >
                    Yesterday
                  </MenuItem>
                </Menu>
                <Grid container spacing={2}>
                  {totalPayment === "total" ? (
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      sm={12}
                      xl={12}
                      className="complaint_count"
                      style={{ paddingTop: "6%", fontSize: "20px" }}
                    >
                      ₹&nbsp;
                      {new Intl.NumberFormat("en-IN").format(
                        props.paymentData?.total_payment_count
                          ? parseFloat(
                            props.paymentData?.total_payment_count
                          ).toFixed(2)
                          : "0"
                      )}
                    </Grid>
                  ) : totalPayment === "today" ? (
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      sm={12}
                      xl={12}
                      className="complaint_count"
                      style={{ paddingTop: "6%", fontSize: "20px" }}
                    >
                      ₹&nbsp;
                      {new Intl.NumberFormat("en-IN").format(
                        paymentDataUdate?.total_payments
                          ? parseFloat(
                            paymentDataUdate?.total_payments
                          ).toFixed(2)
                          : "0"
                      )}
                      /{" "}
                      {paymentDataUdate && paymentDataUdate.payments
                        ? paymentDataUdate.payments?.length
                        : 0}
                    </Grid>
                  ) : totalPayment === "yesterday" ? (
                    <Grid
                      item
                      xs={12}
                      md={12}
                      lg={12}
                      sm={12}
                      xl={12}
                      className="complaint_count"
                      style={{ paddingTop: "6%", fontSize: "20px" }}
                    >
                      ₹&nbsp;
                      {new Intl.NumberFormat("en-IN").format(
                        paymentDataUdate?.total_payments
                          ? parseFloat(
                            paymentDataUdate?.total_payments
                          ).toFixed(2)
                          : "0"
                      )}{" "}
                      /
                      {paymentDataUdate && paymentDataUdate.payments
                        ? paymentDataUdate.payments?.length
                        : 0}
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>
              </Grid>

              {ShowTrendIcon ? <Grid item xs={6} md={6} sm={6} lg={6} id="payment_icons">
                <TrendingUpOutlinedIcon
                  className="trendIcon"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    props.SetInvoiceDownload(!props.invoiceDownload)
                  }
                />
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/billingupdates/billingfields/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: {
                      customstartdate: props?.FilterStartDate,
                      customenddate: props?.FilterEndDate,
                    },
                  }}
                >
                  <i
                    style={{
                      position: "relative",
                      marginTop: "5px",
                      left: "15px",
                    }}
                    class="fa fa-arrow-right"
                  ></i>
                </Link>
              </Grid> : <Grid item xs={6} md={6} sm={6} lg={6}>
                <Link
                  to={{
                    pathname: `${process.env.PUBLIC_URL}/app/billingupdates/billingfields/${process.env.REACT_APP_API_URL_Layout_Name}`,
                    state: {
                      customstartdate: props?.FilterStartDate,
                      customenddate: props?.FilterEndDate,
                    },
                  }}
                >
                  <i
                    style={{
                      position: "relative",
                      marginTop: "5px",
                      left: "15px",
                    }}
                    class="fa fa-arrow-right"
                  ></i>
                </Link>
              </Grid>
              }
            </Grid>
          </CardHeader>
          <CardBody>
            {/* {totalPayment === "total" ? ( */}
            <PaymentsChart
              paymentData={props.paymentData}
              setHeaderData={props.setHeaderData}
            />
            {/* ) : totalPayment === "yesterday" ? (
              <PaymentsUpdateChart paymentDataUdate={paymentDataUdate} />
            ) : totalPayment === "today" ? (
              <PaymentsUpdateChart paymentDataUdate={paymentDataUdate} />
            ) : (
              ""
            )} */}
          </CardBody>
        </Card>
      </Grid>
    </>
  );
};

export default PaymentCard;

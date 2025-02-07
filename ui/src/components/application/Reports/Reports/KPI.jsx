import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { billingaxios } from "../../../../axios";
import Divider from '@mui/material/Divider';
import KpiFieldsNew from "./KpiFieldsNew";
import moment from "moment";

const KPI = () => {
  const [billingKpi, setBillingKpi] = useState();
  // new States for branch and franchise filters
  const [inputs, setInputs] = useState();
  const [kpicustomenddate, setkpiCustomenddate] = useState();
  const [kpicustomstartdate, setkpiCustomstartdate] = useState();
  const [showhidecustomfieldskpi, setShowhidecustomfieldskpi] = useState(false);

  const branchid = JSON.parse(localStorage.getItem("token")) && JSON.parse(localStorage.getItem("token")).branch?.id ? JSON.parse(localStorage.getItem("token")) && JSON.parse(localStorage.getItem("token")).branch?.id : ""
  const franchiseid = JSON.parse(localStorage.getItem("token")) && JSON.parse(localStorage.getItem("token")).franchise?.id ? JSON.parse(localStorage.getItem("token")) && JSON.parse(localStorage.getItem("token")).franchise?.id : ""

  const branchidd = JSON.parse(localStorage.getItem("token")).branch?.id ? `branch=${branchid}` : ""

  const franchiseidd = JSON.parse(localStorage.getItem("token")).franchise?.id ? `franchise=${franchiseid}` : ""

  const fracnhiseIDS = JSON.parse(localStorage.getItem("token")).franchise?.id ? franchiseidd : branchidd



  var startDate = moment().format("YYYY-MM-DD");
  var endDate = moment().format("YYYY-MM-DD");
  let connection = `&created=${startDate}&created_end=${endDate}`;
  const getQueryParams = () => {


    let queryParams = "";
    // branch
    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    }
     else if (JSON.parse(localStorage.getItem("token")).branch?.id) {
      queryParams += `branch=${JSON.parse(localStorage.getItem("token")).branch?.id}`;
    }
    else if(JSON.parse(localStorage.getItem("token")).franchise?.id || JSON.parse(localStorage.getItem("token")).branch?.id){
      queryParams +=``
    }

    else if (inputs && inputs.branch) {
      queryParams += `branch=${inputs.branch}`;
    }

    // fracnhise

    if (inputs && inputs.franchise === "ALL2") {
      queryParams += ``;
    } 
    
    else if (JSON.parse(localStorage.getItem("token")).franchise?.id) {
      queryParams += `&franchise=${JSON.parse(localStorage.getItem("token")).franchise?.id}`;
    }

    else if (inputs && inputs.franchise) {
      queryParams += `&franchise=${inputs.franchise}`;
    }

    // custome dates
    if (kpicustomstartdate === "ALL6") {
      queryParams += ``;
    } else if (kpicustomstartdate) {
      queryParams += `&start_date=${kpicustomstartdate}`;
    }

    if (kpicustomenddate === "ALL6") {
      queryParams += ``;
    } else if (kpicustomenddate) {
      queryParams += `&end_date=${kpicustomenddate}`;
    }



    return queryParams;
  };

  useEffect(() => {
    fetchkpis();
  }, [
    inputs,
    kpicustomstartdate,
    kpicustomenddate
  ]);
  // useEffect(() => {
  //   billingaxios.get(`/payment/total/reports?${fracnhiseIDS}`).then((res) => {
  //     console.log(res, "responsedata");
  //     setBillingKpi(res.data);
  //   });
  // }, []);

  const fetchkpis = () => {


    const queryParams = getQueryParams();
    billingaxios.get(`/payment/enh/list?${queryParams}`)
      .then((res) => {
        console.log(res, "responsedata");
        setBillingKpi(res.data);


      })
    // .catch((error) => {
    //     toast.error(error.detail, {
    //       position: toast.POSITION.TOP_RIGHT,
    //       autoClose: 1000,
    //     });
    // })

  };

  // code for Date Ranges

  const basedonkpirangeselector = (e, value) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    if (e.target.value === "ALL6") {
      setShowhidecustomfieldskpi(false);
      reportstartdate = "";
      reportenddate = "";
    }
    if (e.target.value === "today") {
      setShowhidecustomfieldskpi(true);

      reportstartdate = moment().format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //yesterday
    else if (e.target.value === "yesterday") {
      setShowhidecustomfieldskpi(true);

      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");

      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days
    else if (e.target.value === "last7days") {
      setShowhidecustomfieldskpi(true);

      reportstartdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      setShowhidecustomfieldskpi(true);

      reportstartdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //end
    //last week
    else if (e.target.value === "lastweek") {
      setShowhidecustomfieldskpi(true);

      reportstartdate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .format("YYYY-MM-DD");
    }
    // last month
    else if (e.target.value === "lastmonth") {
      setShowhidecustomfieldskpi(true);
      reportstartdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .format("YYYY-MM-DD");
    } else if (e.target.value === "custom") {
      setShowhidecustomfieldskpi(true);
      reportstartdate = e.target.value;

      reportstartdate = e.target.value;
    }
    setkpiCustomstartdate(reportstartdate);
    setkpiCustomenddate(reportenddate);
  };
  //handler for custom date
  const customKpiHandler = (e) => {
    if (e.target.name === "start_date") {
      setkpiCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setkpiCustomenddate(e.target.value);
    }
  };
  return (
    <>
      <Grid container spacing={2} id="mt10">
        <h3>KPI's</h3>
      </Grid>
      <Divider />
      <br />
      <Grid item md="12">
        <KpiFieldsNew
          setInputs={setInputs}
          inputs={inputs}
          kpicustomenddate={kpicustomenddate}
          kpicustomstartdate={kpicustomstartdate}
          basedonkpirangeselector={basedonkpirangeselector}
          showhidecustomfieldskpi={showhidecustomfieldskpi}
          customKpiHandler={customKpiHandler}
        />

      </Grid>
      <br />
      {/* <KPIReports/> */}
      <Grid container spacing={2} id="mt10">
        <Grid
          xs={6}
          md={2}
          sx={{ position: "relative", left: "10px", marginRight: "8px" }}
        >
          <Card className="count_cards">
            <p>
              <span className="total_reports_text">TOTAL AMOUNT</span>
              <br />
              <span className="total_count">
                <span className="payment_symbol">₹</span>
                {billingKpi?.total_counts
                  ? billingKpi?.total_counts?.total_amount.toFixed(0)
                  : "0"}
              </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p>
              <span className="total_reports_text">TOTAL DISCOUNTED</span>
              <br />
              <span className="total_count">
                <span className="payment_symbol">₹</span>
                {billingKpi?.total_counts
                  ? billingKpi?.total_counts?.total_discount_amount.toFixed(0)
                  : "0"}
              </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p>
              <span className="total_reports_text">TOTAL GST </span>
              <br />
              <span className="total_count">
                <span className="payment_symbol">₹</span>
                {billingKpi?.total_counts
                  ? billingKpi?.total_counts?.total_gst.toFixed(0)
                  : "0"}
              </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p>
              <span className="total_reports_text">REFUNDABLE DEPOSIT </span>
              <br />
              <span className="total_count">
                <span className="payment_symbol"></span>
                {billingKpi?.total_counts
                  ? billingKpi?.total_counts?.total_refund?.toFixed(0)
                  : "0"}
              </span>
            </p>
          </Card>
        </Grid>
        <Grid xs={6} md={2} sx={{ position: "relative", marginLeft: "25px" }}>
          <Card className="count_cards">
            <p>
              <span className="total_reports_text">SECURITY DEPOSIT </span>
              <br />
              <span className="total_count">
                <span className="payment_symbol"></span>
                {billingKpi?.total_counts
                  ? billingKpi?.total_counts?.total_security_deposit?.toFixed(0)
                  : "0"}
              </span>
            </p>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};
export default KPI;

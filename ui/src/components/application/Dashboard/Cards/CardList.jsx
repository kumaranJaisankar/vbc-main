import React, { useState, useEffect, useRef } from "react";
import Header from "./NewDashboardHeader/Header";
import moment from "moment";
import Grid from "@mui/material/Grid";
// import ComplaintsBarChart from "./ComplaintsChart";
import {
  networkaxios,
  customeraxios,
  helpdeskaxios,
  billingaxios,
  default as axiosBaseURL,
  adminaxios,
} from "../../../../axios";
import CustomerCard from "../NewCustomer/Customer";
import ComplaintCard from "../NewHelpdesk/Complaint";
import NetworkCard from "../NewNetwork/Network";
import PaymentCard from "../NewPayment/Payment";
import PaymentStats from "../PaymentStats/paymentStats";
import TrendChart from "../PaymentStats/trend";
import LeadChart from "../New Lead/leads";
import NewCustomerActivity from "../Customer/NewcustomerActivity";

const CardList = () => {
  const [sliderValue, setSliderValue] = useState(88);
  const [changeData, setChangeDate] = useState("today");
  //Ticket dashboard states
  const [headerDaterange3, setHeaderDaterange3] = useState("last30days");
  const [headerCalender, setHeaderCalender] = useState(false);
  const [headerData, setHeaderData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [newCustomerData, setNewCustomerData] = useState([]);
  const [customerActiveCard, setCustomerActiveCard] = useState([]);
  const [hidePaymemts, setHidePayments] = useState(false);
  const [clicked, setClicked] = useState(true);
  const [userCount, setUserCount] = useState({});

  {
    /*added highcharts package */
  }
  const [headercustomstartdate, setHeadercustomstartdate] = useState(
    new Date()
  );
  const [headercustomenddate, setHeaderCustomenddate] = useState(new Date());
  const [FilterStartDate, setFilterStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [FilterEndDate, setFilterEndDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  //Ticket UseEffect API Call
  // last 30 days
  const tokenInfo1 = JSON.parse(localStorage.getItem("token"));
  let showPassword = false;
  if (
    (tokenInfo1 && tokenInfo1.user_type === "Admin") ||
    (tokenInfo1 && tokenInfo1.user_type === "Franchise Owner")
  ) {
    showPassword = true;
  }
  // useEffect for headerData
  useEffect(() => {
    const fetchData = async () => {
      const localStorageKey = "HeaderData";
      const headerData = localStorage.getItem(localStorageKey);

      if (headerData) {
        setHeaderData(JSON.parse(headerData));
      } else {
        let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
        let startdate = moment().format("YYYY-MM-DD");
        let enddate = moment(date).format("YYYY-MM-DD");

        if (headerCalender) {
          startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
          enddate = moment(headercustomenddate)
            .add(1, "day")
            .format("YYYY-MM-DD");
        }

        const res1 = await helpdeskaxios.get(
          `v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&created_date=${startdate}&created_date_end=${enddate}&`
        );
        setHeaderData(res1.data);
        localStorage.setItem(localStorageKey, JSON.stringify(res1.data));
      }
    };

    fetchData();
  }, [headercustomstartdate, headercustomenddate]);

  // useEffect for paymentData
  useEffect(() => {
    const fetchData = async () => {
      const localStorageKey = "PaymentData";
      const paymentData = localStorage.getItem(localStorageKey);

      if (paymentData) {
        setPaymentData(JSON.parse(paymentData));
      } else {
        let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
        let startdate = moment().format("YYYY-MM-DD");
        let enddate = moment(date).format("YYYY-MM-DD");

        if (headerCalender) {
          startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
          enddate = moment(headercustomenddate)
            .add(1, "day")
            .format("YYYY-MM-DD");
        }

        const res2 = await billingaxios.get(
          `/payment/enh/dashboard?status=1&start_date=${startdate}&end_date=${enddate}&`
        );
        setPaymentData(res2.data);
        localStorage.setItem(localStorageKey, JSON.stringify(res2.data));
      }
    };

    fetchData();
  }, [headercustomstartdate, headercustomenddate]);

  // useEffect for leadData
  useEffect(() => {
    const fetchData = async () => {
      const localStorageKey = "LeadData";
      const leadData = localStorage.getItem(localStorageKey);

      if (leadData) {
        setLeadData(JSON.parse(leadData));
      } else {
        let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
        let startdate = moment().format("YYYY-MM-DD");
        let enddate = moment(date).format("YYYY-MM-DD");

        if (headerCalender) {
          startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
          enddate = moment(headercustomenddate)
            .add(1, "day")
            .format("YYYY-MM-DD");
        }

        const res3 = await axiosBaseURL.get(
          `/radius/lead/dashboard/v2?created_end=${enddate}&created=${startdate}`
        );
        setLeadData(res3.data);
        localStorage.setItem(localStorageKey, JSON.stringify(res3.data));
      }
    };

    fetchData();
  }, [headercustomstartdate, headercustomenddate]);

  // useEffect for networkData
  useEffect(() => {
    const fetchData = async () => {
      const localStorageKey = "NetworkData";
      const networkData = localStorage.getItem(localStorageKey);

      if (networkData) {
        setNetworkData(JSON.parse(networkData));
      } else {
        let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
        let startdate = moment().format("YYYY-MM-DD");
        let enddate = moment(date).format("YYYY-MM-DD");

        if (headerCalender) {
          startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
          enddate = moment(headercustomenddate)
            .add(1, "day")
            .format("YYYY-MM-DD");
        }

        const res4 = await networkaxios.get(
          `network/enh/dashboard?created_end=${enddate}&created=${startdate}`
        );
        setNetworkData(res4.data);
        localStorage.setItem(localStorageKey, JSON.stringify(res4.data));
      }
    };

    fetchData();
  }, [headercustomstartdate, headercustomenddate]);

  // select option function

  const getstartdateenddate = (e) => {
    setHeaderDaterange3(e);

    //today
    let startdate = moment().subtract(30, "d").format("YYYY-MM-DD");
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let enddate = moment(date).format("YYYY-MM-DD");

    if (e === 30) {
      // setChangeDate()
      //yesterday
    }
    //last 7 days
    else if (e === 68) {
      startdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      // setChangeDate()
    }

    // last15days
    else if (e === 50) {
      startdate = moment().subtract(15, "d").format("YYYY-MM-DD");
      // setChangeDate()
    } else if (e === 88) {
      startdate = moment().subtract(0, "d").format("YYYY-MM-DD");
      // setChangeDate()
    }

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

  const renderAfterCalled = useRef(false);
  // customer Date Range
  const headerDaterangeselection = (e, value) => {
    let startdate = moment().format("YYYY-MM-DD");
    if (e == 50) {
      startdate = moment().subtract(15, "d").format("YYYY-MM-DD");
      // setChangeDate()
    }
    if (e == 68) {
      startdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      // setChangeDate()
    }
    if (e == 88) {
      startdate = moment().subtract(0, "d").format("YYYY-MM-DD");
      // setChangeDate()
    }

    let startdateenddateobj = getstartdateenddate(e);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //
    const data1 = {};
    data1.start_date = startdateenddateobj.startdate;
    data1.end_date = startdateenddateobj.enddate;
    setFilterStartDate(data1.start_date);
    setFilterEndDate(data1.end_date);

    helpdeskaxios
      .get(
        `v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&created_date=${startdateenddateobj.startdate}&created_date_end=${startdateenddateobj.enddate}`,
        { start_date: headercustomstartdate, end_date: headercustomenddate },

        data1,
        config
      )
      .then((response) => {
        setHeaderData(response.data);
      })
      .catch(function (error) {
        console.log(error, "error");
      });

    // billing
    billingaxios
      .get(
        `/payment/enh/dashboard?status=1&start_date=${startdateenddateobj.startdate}&end_date=${startdateenddateobj.enddate}`,
        { start_date: headercustomstartdate, end_date: headercustomenddate },

        data1,
        config
      )
      .then((response) => {
        setPaymentData(response.data);
      })
      .catch(function (error) {
        console.log(error, "error");
      });
    // Lead  API

    axiosBaseURL
      .get(
        `/radius/lead/dashboard/v2?created_end=${startdateenddateobj.enddate}&created=${startdateenddateobj.startdate}`,
        { start_date: headercustomstartdate, end_date: headercustomenddate },

        data1,
        config
      )
      .then((response) => {
        setLeadData(response.data);
        // resultData(leadData);
      })
      .catch(function (error) {
        console.log(error, "error");
      });

    networkaxios
      .get(
        `network/enh/dashboard?created_end=${startdateenddateobj.enddate}&created=${startdateenddateobj.startdate}`,
        { start_date: headercustomstartdate, end_date: headercustomenddate },

        data1,
        config
      )
      .then((response) => {
        setNetworkData(response.data);
      })
      .catch(function (error) {
        console.log(error, "error");
      });
  };
  const [loaderSpinneer, setLoaderSpinner] = useState(false);

  // tickets
  // const handleReloadClick1 = async () => {
  //   // Define the dates as you do in the useEffect
  //   let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
  //   let startdate = moment().format("YYYY-MM-DD");
  //   let enddate = moment(date).format("YYYY-MM-DD");

  //   if (headerCalender) {
  //     startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
  //     let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
  //     enddate = moment(headercustomenddate).add(1, "day").format("YYYY-MM-DD");
  //   }

  //   // Fetch the new data
  //   const res1 = await helpdeskaxios.get(`v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&created_date=${startdate}&created_date_end=${enddate}&`);
  //   const res2 = await billingaxios.get(`/payment/enh/dashboard?start_date=${startdate}&end_date=${enddate}&`);
  //   const res3 = await axiosBaseURL.get(`/radius/lead/dashboard/v2?created_end=${enddate}&created=${startdate}`);
  //   const res4 = await networkaxios.get(`network/dashboard/v2?created_end=${enddate}&created=${startdate}`);

  //   // Update the local storage
  //   const localStorageKey = "DashboardData";
  //   const updatedData = {
  //     headerData: res1.data,
  //     paymentData: res2.data,
  //     leadData: res3.data,
  //     networkData: res4.data
  //   };
  //   localStorage.setItem(localStorageKey, JSON.stringify(updatedData));

  //   // Update the state
  //   setHeaderData(res1.data);
  //   setPaymentData(res2.data);
  //   setLeadData(res3.data);
  //   setNetworkData(res4.data);
  // };
  const handleReloadHeaderData = async () => {
    // Define the dates as you do in the useEffect
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let startdate = moment().format("YYYY-MM-DD");
    let enddate = moment(date).format("YYYY-MM-DD");

    if (headerCalender) {
      startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
      let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
      enddate = moment(headercustomenddate).add(1, "day").format("YYYY-MM-DD");
    }

    // Fetch the new data
    const res1 = await helpdeskaxios.get(
      `v2/enh/list/count?tabs=opn,asn,cld,inp,rsl&created_date=${startdate}&created_date_end=${enddate}&`
    );

    // Update the local storage
    const localStorageKey = "HeaderData";
    localStorage.setItem(localStorageKey, JSON.stringify(res1.data));

    // Update the state
    setHeaderData(res1.data);
  };

  const handleReloadPaymentData = async () => {
    // Define the dates as you do in the useEffect
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let startdate = moment().format("YYYY-MM-DD");
    let enddate = moment(date).format("YYYY-MM-DD");

    if (headerCalender) {
      startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
      let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
      enddate = moment(headercustomenddate).add(1, "day").format("YYYY-MM-DD");
    }

    // Fetch the new data
    const res2 = await billingaxios.get(
      `/payment/enh/dashboard?status=1&start_date=${startdate}&end_date=${enddate}&`
    );

    // Update the local storage
    const localStorageKey = "PaymentData";
    localStorage.setItem(localStorageKey, JSON.stringify(res2.data));

    // Update the state
    setPaymentData(res2.data);
  };

  const handleReloadLeadData = async () => {
    // Define the dates as you do in the useEffect
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let startdate = moment().format("YYYY-MM-DD");
    let enddate = moment(date).format("YYYY-MM-DD");

    if (headerCalender) {
      startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
      let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
      enddate = moment(headercustomenddate).add(1, "day").format("YYYY-MM-DD");
    }

    // Fetch the new data
    const res3 = await axiosBaseURL.get(
      `/radius/lead/dashboard/v2?created_end=${enddate}&created=${startdate}`
    );

    // Update the local storage
    const localStorageKey = "LeadData";
    localStorage.setItem(localStorageKey, JSON.stringify(res3.data));

    // Update the state
    setLeadData(res3.data);
  };

  const handleReloadNetworkData = async () => {
    // Define the dates as you do in the useEffect
    let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    let startdate = moment().format("YYYY-MM-DD");
    let enddate = moment(date).format("YYYY-MM-DD");

    if (headerCalender) {
      startdate = moment(headercustomstartdate).format("YYYY-MM-DD");
      let date = moment(new Date(), "DD-MM-YYYY").add(1, "day");
      enddate = moment(headercustomenddate).add(1, "day").format("YYYY-MM-DD");
    }

    // Fetch the new data
    const res4 = await networkaxios.get(
      `network/enh/dashboard?created_end=${enddate}&created=${startdate}`
    );

    // Update the local storage
    const localStorageKey = "NetworkData";
    localStorage.setItem(localStorageKey, JSON.stringify(res4.data));

    // Update the state
    setNetworkData(res4.data);
  };

  const updateDashboardData = async () => {
    const res1 = await customeraxios.get(
      `/customers/v3/list/count?tabs=act,exp,spd,prov,hld,dct`
    );

    // Update the local storage
    const localStorageKey = "NewCustomerData";

    localStorage.setItem(localStorageKey, JSON.stringify(res1.data));

    // Update the state
    setNewCustomerData(res1.data);
    setLoaderSpinner(false);
  };

  const updateDashboardDatatwo = async () => {
    const res2 = await customeraxios.get(`/customers/analytics/customercard2`);

    // Update the local storage
    const localStorageKey = "CustomerActiveCard";
    localStorage.setItem(localStorageKey, JSON.stringify(res2.data));

    // Update the state
    setCustomerActiveCard(res2.data);
    setLoaderSpinner(false);
  };
  // Attach this function to the onClick event of your reload button

  const handleReloadClick = () => {
    setSliderValue(88);
    handleReloadHeaderData();
    handleReloadPaymentData();
    handleReloadLeadData();
    handleReloadNetworkData();

    updateDashboardDatatwo();
    updateDashboardData();
    setLoaderSpinner(true);
  };

  useEffect(() => {
    // Function to clear local storage
    function clearLocalStorage() {
      // localStorage.removeItem("backup");
      localStorage.removeItem("PaymentData");

      localStorage.removeItem("CustomerActiveCard");
      localStorage.removeItem("LeadData");
      localStorage.removeItem("NetworkData");
      localStorage.removeItem("customerInfDetails");
      localStorage.removeItem("HeaderData");
      localStorage.removeItem("NewCustomerData");
      // This condition is added by Mariya on 03-05-2023
      // {
      //   !showPassword &&
      //   localStorage.removeItem("backup");
      // }

      // if(localStorage.getItem("token") &&   localStorage.getItem("backup") &&  showPassword ){

      // }else {
      //   localStorage.removeItem("backup");
      // }
    }

    // Add event listener to the window object
    window.addEventListener("beforeunload", clearLocalStorage);

    // Cleanup function to remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("beforeunload", clearLocalStorage);
    };
  }, []);

  // useEffect for newCustomerData
  useEffect(() => {
    const fetchData = async () => {
      const localStorageKey = "NewCustomerData";
      const newCustomerData = localStorage.getItem(localStorageKey);

      if (newCustomerData) {
        setNewCustomerData(JSON.parse(newCustomerData));
      } else {
        setLoaderSpinner(true);

        const res1 = await customeraxios.get(
          `/customers/v3/list/count?tabs=act,exp,spd,prov,hld,dct`
        );
        setNewCustomerData(res1.data);

        setLoaderSpinner(false);
        localStorage.setItem(localStorageKey, JSON.stringify(res1.data));
      }
    };

    fetchData();
  }, []);

  function fetchUsercount() {
    adminaxios
      // .get(`accounts/users`)
      .get(`accounts/universityusers/count`)
      // .then((res) => setData(res.data))
      .then((res) => {
        console.log(res.data);
        let staff = res.data.filter((res) => res.user_type === "STAFF");
        let student = res.data.filter((res) => res.user_type === "STUDENT");
        setUserCount({
          studentCount: student[0].count,
          staffCount: staff[0].count,
        });
      })
      .catch((error) => {
        console.log(error);
        // let staff = [
        //   {
        //     user_type: "STAFF",
        //     count: 2,
        //   },
        //   {
        //     user_type: "STUDENT",
        //     count: 2,
        //   },
        // ].filter((res) => res.user_type === "STAFF");
        // let student = [
        //   {
        //     user_type: "STAFF",
        //     count: 2,
        //   },
        //   {
        //     user_type: "STUDENT",
        //     count: 2,
        //   },
        // ].filter((res) => res.user_type === "STUDENT");
        // setUserCount({
        //   studentCount: student[0].count,
        //   staffCount: staff[0].count,
        // });
      });
  }

  // useEffect for customerActiveCard
  useEffect(() => {
    const fetchData = async () => {
      const localStorageKey = "CustomerActiveCard";
      const customerActiveCard = localStorage.getItem(localStorageKey);

      if (customerActiveCard) {
        setCustomerActiveCard(JSON.parse(customerActiveCard));
      } else {
        setLoaderSpinner(true);

        const res2 = await customeraxios.get(
          `/customers/analytics/customercard2`
        );
        setCustomerActiveCard(res2.data);

        setLoaderSpinner(false);
        localStorage.setItem(localStorageKey, JSON.stringify(res2.data));
      }
    };

    fetchData();
    fetchUsercount();
  }, []);

  const tokenInfo = JSON.parse(localStorage.getItem("token"));

  let Showcards = false;

  if (tokenInfo && tokenInfo.user_type === "Staff") {
    Showcards = true;
  }
  const showHide = () => {
    setHidePayments(true);
  };

  const [invoiceDownload, SetInvoiceDownload] = useState(false);
  const [customerState, setCustomerState] = useState(false);
  return (
    <>
      <div style={{ position: "relative", top: "30px", left: "15px" }}>
        <Header
          handleReloadClick={handleReloadClick}
          setCustomerState={setCustomerState}
          customerState={customerState}
          SetInvoiceDownload={SetInvoiceDownload}
          invoiceDownload={invoiceDownload}
          setHeadercustomstartdate={setHeadercustomstartdate}
          headercustomstartdate={headercustomstartdate}
          setHeaderCustomenddate={setHeaderCustomenddate}
          headercustomenddate={headercustomenddate}
          headerCalender={headerCalender}
          headerDaterange3={headerDaterange3}
          headerDaterangeselection={headerDaterangeselection}
          headerData={headerData}
          setHeaderData={setHeaderData}
          getstartdateenddate={getstartdateenddate}
          setChangeDate={setChangeDate}
          sliderValue={sliderValue}
          setSliderValue={setSliderValue}
        />
      </div>

      {/* new  design */}
      {Showcards ? (
        ""
      ) : (
        <Grid container spacing={2} style={{ marginTop: "-1.5%" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 33.333%", display: "flex", maxHeight: "20rem" }}
          >
            {/* customer */}
            <CustomerCard
              // setNewCustomerData={setNewCustomerData}
              newCustomerData={newCustomerData}
              // customerData={customerData}
              loaderSpinneer={loaderSpinneer}
              studentCount={userCount.studentCount}
            />
          </Grid>
          {invoiceDownload ? (
            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  flex: "1 0 66.333%",
                  display: "flex",
                  maxHeight: "20rem",
                }}
              >
                <PaymentStats
                  SetInvoiceDownload={SetInvoiceDownload}
                  invoiceDownload={invoiceDownload}
                />
              </Grid>
            </>
          ) : customerState ? (
            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                style={{
                  flex: "1 0 66.333%",
                  display: "flex",
                  maxHeight: "20rem",
                }}
              >
                {/* <TrendChart
                  claasName="trendchart"
                  setCustomerState={setCustomerState}
                  customerState={customerState}
                /> */}
              </Grid>
            </>
          ) : (
            <>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                style={{
                  flex: "1 0 66.333%",
                  display: "flex",
                  maxHeight: "20rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* payments */}

                <div>
                  <img
                    src="https://res.cloudinary.com/dtbarluca/image/upload/b_rgb:ffffff/c_crop,w_280/v1720549203/logo-icon5_zmd3tm.png"
                    alt="dd"
                    style={{ borderRadius: "10px", opacity: 0.9 }}
                  />
                </div>

                {/* <PaymentCard
                  paymentData={paymentData}
                  FilterStartDate={FilterStartDate}
                  FilterEndDate={FilterEndDate}
                  showHide={showHide}
                  SetInvoiceDownload={SetInvoiceDownload}
                  invoiceDownload={invoiceDownload}
                /> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={4}
                lg={4}
                style={{
                  flex: "1 0 66.333%",
                  display: "flex",
                  maxHeight: "20rem",
                }}
              >
                {/* Cutomer activity */}
                <NewCustomerActivity
                  newCustomerData={customerActiveCard}
                  setCustomerState={setCustomerState}
                  customerState={customerState}
                  loaderSpinneer={loaderSpinneer}
                  staffCount={userCount.staffCount}
                />
              </Grid>
            </>
          )}
        </Grid>
      )}

      {Showcards ? (
        ""
      ) : (
        <Grid
          container
          spacing={2}
          style={{ position: "relative", top: "1rem" }}
          className="responsive_dashboard_card"
        >
          {/* Network */}
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 33.333%", display: "flex", maxHeight: "22rem" }}
          >
            {/* <NetworkCard
              networkData={networkData}
              setNetworkData={setNetworkData}
            /> */}
          </Grid>

          {/* Payments */}
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 33.333%", display: "flex", maxHeight: "22rem" }}
          >
            {/* Complaints */}
            {/* <ComplaintCard
              headerData={headerData}
              getstartdateenddate={getstartdateenddate}
              defaultDateFilter={changeData}
              FilterStartDate={FilterStartDate}
              FilterEndDate={FilterEndDate}
              clicked={clicked}
              setClicked={setClicked}
            /> */}
          </Grid>
          {/* lead */}

          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 33.333%", display: "flex", maxHeight: "22rem" }}
          >
            {/* <LeadChart leadData={leadData} /> */}
          </Grid>
        </Grid>
      )}

      {Showcards ? (
        <Grid container spacing={2} style={{ marginTop: "-1.5%" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 66.333%", display: "flex", maxHeight: "22rem" }}
          >
            {/* Cutomer activity */}
            <NewCustomerActivity
              newCustomerData={customerActiveCard}
              loaderSpinneer={loaderSpinneer}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 33.333%", display: "flex", maxHeight: "22rem" }}
          >
            {/* Complaints */}
            <ComplaintCard
              headerData={headerData}
              getstartdateenddate={getstartdateenddate}
              defaultDateFilter={changeData}
              FilterStartDate={FilterStartDate}
              FilterEndDate={FilterEndDate}
              clicked={clicked}
              setClicked={setClicked}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            style={{ flex: "1 0 33.333%", display: "flex", maxHeight: "22rem" }}
          >
            <LeadChart leadData={leadData} />
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};
// .

export default CardList;

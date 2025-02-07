import React, { useState, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { classes } from "../../../data/layouts";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";

import CustomerReports from "./customerreports/customerreports";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";

const ReportDetails = (
  props,
  customerInfo
) => {
  const history = useHistory();
  const { id, username, radius_info } = useParams();
  const dispatch = useDispatch();
  const configDB = useSelector((content) => content.Customizer.customizer);
  let DefaultLayout = {};

  const [profileDetails, setProfileDetails] = useState(null);
  const [onsearch, setOnsearch] = useState(false);

  const [updateInfoCount, setUpdateInfoCount] = useState(0);

  useEffect(() => {
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === configDB.settings.sidebar.type
    );
    const modifyURL =
      process.env.PUBLIC_URL +
      "/dashboard/default/" +
      Object.keys(defaultLayoutObj).pop();
    const routeId =
      window.location.pathname === "/"
        ? history.push(modifyURL)
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find(
      (item) => Object.keys(item).pop() === routeId
    );
    const layout = routeId ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);
  }, [id]);

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  return (
    <>
    
    <Box sx={{ padding: 4 }}>
    <Grid container spacing={1} >
        <Grid item md="12">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" className="navigate_icon" />}
          >
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
              Dashboard 
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
              Reports
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="#00000 !important"
              fontSize="14px"
              className="last_typography"

            >
             Customer Reports
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <br />
          <br />
        <div className="edit-profile data_table">  
        <span className="all_cust">Reports</span>

      <Grid
        container
        rowSpacing={1}
        columnSpacing={2}
        sx={{ marginTop: "5px" }}
      >
      </Grid>
      {/* <Card style={{ borderRadius: "15px" }}> */}
        <Grid
          container
          rowSpacing={1}
          columnSpacing={2}
          sx={{ marginTop: "10px" }}
        >
          <Grid item md="12">
            <CustomerReports setOnsearch={setOnsearch} />
          </Grid>
        </Grid>
      {/* </Card> */}
      {/* <Grid
        container
        rowSpacing={1}
        columnSpacing={2}
        sx={{ marginTop: "10px" }}
      >
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          <NewReportCards 
          customerInfo={customerInfo} />
        </Grid>
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          <Yesterdaydata
          todayInfo={props.todayInfo}
          />
        </Grid>
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          <ExpiryTable
          todayInfo={props.todayInfo}
          />
        </Grid>
      </Grid> */}
      </div>
    </Box>
    </>
  );
};

export default ReportDetails;

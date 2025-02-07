import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import MUIButton from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import KYCCIRCLE from "../../../../assets/images/Customer-Circle-img/KycCircle.png";
import EXPCIRCLE from "../../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import RenewChangePlanModalCommon from "./RenewChangePlanModalCommon";
import Changepassword from "./changepassword";
import BufferTime from "./Buffer-time";
import { CUSTOMER_LIST } from "../../../../utils/permissions";
import SessionHistory from "../../customermanagement/sessionhistory";
import man from "../../../../assets/images/person_logo_icon.svg";
import CardMedia from "@mui/material/CardMedia";
import { customeraxios } from "../../../../axios";
import { Row, Col, TabContent, TabPane } from "reactstrap";
import { getAppliedServiceFiltersObj } from "../data";
import Tooltip from "@mui/material/Tooltip";
import Hold from "./hold";
import AreaFrachiseShifting from "./area-franchise-shifting";
import Deactive from "./deactive";
import CustomerExtension from "./Extension";
import RefreshIcon from "@mui/icons-material/Refresh";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const ProfileDetails = ({
  profileDetails,
  userDetails,
  userDetailsKeys,
  userDetailsStatusKeys,
  userDetailsAddressKeys,
  userDetailsdatakeys,
  disconnectMOdalopen,
  setUpdateInfoCount,
  setProfileDetails,
  userIdClickHandler,
  userDetailsCharges,
  row,
  username,
  fetchComplaints,
  rxTxKeys,
  rxTxData,
  deviceInfoKeys,
  deviceInfoData,
  fetchCPE,
  networkInfoKeys
}) => {
  const [isRenewChangePlanModalOpen, setIsRenewChangePlanModalOpen] =
    useState(false);

  const toggleRenewChangePlanModalOpen = () =>
    setIsRenewChangePlanModalOpen(!isRenewChangePlanModalOpen);

  // change password
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let Showpassword = false;

  if (
    (tokenInfo && tokenInfo.user_type === "Admin") ||
    (tokenInfo && tokenInfo.user_type === "Staff") ||
    (tokenInfo && tokenInfo.user_type === "Franchise Owner") ||
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Help Desk") ||
    (tokenInfo && tokenInfo.user_type === "Zonal Manager")
  ) {
    Showpassword = true;
  }
  const [activeSideTab, setActiveSideTab] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [isSessionHistoryOpen, setIsSessionHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // pagination api for session history
  const [customstartdate, setCustomstartdate] = useState();
  const [customenddate, setCustomenddate] = useState();
  const [sessionLists, updateSessionLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    currentTab: "all",
    tabCounts: {},
    totalRows: "",
    appliedServiceFilters: { ...getAppliedServiceFiltersObj() },
  });
  const [sessionCount, setSessionCOunt] = useState();
  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage, appliedServiceFilters } =
      sessionLists;

    let queryParams = "";
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (customstartdate) {
      queryParams += `&start_date=${customstartdate}`;
    }
    if (customenddate) {
      queryParams += `&end_date=${customenddate}`;
    }
    if (appliedServiceFilters.framedipaddress.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}framedipaddress=${
        appliedServiceFilters.framedipaddress.value.strVal
      }`;
    }
    if (appliedServiceFilters.callingstationid.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}callingstationid=${
        appliedServiceFilters.callingstationid.value.strVal
      }`;
    }
    return queryParams;
  };
  const renderAfterCalled = useRef(false);

  const fetchSessionList = () => {
    updateSessionLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));

    const queryParams = getQueryParams();

    customeraxios
      .get(`customers/enh/v2/data/${username}/consumption?${queryParams}`)
      .then((response) => {
        setSessionCOunt(response.data);
        const { data } = response;
        const { count, results, next, previous, page } = data;
        updateSessionLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          totalRows: count,
        }));
      })

      .catch(function (error) {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
        } else if (is500Error) {
        } else if (is404Error) {
        } else {
        }
      })

      .finally(function () {
        updateSessionLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  useEffect(() => {
    if (
      customstartdate ||
      customenddate ||
      sessionLists.appliedServiceFilters ||
      !renderAfterCalled
    ) {
      fetchSessionList();
    }
  }, [
    sessionLists.currentPageNo,
    sessionLists.currentItemsPerPage,
    customstartdate,
    customenddate,
    sessionLists.appliedServiceFilters,
  ]);

  const noOfSessionClickHandler = (row) => {
    setIsSessionHistoryOpen(true);
  };

  const handlePerRowsChange = (newPerPage, page) => {
    updateSessionLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateSessionLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  const openCustomizer = (type) => {
    fetchSessionList();
    setActiveSideTab(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  // const refreshHandler = () => {
  //   console.log("refresh");
  // };
  return (
    <Grid container spacing={1}>
      <Grid container spacing={2}></Grid>
      <br />
      <Stack
        direction="row"
        sx={{
          flexBasis: "100%",
          justifyContent: "space-between",
          position: "relative",
          top: "-30px",
        }}
      >
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          spacing={2}
          style={{ marginLeft: "20px" }}
        >
          <p className="all_cust">Customer Profile</p>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "flex-end" }}
          style={{ marginBottom: "35px" }}
        >
          <MUIButton
            variant="outlined"
            size="medium"
            className="cust_action"
            onClick={() => openCustomizer("2")}
          >
            Traffic/Session Report
            <span onClick={noOfSessionClickHandler}></span>
          </MUIButton>
          {token.permissions.includes(CUSTOMER_LIST.DISCONNECT) && (
            <>
              {token.permissions.includes(CUSTOMER_LIST.DISCONNECT) && (
                <Deactive
                  profileDetails={profileDetails}
                  setProfileDetails={setProfileDetails}
                  fetchComplaints={fetchComplaints}
                />
              )}
            </>
            //  <MUIButton
            //     variant="outlined"
            //     size="medium"
            //     className="cust_action"
            //     onClick={disconnectMOdalopen}
            //   >

            //     {profileDetails.restrict_access === true ? "Login" : "Logout"}

            //   </MUIButton>
            // <MUIButton
            //   variant="outlined"
            //   size="medium"
            //   className="cust_action"
            //   onClick={disconnectMOdalopen}
            // >
            //   Disconnect
            // </MUIButton>
          )}

          <>
            {token.permissions.includes(CUSTOMER_LIST.BUFFERTIME) && (
              <BufferTime
                profileDetails={profileDetails}
                userDetailsStatusKeys={userDetailsStatusKeys}
                setProfileDetails={setProfileDetails}
              />
            )}
          </>
          <>
            {token.permissions.includes(CUSTOMER_LIST.HOLDBUTTON) && (
              <Hold
                profileDetails={profileDetails}
                setProfileDetails={setProfileDetails}
                fetchComplaints={fetchComplaints}
              />
            )}
          </>
          {JSON.parse(sessionStorage?.getItem("customerInfDetails"))
            ?.area_id ? (
            <>
              {(token.permissions.includes(CUSTOMER_LIST.CHANGE_PLAN) ||
                token.permissions.includes(CUSTOMER_LIST.RENEW_PLAN)) && (
                <MUIButton
                  variant="outlined"
                  size="medium"
                  className="cust_action"
                  onClick={() => toggleRenewChangePlanModalOpen()}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Renew/Change plan
                </MUIButton>
              )}
            </>
          ) : (
            ""
          )}
          {Showpassword ? (
            <>
              {token.permissions.includes(CUSTOMER_LIST.PASSWORD) && (
                <Changepassword
                  profileDetails={profileDetails}
                  setProfileDetails={setProfileDetails}
                  fetchComplaints={fetchComplaints}
                />
              )}
            </>
          ) : (
            ""
          )}
          <AreaFrachiseShifting
            profileDetails={profileDetails}
            fetchComplaints={fetchComplaints}
          />
          {token.permissions?.includes(CUSTOMER_LIST.EXTENSION) && (
            <CustomerExtension
              profileDetails={profileDetails}
              fetchComplaints={fetchComplaints}
            />
          )}
        </Stack>
      </Stack>
      <Grid item md="12">
        <Card
          sx={{
            borderRadius: "15px",
            boxShadow: "0 0.2rem 1rem rgba(0, 0, 0, 0.15)",
            position: "relative",
            top: "-25px",
          }}
        >
          <CardContent sx={{ padding: 4 }}>
            <Typography variant="h5" className="customerdetailsheading">
              Profile
              <EditIcon
                style={{ float: "right", cursor: "pointer" }}
                onClick={() => userIdClickHandler(row)}
              />
            </Typography>
            <br />
            <Grid container spacing={1}>
              <Grid
                item
                xs="12"
                sm="12"
                md="2"
                lg="2"
                xl="2"
                //  className="avatar"
                sx={{ maxWidth: "fit-content !important" }}
              >
                {profileDetails?.customer_documents?.customer_pic_preview ? (
                  <CardMedia
                    className="avatarProfilePicture"
                    component="img"
                    image={
                      profileDetails?.customer_documents?.customer_pic_preview
                    }
                    alt=""
                    sx={{
                      width: 200,
                      height: 200,
                      marginRight: "15px",
                      marginLeft: "-15px",
                    }}
                  />
                ) : (
                  <CardMedia
                    className="avatarProfilePicture"
                    component="img"
                    image={man}
                    alt=""
                    sx={{ width: 200, height: 200, border: "1px solid" }}
                  />
                )}
                {/* <div className="avatar"id="profile_img" ><Media body className="img-200"src={profileDetails.customer_pic_preview} alt="#"/></div> */}
              </Grid>
              <Grid item xs="12" sm="6" md="3" lg="3" xl="3">
                {userDetails &&
                  Object.keys(userDetailsKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="4" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="cust_details">
                              {userDetailsKeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="8" zeroMinWidth>
                        <Tooltip title={userDetails[item]}>
                          <Typography variant="body1" align="left" noWrap>
                            <p>
                              <span className="customer_details">
                                {userDetails[item]
                                  ? " " + userDetails[item]
                                  : "---"}
                              </span>
                            </p>
                          </Typography>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
              <Grid item xs="12" sm="6" md="3" lg="3" xl="3">
                <Grid container sx={{ height: "40px " }}>
                  <Grid item md="6" zeroMinWidth>
                    <p>
                      <span className="cust_details">{"Current Status :"}</span>
                    </p>
                  </Grid>
                  <Grid item md="6" zeroMinWidth>
                    {profileDetails?.status === "NYL" ? (
                      <span>
                        {" "}
                        <img src={EXPCIRCLE} />
                        &nbsp; &nbsp;
                        <p className="curr_status">Offline</p>
                      </span>
                    ) : profileDetails?.status === "Offline" ? (
                      <span>
                        <img src={EXPCIRCLE} />
                        &nbsp; &nbsp;
                        <p className="curr_status">Offline</p>
                      </span>
                    ) : profileDetails?.status === "Online" ? (
                      <span>
                        <img src={KYCCIRCLE} />
                        &nbsp; &nbsp;
                        <p className="curr_status">Online</p>
                      </span>
                    ) : (
                      <span>
                        {" "}
                        <img src={EXPCIRCLE} />
                        &nbsp; &nbsp;
                        <p className="curr_status">Offline</p>
                      </span>
                    )}
                  </Grid>
                </Grid>
                {userDetails &&
                  Object.keys(userDetailsStatusKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {userDetailsStatusKeys[item]}
                              {" : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" zeroMinWidth>
                        {/* Tooltip for Current Status to Plan Due Date */}
                        {/* <Tooltip title={userDetails[item]}> */}
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details">
                              {userDetails[item] ? userDetails[item] : "---"}
                            </span>
                          </p>
                        </Typography>
                        {/* </Tooltip>  */}
                      </Grid>
                    </Grid>
                  ))}
                    {userDetails &&
                  Object.keys(userDetailsdatakeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {userDetailsdatakeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details">
                              {userDetails[item]
                                ? " " + userDetails[item]
                                : "---"}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
              <Grid item xs="12" sm="12" md="3" lg="3" xl="3">
                {/* {userDetails &&
                  Object.keys(userDetailsdatakeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {userDetailsdatakeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details">
                              {userDetails[item]
                                ? " " + userDetails[item]
                                : "---"}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                    </Grid>
                  ))} */}
                {rxTxData &&
                  Object.keys(rxTxKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {rxTxKeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details" style={{fontWeight:"700",fontSize:"14px"}}>
                              {/* {userDetails[item]
                                ? " " + userDetails[item]
                                : "---"} */}
                                {rxTxData?.Rx?rxTxData?.Rx:"--- "} / {rxTxData?.Tx?rxTxData?.Tx:"---"}
                            </span>
                            <MUIButton
                              variant="text"
                              startIcon={<RefreshIcon />}
                              onClick={fetchCPE}
                            >
                              {/* Refresh */}
                              <span style={{marginLeft:"-4px", fontSize:"13px"}}>Refresh</span> 
                            </MUIButton>
                          </p>
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                  {deviceInfoData &&
                  Object.keys(deviceInfoKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {deviceInfoKeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details">
                              {deviceInfoData[item]
                                ? " " + deviceInfoData[item]
                                : "---"}
                            </span>
                            {/* <MUIButton
                              variant="text"
                              startIcon={<RefreshIcon />}
                              onClick={refreshHandler}
                            >
                              Refresh
                            </MUIButton> */}
                          </p>
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
                  {profileDetails &&
                  Object.keys(networkInfoKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {networkInfoKeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details">
                              {profileDetails[item]
                                ? " " + profileDetails[item]
                                : "---"}
                            </span>
                            {/* <MUIButton
                              variant="text"
                              startIcon={<RefreshIcon />}
                              onClick={refreshHandler}
                            >
                              Refresh
                            </MUIButton> */}
                          </p>
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
              {/* <Grid item xs="12" sm="12" md="3" lg="3" xl="3">
                {userDetails &&
                  Object.keys(rxTxKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {rxTxKeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p
                            style={{
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                            }}
                          >
                            <span className="customer_details">
                              {userDetails[item]
                                ? " " + userDetails[item]
                                : "---"}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                    </Grid>
                  ))}
              </Grid> */}
            </Grid>
            <Grid container spacing={1}>
              <Grid
                item
                xs="12"
                sm="12"
                md="8"
                lg="4"
                xl="2"
                sx={{ maxWidth: "fit-content !important" }}
              >
                <CardMedia sx={{ width: 200, height: 200 }} />
              </Grid>
              <Grid item xs="12" sm="6" md="3" lg="3" xl="3">
                {userDetails &&
                  Object.keys(userDetailsCharges).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="6" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {userDetailsCharges[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="6" rowSpacing={8} zeroMinWidth>
                        {/* Tooltip for Setup Box No to Static IP Cost */}
                        {/* <Tooltip title={userDetails[item]}>  */}
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="customer_details">
                              {userDetails[item]
                                ? " " + userDetails[item]
                                : "---"}
                            </span>
                          </p>
                        </Typography>
                        {/* </Tooltip> */}
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
              <Grid item xs="12" sm="12" md="5" lg="5" xl="5">
                {userDetails &&
                  Object.keys(userDetailsAddressKeys).map((item) => (
                    <Grid container key={item} sx={{ height: "40px " }}>
                      <Grid item md="3" zeroMinWidth>
                        <Typography variant="body1" align="left" noWrap>
                          <p>
                            <span className="cust_details">
                              {userDetailsAddressKeys[item] + " : "}
                            </span>
                          </p>
                        </Typography>
                      </Grid>
                      <Grid item md="9" rowSpacing={8} zeroMinWidth>
                        <Tooltip title={userDetails[item]}>
                          <Typography variant="body1" align="left" noWrap>
                            <p
                              style={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                              }}
                            >
                              <span className="customer_details">
                                {userDetails[item]
                                  ? " " + userDetails[item]
                                  : "---"}
                              </span>
                            </p>
                          </Typography>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      {/* discconect modal */}
      {isRenewChangePlanModalOpen && (
        <RenewChangePlanModalCommon
          fetchComplaints={fetchComplaints}
          isRenewChangePlanModalOpen={isRenewChangePlanModalOpen}
          setIsRenewChangePlanModalOpen={setIsRenewChangePlanModalOpen}
          toggleRenewChangePlanModalOpen={toggleRenewChangePlanModalOpen}
          setUpdateInfoCount={setUpdateInfoCount}
        />
      )}
      <Row>
        <Col md="12">
          <div
            className="customizer-contain"
            style={{
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
          >
            <div className="tab-content" id="c-pills-tabContent">
              <div
                className="customizer-header"
                style={{
                  border: "none",
                  borderTopLeftRadius: "20px",
                }}
              >
                <i className="icon-close" onClick={closeCustomizer}></i>
                <br />
                <br />
              </div>
              <div className=" customizer-body custom-scrollbar">
                <TabContent activeTab={activeSideTab}>
                  <TabPane tabId="2">
                    <SessionHistory
                      customstartdate={customstartdate}
                      setCustomstartdate={setCustomstartdate}
                      selectedRow={profileDetails}
                      setLoading={setLoading}
                      loading={loading}
                      trafficreport={fetchSessionList}
                      sessionLists={sessionLists}
                      handlePerRowsChange={handlePerRowsChange}
                      handlePageChange={handlePageChange}
                      sessionCount={sessionCount}
                      customenddate={customenddate}
                      setCustomenddate={setCustomenddate}
                      getQueryParams={getQueryParams}
                      updateSessionLists={updateSessionLists}
                    />
                  </TabPane>
                </TabContent>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Grid>
  );
};

export default ProfileDetails;

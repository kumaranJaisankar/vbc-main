import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import pick from "lodash.pick";
import { useDispatch, useSelector } from "react-redux";
import { customeraxios, adminaxios } from "../../../../axios";
import { classes } from "../../../../data/layouts";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import ProfileDetails from "./profile-details";
import Complaints from "./complaints";
import LatestInvoice from "./latestInvoice";
import Recipts from "./reciptInvoice";
import WalletInfo from "./wallet-info";
import OnlineSessionInfo from "./online-session-info";
import InstallationAddress from "./installation-address"
import RadiusInfo from "./radius-info";
import DocumentsInfo from "./documents-info";
import CPEInfo from "./cpe-info";
import PlanDetails from "./plan-details"
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalFooter, Button, Spinner } from "reactstrap";
import moment from "moment";
import { CustomerDetailss } from "../customersdetail/customerdetails";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import KYCCIRCLE from "../../../../assets/images/Customer-Circle-img/KycCircle.png";
import ACTCIRCLE from "../../../../assets/images/Customer-Circle-img/ActiveCircle.png";
import DCTCIRCLE from "../../../../assets/images/Customer-Circle-img/DctCircle.png";
import EXPCIRCLE from "../../../../assets/images/Customer-Circle-img/ExpiredCircle.png";
import INSCIRCLE from "../../../../assets/images/Customer-Circle-img/InstallationCircle.png";
import PROVCIRCLE from "../../../../assets/images/Customer-Circle-img/ProvisioningCircle.png";
import HLDCIRCLE from "../../../../assets/images/Customer-Circle-img/HoldCircle.png";
import SPDCIRCLE from "../../../../assets/images/Customer-Circle-img/SuspendedCircle.png";
import ErrorModal from "../../../common/ErrorModal";

//changed the profile details alignment by Marieya added plan and plan Due date
const userDetailsKeys = {
  username: "User ID",
  name: "Name",
  register_mobile: "Mobile",
  alternate_mobile: "Alt. Mobile",
  registered_email: "Email",
  branch: "Branch",
  franchise: "Franchise",
  zone: "Zone",
  area: "Area",



};

const userDetailsStatusKeys = {
  account_status: "Account Status",
  package_name: "Plan",
  expiry_date: "Plan Due Date",
  hold_at: "Hold At"

};
const userDetailsCharges = {
  stb_serial_no: "Setup Box No",
  extension_no: "Extension No",
  installation_charges: "Installation Charges",
  security_deposit: "Security Deposit",
  GSTIN: "GSTIN",
  static_ip_bind: "Static IP",
  static_ip_total_cost: "Static IP Total Cost",
  mac_bind: "MAC ID"
  // Sailaja Fixed Mac ID as MAC ID on 21st March 2023

};
const userDetailsAddressKeys = {
  hno: "H.No",
  street: "Street",
  city: "City",
  district: "District",
  state: "State",
  pincode: "Pincode",
  country: "Country",


};



//added new column in profile details by Marieya
const userDetailsdatakeys = {
  monthly_date: "Data Added On Date",
  packets: "Data Consumed",
  last_logoff: "Last Log Off",
  online_since: "Online Since",
  plan_updated: " Last Renewal Date"

  
};

const installationAddress = {
  hno1: "H.No",
  street1: "Street",
  city1: "City",
  district1: "District",
  state1: "State",
  pincode1: "Pincode",
  country1: "Country",
}
const rxTxKeys={
  RXTX: "RX / TX"
}
const deviceInfoKeys={
  software_version:"Device Version",
  product_model :"Device Model"
}
const networkInfoKeys={
  olt_serial_no:"OLT Serial No",
  parentdp_serial_no:"Parent DP Serial No",
  childp_serial_no:"Child DP Serial No",
  cpe_serial_no:"CPE Serial No"
}
const userDetailsKeys2 = {
  // static_ip_bind:"Serial No"
};


const CustomerDetails = (row, changePlanClickHandler, refresh) => {
  const [activeTab, setActiveTab] = useState(null);
  const [disconnectModal, setDisconnectModal] = useState(false);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const disconnectMOdalopen = () => setDisconnectModal(!disconnectModal);
  const history = useHistory();
  const { id, username, radius_info } = useParams();
  const dispatch = useDispatch();
  const configDB = useSelector((content) => content.Customizer.customizer);
  let DefaultLayout = {};

  const [profileDetails, setProfileDetails] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(null)
  const [updateInfoCount, setUpdateInfoCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [rxTx, setRxTX]=useState([]);
  const [deviceInfoData,SetDeviceInfoData]=useState([]);
  //to disable button

  const [disable, setDisable] = useState(false);
  useEffect(() => {
    const row = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    setSelectedRow(row);
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

    // async function fetchProfileDetails() {
    //   const [userInfo] = await Promise.all([
    //     customeraxios.get(`customers/360/${id}/${username}`),
    //   ]);
    //   setProfileDetails({ ...userInfo.data });
    //   setLoadingInfo({ ...userInfo.data })

    // }
    // fetchProfileDetails();
  }, []);


  async function fetchComplaints() {
    const [userInfo] = await Promise.all([
      customeraxios.get(`customers/360/${id}/${username}`),
    ]);
    setProfileDetails({ ...userInfo.data });
    setLoadingInfo({ ...userInfo.data })

  }

  useEffect(() => {
    fetchComplaints(username);
  }, [id, username]);

  async function fetchCPE() {
    const cpeData = await Promise.all([
      customeraxios.get(`customers/power/level/cpe/${username}`),
    ]);
    console.log(cpeData[0].data,"cpeData")
    // setProfileDetails({ ...userInfo.data });
    // setLoadingInfo({ ...userInfo.data })
    if(cpeData.length>0){
      setRxTX(cpeData[0].data)
    }
    

  }
  async function fetchDeviceInfo() {
    const deviceInfo = await Promise.all([
      customeraxios.get(`customers/device/details/${username}`),
    ]);
    console.log(deviceInfo,"deviceInfo");
    if(deviceInfo.length >0){
      SetDeviceInfoData(deviceInfo[0].data)
    }
    // setProfileDetails({ ...userInfo.data });
    // setLoadingInfo({ ...userInfo.data })

  }
useEffect(() => {
  fetchCPE(username)
  fetchDeviceInfo(username)
  // setProfileDetails({ ...userInfo.data });
  // setLoadingInfo({ ...userInfo.data })
  
  }, []);
  
  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };


  // get data for online session info
  const [expiryDate, setExpiryDate] = useState();
  const setExpDate = (value) => {
    setExpiryDate(value);
  };



  const userDetails = useMemo(() => {
    if (profileDetails) {
      return {
        ...pick(profileDetails, [
          "register_mobile",
          "alternate_mobile",
          "registered_email",
          "account_status",
          "plan",
          "username",
          "cleartext_password",
          "acctstoptime",
          "id",
          "area",
          "branch",
          "zone",
          "franchise",
          "GSTIN",
          "extension_no",
          "stb_serial_no",
          // 'email_flag',
          // 'sms_flag',
          'mac_bind',
          'static_ip_bind', 'monthly_date', "packets",
          "last_logoff",
          "online_since",
          "plan_updated"
        ]),
        username: profileDetails?.user ? profileDetails.user?.username : "---",
        zone: profileDetails?.area ? profileDetails?.area?.zone?.name : "---",
        area: profileDetails?.area ? profileDetails?.area.name : "---",
        branch: profileDetails?.area ? profileDetails.area?.zone?.branch.name : "---",
        franchise: profileDetails?.area ? profileDetails?.area?.franchise?.name : "---",
        mac_bind: profileDetails?.radius_info?.mac_bind
          ? profileDetails?.radius_info?.mac_bind
          : "--",


        nasport_bind: profileDetails?.radius_info?.nasport_bind
          ? profileDetails?.radius_info?.nasport_bind
          : "--",
        extension_no: profileDetails?.extension_no ? profileDetails?.extension_no : "---",
        stb_serial_no: profileDetails?.stb_serial_no ? profileDetails?.stb_serial_no : "---",
        //  sms_flag: profileDetails?.sms_flag ? profileDetails?.sms_flag : "---",
        // email_flag: profileDetails?.email_flag ? profileDetails?.email_flag : "---",
        name: profileDetails.first_name + " " + profileDetails.last_name,
        package_name: profileDetails?.service_plan?.package_name,
        street: profileDetails.address ? profileDetails.address.street : "--",
        hno: profileDetails.address ? profileDetails.address.house_no : "--",
        landmark: profileDetails.address
          ? profileDetails.address.landmark
          : "--",
        city: profileDetails.address ? profileDetails.address.city : "--",
        pincode: profileDetails.address ? profileDetails.address.pincode : "--",
        district: profileDetails.address
          ? profileDetails.address.district
          : "--",
        state: profileDetails.address ? profileDetails.address.state : "--",
        country: profileDetails.address ? profileDetails.address.country : "--",
        // installation
        hno1: profileDetails?.permanent_address ? profileDetails?.permanent_address?.house_no : "--",
        street1: profileDetails.permanent_address ? profileDetails.permanent_address.street : "--",
        city1: profileDetails.permanent_address ? profileDetails.permanent_address.city : "--",
        district1: profileDetails.permanent_address ? profileDetails.permanent_address.district : "--",
        state1: profileDetails.permanent_address ? profileDetails.permanent_address.state : "--",
        pincode1: profileDetails.permanent_address ? profileDetails.permanent_address.pincode : "--",
        country1: profileDetails.permanent_address ? profileDetails.permanent_address.country : "--",

        id: profileDetails.id,
        installation_charges: profileDetails.user_advance_info
          ? profileDetails.user_advance_info.installation_charges
          : "--",
        security_deposit: profileDetails.user_advance_info
          ? profileDetails.user_advance_info.security_deposit
          : "--",
        GSTIN: profileDetails.user_advance_info
          ? profileDetails.user_advance_info.GSTIN
          : "--",
        expiry_date: moment(profileDetails.expiry_date).format(
          "DD MMM YYYY, h:mm a"
        )
          ? moment(profileDetails.expiry_date).format("DD MMM YYYY, h:mm a")
          : "--",
        hold_at: profileDetails.hold_at
          ? moment(profileDetails.hold_at).format("DD MMM YYYY, h:mm a")
          : "--",
        monthly_date: moment(profileDetails.monthly_date).format("DD MMM YYYY")
          ? moment(profileDetails.monthly_date).format("DD MMM YYYY")
          : "--",
        last_logoff: moment(profileDetails.last_logoff).format("DD MMM YYYY")
          ? moment(profileDetails.last_logoff).format("DD MMM YYYY, h:mm a")
          : "--",
        online_since: moment(profileDetails.online_since).format("DD MMM YYYY, h:mm a")
          ? moment(profileDetails.online_since).format("DD MMM YYYY, h:mm a")
          : "--",
        plan_updated: moment(profileDetails.plan_updated).format("DD MMM YYYY")
          ? moment(profileDetails.plan_updated).format("DD MMM YYYY")
          : "--",
        packets: (profileDetails?.packets)?.toFixed(2) ? (profileDetails?.packets)?.toFixed(2) + "GB" : "---",
        static_ip_bind: profileDetails.radius_info
          ? profileDetails &&
          profileDetails.radius_info &&
          profileDetails.radius_info.static_ip_bind
          : "---",
        option_82: profileDetails.radius_info
          ? profileDetails &&
          profileDetails.radius_info &&
          profileDetails.radius_info.option_82
          : "---",
        static_ip_total_cost: profileDetails.radius_info
          ? profileDetails &&
          profileDetails.radius_info &&
          profileDetails.radius_info.static_ip_total_cost
          : "---",
        acctstoptime:
          profileDetails.acctstoptime === null ? (
            <>
              <img src={KYCCIRCLE} />
              &nbsp; &nbsp;
              <p className="curr_status">Online</p>
            </>
          ) : // <Chip color="success" size="small" label="Online" />
            profileDetails.acctstoptime != "NYL" ? (
              <>
                <img src={EXPCIRCLE} />
                &nbsp; &nbsp;
                <p className="curr_status">Offline</p>
              </>
            ) : (
              // <Chip color="error" size="small" label="Offline" />
              <Chip color="info" size="small" label="Not yet Logged" />
            ),
        account_status:
          profileDetails.account_status === "KYC" ? (
            <>
              <img src={KYCCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Kyc confirmed</p>
            </>
          ) : profileDetails.account_status === "EXP" ? (
            <>
              <img src={EXPCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Expired</p>
            </>
          ) : profileDetails.account_status === "ACT" ? (
            <>
              <img src={ACTCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Active</p>
            </>
          ) : profileDetails.account_status === "DCT" ? (
            <>
              <img src={DCTCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Deactive</p>
            </>
          ) : profileDetails.account_status === "SPD" ? (
            <>
              <img src={SPDCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Suspended</p>
            </>
          ) : profileDetails.account_status === "HLD" ? (
            <>
              <img src={HLDCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Hold</p>
            </>
          ) : profileDetails.account_status === "INS" ? (
            <>
              <img src={INSCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Installation</p>
            </>
          ) : profileDetails.account_status === "PROV" ? (
            <>
              <img src={PROVCIRCLE} />
              &nbsp; &nbsp;
              <p className="acc_status">Provisioning</p>
            </>
          ) : (
            ""
          ),
      };
    }
    return null;
  }, [profileDetails]);





  // login and logout

  // const disconnectCustomer = () => {
  //   customeraxios
  //     .get(`customers/switch_access/${profileDetails.user}`)
  //     .then((res) => {
  //       console.log(res.data.cuurent_status,"res.data.cuurent_status")
  //       setDisconnectModal(false);
  //       toast.success(res.data.detail, {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1000,
  //       });
  //       setProfileDetails((preState) => {
  //         return {
  //           ...preState,
  //           // account_status: "Deactive",
  //           restrict_access:res.data && res.data.cuurent_status[0] === "Login" ? true: false

  //         };
  //       });
  //     })
  //     .catch(function (error) {
  //       const errorString = JSON.stringify(error);
  //       const is500Error = errorString.includes("500");
  //       const is404Error = errorString.includes("404");
  //       if (error.response && error.response.data.detail) {
  //         toast.error(error.response && error.response.data.detail, {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //       } else if (is500Error) {
  //         toast.error("Something went wrong", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //       } else if (is404Error) {
  //         toast.error("API mismatch", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //       } else {
  //         toast.error("Something went wrong", {
  //           position: toast.POSITION.TOP_RIGHT,
  //           autoClose: 1000,
  //         });
  //       }
  //     })
  //     .finally(function () {
  //       refresh();
  //     });
  // };


  const disconnectCustomer = () => {
    setDisable(true)
    adminaxios
      .post(`accounts/customer/${profileDetails.user?.username}/deactivate`)
      .then((res) => {
        setDisable(false)
        setDisconnectModal(false);
        // toast.success(res.data.detail, {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000,
        // });
        setModalMessage(res.data.detail);
        setShowModal(true);
        setProfileDetails((preState) => {
          return {
            ...preState,
            account_status: "DCT",
          };
        });
      })
      .catch(function (error) {
        setDisable(false)
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          // toast.error(error.response && error.response.data.detail, {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setModalMessage(error.response && error.response.data.detail);
          setShowModal(true);
        } else if (is500Error) {
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setModalMessage("Something went wrong");
          setShowModal(true);
        } else if (is404Error) {
          // toast.error("API mismatch", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setModalMessage("API mismatch");
          setShowModal(true);
        } else {
          // toast.error("Something went wrong", {
          //   position: toast.POSITION.TOP_RIGHT,
          //   autoClose: 1000,
          // });
          setModalMessage("Something went wrong");
          setShowModal(true);
        }
      })
      .finally(function () {
        refresh();
      });
  };

  // renew / change plan
  const handleChangePlan = () => {
    const { service_plan, area_id } = JSON.parse(
      sessionStorage.getItem("customerInfDetails")
    );
    const service_plan_id = service_plan;
    const area = area_id;
    changePlanClickHandler(service_plan_id, id, area_id);
  };


  // side panel cusotmer details open
  const userIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsCustomerDetailsOpen(true);
  };
  const isOpen = isCustomerDetailsOpen ? " open" : "";
  // closecustomizer

  const closeCustomizer = () => {
    setIsCustomerDetailsOpen(false);
  };

  const handleClose = useCallback(() => {
    setActiveTab(null);
    closeCustomizer();
  }, [closeCustomizer]);

  // details update
  const detailsUpdate = (data) => {
    closeCustomizer();
    // profileDetails(data);
  };


  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={1} sx={{ mb: "10px" }}>
        <Grid item md="6">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
              Customer Relations
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color=" #377DF6"
              fontSize="14px"
            >
              <Link
                to={{
                  pathname: `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/${process.env.REACT_APP_API_URL_Layout_Name}`,
                }}
              >
                All Customers
              </Link>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                alignItems: "center",
                color: "#00000 !important",
              }}
              fontSize="14px"
            >
              <span style={{ color: "black !important" }}>
                {" "}

                {profileDetails?.user?.username}

              </span>
            </Typography>
          </Breadcrumbs>
        </Grid>
        <Grid item md="6">
        </Grid>
      </Grid>
      <br />
      {profileDetails && (
        <ProfileDetails
          profileDetails={profileDetails}
          userDetails={userDetails}
          sessionInfo={expiryDate}
          userDetailsKeys={userDetailsKeys}
          userDetailsStatusKeys={userDetailsStatusKeys}
          userDetailsAddressKeys={userDetailsAddressKeys}
          userDetailsdatakeys={userDetailsdatakeys}
          userDetailsKeys2={userDetailsKeys2}
          userDetailsCharges={userDetailsCharges}
          disconnectMOdalopen={disconnectMOdalopen}
          handleChangePlan={handleChangePlan}
          setUpdateInfoCount={setUpdateInfoCount}
          setProfileDetails={setProfileDetails}
          expiryDate={expiryDate}
          userIdClickHandler={userIdClickHandler}
          row={row}
          username={username}
          fetchComplaints={fetchComplaints}
          rxTxKeys={rxTxKeys}
          rxTxData={rxTx}
          deviceInfoKeys={deviceInfoKeys}
          deviceInfoData={deviceInfoData}
          fetchCPE={fetchCPE}
          networkInfoKeys={networkInfoKeys}

        />
      )}

      {/* customer info */}
      <div className={`customizer-contain${isOpen}`}>
        <div className="tab-content" id="c-pills-tabContent">
          <div className="customizer-header">
            <br />
            <i className="icon-close" onClick={handleClose}></i>
            <br />
          </div>
          <div className="customizer-body custom-scrollbar">
            {selectedRow && isCustomerDetailsOpen && (
              <>
                <div id="headerheading">
                  Customer Information : {profileDetails.user?.username}
                </div>
                <CustomerDetailss
                  lead={profileDetails}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  closeCustomizer={closeCustomizer}
                  onUpdate={(data) => detailsUpdate(data)}
                  detailsUpdate={detailsUpdate}
                  setProfileDetails={setProfileDetails}
                  fetchComplaints={fetchComplaints}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Grid container spacing={1}>
        <Grid item md="12" className="loadercenter">
          {profileDetails ? '' : <Spinner size="lg"> </Spinner>}
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item md="12">
          {loadingInfo &&
            <Complaints username={username} profileDetails={profileDetails} fetchComplaints={fetchComplaints} />}
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ marginTop: "35px" }}>
        <Grid item md="12">
          {loadingInfo &&
            <LatestInvoice
              username={username}
              profileDetails={profileDetails}fetchComplaints={fetchComplaints}
            />}
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ marginTop: "35px" }}>
        <Grid item md="12">
          {loadingInfo &&
            <Recipts
              username={username}
              profileDetails={profileDetails}fetchComplaints={fetchComplaints}
            />
            }
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ marginTop: "35px" }}>
        <Grid item md="12">
          {loadingInfo &&
            <PlanDetails profileDetails={profileDetails} />
          }
        </Grid>
      </Grid>
      <Grid container spacing={1} sx={{ marginTop: "35px" }}>
        <Grid item md="12">

          {loadingInfo && <WalletInfo user={id} profileDetails={profileDetails} fetchComplaints={fetchComplaints} />}
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={2}
        sx={{ marginTop: "35px" }}
      >
        {/*  */}
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          {loadingInfo &&
            <OnlineSessionInfo
              user={id}
              username={username}
              updateInfoCount={updateInfoCount}
              setExpiryDate={setExpDate}
              profileDetails={profileDetails}
            />}
        </Grid>

        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>

          {loadingInfo && <InstallationAddress userDetails={userDetails} profileDetails={profileDetails} installationAddress={installationAddress} />
          }
        </Grid>
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          {loadingInfo &&
            <DocumentsInfo
              user={id}
              DocprofileDetails={profileDetails}
            />}
        </Grid>
      </Grid>
      <Grid
        container
        rowSpacing={1}
        columnSpacing={2}
        sx={{ marginTop: "35px" }}
      >
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          {loadingInfo && <CPEInfo userDetails={userDetails} profileDetails={profileDetails} id={id} username={username} />}
        </Grid>
        
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>
          {loadingInfo && <RadiusInfo userDetails={userDetails} profileDetails={profileDetails} />}
        </Grid>
        <Grid item md="4" style={{ flex: "0 0 33.333%", display: "flex" }}>

        </Grid>
      </Grid>
      {/* disconnect modal */}
      <Modal isOpen={disconnectModal} toggle={disconnectMOdalopen} centered>
        <ModalBody>
          <p className="modal_text">
            {"Are you sure you want to Disconnect ?"}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="" onClick={disconnectCustomer} id="yes_button" disabled={disable}>
            {disable ? <Spinner size="sm"> </Spinner> : null}
            {"Yes"}
          </Button>
          <Button color="secondary" onClick={disconnectMOdalopen} id="resetid">
            {"Cancel"}
          </Button>
        </ModalFooter>
      </Modal>
      <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
    </Box>
  );
};

export default CustomerDetails;

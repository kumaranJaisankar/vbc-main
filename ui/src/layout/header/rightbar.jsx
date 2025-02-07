import React, { Fragment, useState, useEffect, useRef } from "react";
import man from "../../assets/images/person_logo_icon.svg";
import { LogIn, User, Bell } from "react-feather";
import { useHistory } from "react-router-dom";
import { logout_From_Firebase, logout_From_Auth0 } from "../../utils/index";
import { useAuth0 } from "@auth0/auth0-react";
import { adminaxios, franchiseaxios, franchiseaxiosSwitch } from "../../axios";
import Userdetails from "../../../src/components/application/administration/adminuser/userdetails";
import { toast } from "react-toastify";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import OtherFracnhiseModal from "./OtherFranchises";

import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";

import Blink from "react-blink-text";
// import Bookmark from "../../layout/bookmark"
import {
  setTranslations,
  setDefaultLanguage,
  setLanguageCookie,
  setLanguage,
  translate,
} from "react-switch-lang";
import { TabContent, TabPane } from "reactstrap";
import { Notification, Account, LogOut } from "../../constant";

import en from "../../assets/i18n/en.json";
import es from "../../assets/i18n/es.json";
import pt from "../../assets/i18n/pt.json";
import fr from "../../assets/i18n/fr.json";
import du from "../../assets/i18n/du.json";
import cn from "../../assets/i18n/cn.json";
import ae from "../../assets/i18n/ae.json";
import FranchiseDetailsTable from "./franchisedetailstabel";
import { classes } from "../../data/layouts";
// Sailaja imported common component Sorting on 10th April 2023
import { Sorting } from "../../components/common/Sorting";

var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

setTranslations({ en, es, pt, fr, du, cn, ae });
setDefaultLanguage("en");
setLanguageCookie();

const tokenInfo = JSON.parse(localStorage.getItem("token"));
//code for hiding switch for other login except for admin
let hideswitch = false;
if (tokenInfo && tokenInfo.user_type === "Admin") {
  hideswitch = true;
}
//end
//code for hiding wallet icon based on user login
let hidewalleticon = false;
if (
  (tokenInfo && tokenInfo.user_type === "Franchise Owner") ||
  (tokenInfo && tokenInfo.user_type === "Branch Owner")
) {
  hidewalleticon = true;
}
//end
const Rightbar = (props) => {
  const [activeTab1, setActiveTab1] = useState("1");
  const history = useHistory();
  const [profile, setProfile] = useState("");
  const [name, setName] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [searchresponsive, setSearchresponsive] = useState(false);
  const [langdropdown, setLangdropdown] = useState(false);
  const [moonlight, setMoonlight] = useState(false);
  const [selected, setSelected] = useState("en");
  const [notificationDropDown, setNotificationDropDown] = useState(false);
  const [adminuser, setAdminuser] = useState();
  // auth0 profile
  const { logout } = useAuth0();
  const authenticated = JSON.parse(localStorage.getItem("authenticated"));
  const auth0_profile = JSON.parse(localStorage.getItem("auth0_profile"));
  //modal state
  const [Verticalcenter, setVerticalcenter] = useState(
    localStorage.getItem("popup") !== true ? false : true
  );
  const [franchiseSwitch, setFranchiseSwutch] = useState(false);
  const [serviceplanobj, setServiceplanobj] = useState([]);
  const [franchsieList, setFracnhiseList] = useState([]);
  const [franchiseData, setFranchiseData] = useState([]);
  const [alldata, setAlldata] = useState([]);
  const [loginAdmin, setLoginAdmin] = useState(false);
  // branch filter
  const [branchList, setbranchList] = useState([]);
  const [formData, setFormData] = useState([]);
  const renderAfterCalled = useRef(false);
  const [loaderSpinneer, setLoaderSpinner] = useState(false);

  // login admin
  const loginAdminModal = () => {
    setLoginAdmin(!loginAdmin);
  };
  //
  // data update
  const [data, setData] = useState([]);

  // const [walletamount, setWalletamount] = useState({});

  const [walletamounts, setWalletamounts] = useState();

  const handleSetLanguage = (key) => {
    setLanguage(key);
    setSelected(key);
  };

  useEffect(() => {
    setProfile(localStorage.getItem("profileURL") || man);
    setName(localStorage.getItem("Name"));
    if (localStorage.getItem("layout_version") === "dark-only") {
      setMoonlight(true);
    }
    const userDetails = JSON.parse(localStorage.getItem("token"));
    if (userDetails) setUserInfo({ ...userDetails });
  }, []);

  useEffect(() => {
    adminaxios.get(`wallet/amount`).then((response) => {
      setWalletamounts(response.data.wallet_amount);
      localStorage.setItem(
        "wallet_amount",
        JSON.stringify(response.data.wallet_amount)
      );
    });
  }, []);

  const Logout_From_Firebase = () => {
    // localStorage.removeItem('profileURL')
    // localStorage.removeItem('token');
    // firebase_app.auth().signOut()
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  const Logout_From_Auth0 = () => {
    // localStorage.removeItem("auth0_profile")
    // localStorage.setItem("authenticated",false)
    logout_From_Auth0();
    history.push(`${process.env.PUBLIC_URL}/login`);
    logout();
  };

  const RedirectToChats = () => {
    history.push(`${process.env.PUBLIC_URL}/app/chat-app`);
  };

  const RedirectToCart = () => {
    history.push(`${process.env.PUBLIC_URL}/app/ecommerce/cart`);
  };

  const UserMenuRedirect = (redirect) => {
    history.push(redirect);
  };

  //full screen function
  function goFull() {
    if (
      (document.fullScreenElement && document.fullScreenElement !== null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  const SeacrhResposive = (searchresponsive) => {
    if (searchresponsive) {
      setSearchresponsive(!searchresponsive);
      document.querySelector(".search-full").classList.add("open");
      document.querySelector(".more_lang").classList.remove("active");
    } else {
      setSearchresponsive(!searchresponsive);
      document.querySelector(".search-full").classList.remove("open");
    }
  };

  const LanguageSelection = (language) => {
    if (language) {
      setLangdropdown(!language);
    } else {
      setLangdropdown(!language);
    }
  };

  const MoonlightToggle = (light) => {
    if (light) {
      setMoonlight(!light);
      document.body.className = "light";
      localStorage.setItem("layout_version", "light");
    } else {
      setMoonlight(!light);
      document.body.className = "dark-only";
      localStorage.setItem("layout_version", "dark-only");
    }
  };

  const logoutfunction = async () => {
    await adminaxios
      .delete(`/accounts/logout`)
      .then((res) => {
        console.log(res);
      })
      .catch(function (error) {
        history.replace(`${process.env.PUBLIC_URL}/login`);
      });

    localStorage.removeItem("profileURL");
    localStorage.removeItem("token");
    localStorage.removeItem("backup");
    localStorage.removeItem("Dashboard");
    localStorage.removeItem("DashboardData");
    localStorage.removeItem("PaymentData");
    localStorage.removeItem("CustomerActiveCard");
    localStorage.removeItem("LeadData");
    localStorage.removeItem("NetworkData");
    localStorage.removeItem("customerInfDetails");
    localStorage.removeItem("HeaderData");
    localStorage.removeItem("NewCustomerData");

    history.replace(`${process.env.PUBLIC_URL}/login`);
  };

  // useEffect(() => {

  // }, []);

  const closeCustomizer = () => {
    // setRightSidebar(!rightSidebar);
    document
      .querySelector(".customizer-contain-adminuser")
      .classList.remove("open");
  };
  const openCustomizer = (type, username) => {
    if (username) {
      setAdminuser(username);
    }
    setActiveTab1(type);
    // if (rightSidebar) {
    document
      .querySelector(".customizer-contain-adminuser")
      .classList.add("open");

    // document.querySelector(".customizer-links").classList.add('open');
    // }
    adminaxios
      .get(
        `accounts/user/${
          JSON.parse(localStorage.getItem("token")) &&
          JSON.parse(localStorage.getItem("token")).username
        }`
      )
      .then((res) => {
        setAdminuser(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const Verticalcentermodaltoggle = () => {
    // e.preventDefault();
    setVerticalcenter(!Verticalcenter);
    franchiseaxios.get(`franchise/display`).then((res) => {
      setServiceplanobj(res.data);
      setAlldata(res.data);
    });
  };

  // admin franchise showing list
  const datasubmit = (e) => {
    franchiseaxios.get(`franchise/display?branch=${e}`).then((res) => {
      setServiceplanobj(res.data);
      setAlldata(res.data);
    });
    // .catch(function (error) {
    //   toast.error("Something went wrong", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000,
    //   });
    // });
  };

  // branch filters

  useEffect(() => {
    adminaxios
      .get("accounts/branch/list")
      .then((res) => {
        // setbranchList([...res.data]);
        // Sailaja Sorted the Switch Branch check boxes list of data(Switch to different Logins) as alphabetical order on 10th April 2023
        setbranchList(Sorting([...res.data], "name"));
      })
      .catch((err) => console.log(err));
  }, []);

  // otherfranchise

  const franchisedata1 = (e) => {
    franchiseaxiosSwitch.get(`franchise/display?branch=${e}`).then((res) => {
      setFracnhiseList(res.data);
      setFranchiseData(res.data);
      //loginbackasadmin()
    });
    // .catch(function (error) {
    //   toast.error("Something went wrong", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000,
    //   });
    // });
  };

  // franchise switch
  const franchiseSwitchModal = () => {
    if (!renderAfterCalled) {
      franchisedata1();
    }
    setFranchiseSwutch(!franchiseSwitch);

    franchiseaxiosSwitch.get(`franchise/display`).then((res) => {
      setFracnhiseList(res.data);
      setFranchiseData(res.data);
    });
  };

  //button onclick for back to admin if franchise owner logs in
  const loginbackasadmin = () => {
    var tokenbackup = localStorage.getItem("backup");
    console.log("tokenbackup", tokenbackup);
    setLoaderSpinner(true);
    localStorage.setItem("token", tokenbackup);
    localStorage.removeItem("backup");
    localStorage.setItem("popup", true);
    localStorage.removeItem("Dashboard");
    localStorage.removeItem("DashboardData");
    localStorage.removeItem("CustomerActiveCard");
    localStorage.removeItem("NewCustomerData");
    localStorage.removeItem("HeaderData");
    localStorage.removeItem("PaymentData");
    localStorage.removeItem("LeadData");
    localStorage.removeItem("NetworkData");
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === "compact-wrapper"
    );
    const layout =
      localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();

    window.location.href = `${process.env.PUBLIC_URL}/app/dashboard/${layout}`;

    toast.success("Logging in as admin", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  };

  //end

  useEffect(() => {
    if (localStorage.getItem("popup")) {
      // Verticalcentermodaltoggle()
      // datasubmit();
    }
    setWalletamounts(localStorage.getItem("wallet_amount") || null);
    window.addEventListener("storage", storageEventHandler, false);
  }, []);

  function storageEventHandler() {
    setWalletamounts(localStorage.getItem("wallet_amount") || null);
  }

  function testFunc() {
    storageEventHandler();
  }
  // details update
  const detailsUpdate = (updatedata) => {
    setData((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer();
  };

  return (
    <Fragment>
      <button
        style={{ display: "none" }}
        onClick={() => testFunc()}
        id="hiddenBtn"
      >
        Hidden Button
      </button>
      <div className="nav-right col-8 pull-right right-header p-0">
        <ul className="nav-menus" style={{ width: "100%" }}>
          <li className="profile-nav onhover-dropdown p-0 ">
            <div className="media profile-media ">
              <img
                className="b-r-10"
                src={man}
                alt=""
                style={{ border: "1px solid gainsboro" }}
              />
              <div className="media-body">
                <span>{userInfo ? userInfo.username : name}</span>

                <p className="mb-0 font-roboto">
                  {userInfo ? userInfo.user_type : "admin"}{" "}
                  <i className="middle fa fa-angle-down"></i>
                </p>
              </div>
            </div>
            <ul className="profile-dropdown onhover-show-div">
              <li onClick={() => openCustomizer("1")}>
                <User />
                <span>{Account}</span>
              </li>
              {localStorage.getItem("backup") ? (
                <li onClick={loginAdminModal}>
                  <LogIn />
                  <span>{LogOut}</span>
                </li>
              ) : (
                <li onClick={logoutfunction}>
                  <LogIn />
                  <span>{LogOut}</span>
                </li>
              )}
            </ul>
          </li>
        </ul>
      </div>
      {/* <div className="customizer-contain-adminuser">
        <div className="tab-content" id="c-pills-tabContent">
          <div
            className="customizer-header"
            style={{ padding: "0px", border: "none" }}
          >
            <br />
            <i className="icon-close" onClick={closeCustomizer}></i>
            <br />
          </div>
          <div className=" customizer-body custom-scrollbar">
            <TabContent activeTab={activeTab1}>
              <TabPane tabId="1">
                <div id="headerheading">
                  {" "}
                  User Information:{" "}
                  {JSON.parse(localStorage.getItem("token")) &&
                    JSON.parse(localStorage.getItem("token")).username}
                </div>
                <Userdetails
                  lead={adminuser}
                  onUpdate={(data) => detailsUpdate(data)}
                  dataClose={closeCustomizer}
                />
              </TabPane>
            </TabContent>
          </div>
        </div>
      </div> */}

      {/* <Modal
        isOpen={Verticalcenter}
        toggle={Verticalcentermodaltoggle}
        centered
        size="lg"
        className="switch-modal"
        backdrop="static"
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <FranchiseDetailsTable
            tabledata={serviceplanobj}
            Verticalcentermodaltoggle={Verticalcentermodaltoggle}
            setAlldata={setAlldata}
            alldata={alldata}
            setServiceplanobj={setServiceplanobj}
            // loginbackasadmin={loginbackasadmin}
            branchList={branchList}
            datasubmit={datasubmit}
            setFormData={setFormData}
            setbranchList={setbranchList}
            loaderSpinneer={loaderSpinneer}
            setLoaderSpinner={setLoaderSpinner}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color=""
            onClick={() => {
              Verticalcentermodaltoggle();
              localStorage.removeItem("popup");
            }}
            id="resetid"
          >
            Close
          </Button>
        </ModalFooter>
      </Modal> */}

      {/* other fracnhises */}
      {/* <Modal
        isOpen={franchiseSwitch}
        toggle={franchiseSwitchModal}
        centered
        size="lg"
        className="switch-modal"
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <OtherFracnhiseModal
            tabledata={serviceplanobj}
            franchiseSwitchModal={franchiseSwitchModal}
            setAlldata={setFranchiseData}
            alldata={franchiseData}
            setServiceplanobj={setFracnhiseList}
            loginbackasadmin={loginbackasadmin}
            branchList={branchList}
            franchisedata1={franchisedata1}
            setFormData={setFormData}
            loaderSpinneer={loaderSpinneer}
            setLoaderSpinner={setLoaderSpinner}
          />
         
        </ModalBody>
        <ModalFooter>
          <Button color="" onClick={franchiseSwitchModal} id="resetid">
            Close
          </Button>
        </ModalFooter>
      </Modal> */}

      {/* admin modal */}

      {/* <Modal
        isOpen={loginAdmin}
        toggle={loginAdminModal}
        centered
        className="switch-modal"
      >
        <ModalBody style={{ maxHeight: "400px", overflow: "auto" }}>
          <p style={{ textAlign: "center" }}>Please switch to Admin</p>
        </ModalBody>
        <ModalFooter>
          <Button color="" onClick={loginAdminModal} id="resetid">
            Close
          </Button>
        </ModalFooter>
      </Modal> */}
    </Fragment>
  );
};
export default translate(Rightbar);

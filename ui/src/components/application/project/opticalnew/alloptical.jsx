import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalFooter,
  TabContent,
  TabPane,
  ModalBody,
} from "reactstrap";
import { ModalTitle, CopyText, Cancel } from "../../../../constant";
import { networkaxios, adminaxios } from "../../../../axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import "rc-steps/assets/index.css";
import Steps from "rc-steps";
import { useSelector, useDispatch } from "react-redux";
import PublicIcon from "@mui/icons-material/Public";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";
import { classes } from "../../../../data/layouts";
import AddHardware from "./addhardware";
import NasTable from "./NasTable";
import OltTable from "./OltTable";
import CpeTable from "./cpeTable";
import { OpticalNetworkFilterContainer } from "./OpticalNetworkFilter/OpticalNetworkFilterContainer";
import DpTable from "./dpTable";
import PermissionModal from "../../../common/PermissionModal";
import DeleteModal from "./DeleteModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { logout_From_Firebase } from "../../../../utils";
import MUIButton from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import REFRESH from "../../../../assets/images/refresh.png";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import { useLocation } from "react-router-dom";
import OLtExport from "./Export/olt/oltExport";
import ParentDp from "./Export/dp/parentdp";
import NasExport from "../nas/nasExport";
import CPEExport from "./Export/cpe/cpeexport";
import { NETWORK } from "../../../../utils/permissions";
//added new component in network by Marieya
import NetworkFilters from "./networkFilters";
import {AllLocations, OLtAllLocations,PdpAllLocations,CdpAllLocations,CpeAllLocations} from "./locations/AllLocations"
var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}
// const token = JSON.parse(storageToken);
let ShowAreas = false;
if (
  (token && token.user_type === "Zonal Manager") ||
  (token && token.user_type === "Staff") ||
  (token && token.user_type === "Help Desk") ||
  (token && token.user_type === "Franchise Owner")
) {
  ShowAreas = true;
}

let DisplayAreas = false;
if (
  (token && token.user_type === "Admin") ||
  (token && token.user_type === "Super Admin") ||
  (token && token.user_type === "Branch Owner")
) {
  DisplayAreas = true;
}

const AllOptical = (initialValues) => {
  const location = useLocation();
  const [loaderSpinneer, setLoaderSpinner] = useState(false);
  const [detailsname, setDeatilsname] = useState("NAS");
  const [activeTab1, setActiveTab1] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [modal, setModal] = useState();
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [failed, setFailed] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [nasrefresh, setNasRefresh] = useState(0);
  const [dprefresh, setDpRefresh] = useState(0);
  const [cperefresh, setCpeRefresh] = useState(0);

  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  //filter show and hide menu
  const [levelMenu, setLevelMenu] = useState(false);
  //taking backup for original data
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  // const [rowlength, setRowvalue] = useState(0);
  const [rowlength, setRowlength] = useState({});
  //state for delete
  const [isDeleted, setisDeleted] = useState(false);
  //selected dp radio button
  const [selecteddpradiobutton, setSelecteddpradiobutton] =
    useState("parentdp");
  //delete
  const [rowdeleterecord, setRowdeleterecord] = useState({});
  // hidden state
  const [hide, setHide] = useState("nas");
  const [zone, setZone] = useState([]);
  const [oltexport, setOltExport] = useState([]);
  //modal state for insufficient permissions
  const [permissionmodal, setPermissionModal] = useState();
  const [networkState, setNetworkState] = useState(location?.state?.selectedTabolt?location?.state?.selectedTabolt:"nas");
  const [networkStateforolt, setNetworkStateforolt] = useState("olt");
  const [branchFilter, setBranchFilter] = useState();
  //state for filters for branch , franchise, zone and area
  const [branchid, setBranchId] = useState();
  const [franchiseid, setFranchsieId] = useState();
  const [zoneid, setZoneId] = useState();
  const [areaid, setAreaId] = useState();
  //state for olt serial number
  const [serialid, setSerialId] = useState();
  const [selectedDpRadioBtnDisplay, setSelectedDpRadioBtnDisplay] =
    useState("parentdp");
  const [inputs, setInputs] = useState(initialValues);

  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );


  const [selectedTab, setSelectedTab] = useState(
    location?.state?.selectedTabolt ||
      token.permissions.includes(NETWORK.NAS_LIST)
      ? "nas"
      : token.permissions.includes(NETWORK.NAS_LIST)
      ? "cpe"
      : token.permissions.includes(NETWORK.NAS_LIST)
      ? "dp"
      : "olt"
  );
  const initialDirty = { nas: false, olt: false, dp: false, cpe: false };
  const [isDirty, setIsDirty] = useState({ ...initialDirty });
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  const [accordionActiveKey, setAccordionActiveKey] = useState("-1");
  const [isExpand, setIsExpand] = useState(false);
  const [showStepperListFromAddHardware, setShowStepperListFromAddHardware] =
    useState([]);
  const [availableHardware, setAvailableHardware] = useState({});
  const [searchString, setSearchString] = useState("");
  const [serialNo, setSerialNo] = useState({});
  //map data states
  const [naslead, setNasLead] = useState([]);
  console.log(naslead, "naslead");
  const [showNasLocation, setShowNasLocation] = useState(false);
  //paginated state for nas
  const [openMap, setOpenMap] = useState(false);
// states by marieya for zonal manager 
const [getareas, setGetAreas] = useState([]);
const [getzoneareas, setGetZoneAreas] = useState([]);
const [zoneValue, setZoneValue] = useState([]);
const [queryParamsOlt, setQueryParamsOlt] = useState('');

  const OpenMap = () => {
    setOpenMap(true);
  };

  const [networkLists, updateNetworkLists] = useState(
    {
      uiState: { loading: false },
      currentPageNo: 1,
      currentItemsPerPage: 10,
      pageLoadData: [],
      pageLoadDataForFilter: [],
      prevURI: null,
      nextURI: null,
      // appliedFilters: { ...getAppliedFiltersObj() },
      // additionalFilters: { ...getAdditionalFiltersObj() },
      currentTab: "all",
      tabCounts: {},
      totalRows: "",
    },
    location?.state?.billingDateRange
  );
  //paginated state for olt
  const [oltLists, updateOltLists] = useState(
    {
      uiState: { loading: false },
      currentPageNo: 1,
      currentItemsPerPage: 10,
      pageLoadData: [],
      pageLoadDataForFilter: [],
      prevURI: null,
      nextURI: null,
      // appliedFilters: { ...getAppliedFiltersObj() },
      // additionalFilters: { ...getAdditionalFiltersObj() },
      currentTab: "all",
      tabCounts: {},
      totalRows: "",
    },
    location?.state?.billingDateRange
  );
  //paginated state for Cpe
  const [cpeLists, updateCpeLists] = useState(
    {
      uiState: { loading: false },
      currentPageNo: 1,
      currentItemsPerPage: 10,
      pageLoadData: [],
      pageLoadDataForFilter: [],
      prevURI: null,
      nextURI: null,
      // appliedFilters: { ...getAppliedFiltersObj() },
      // additionalFilters: { ...getAdditionalFiltersObj() },
      currentTab: "all",
      tabCounts: {},
      totalRows: "",
    },
    location?.state?.billingDateRange
  );
  //paginated state for DP
  const [dpLists, updateDpLists] = useState(
    {
      uiState: { loading: false },
      currentPageNo: 1,
      currentItemsPerPage: 10,
      pageLoadData: [],
      pageLoadDataForFilter: [],
      prevURI: null,
      nextURI: null,
      // appliedFilters: { ...getAppliedFiltersObj() },
      // additionalFilters: { ...getAdditionalFiltersObj() },
      currentTab: "all",
      tabCounts: {},
      totalRows: "",
    },
    location?.state?.billingDateRange
  );

  const getQueryParams = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage } = networkLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (searchString) {
      queryParams += `&serial_no=${searchString}`;
    }

    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }

    if (queryParams.startsWith("&")) {
      queryParams = queryParams.slice(1);
    }
    if (!isPageLimit && !queryParams.startsWith("&")) {
      queryParams = "&" + queryParams;
  }
    return queryParams;
  };
  const filterParamsnas = getQueryParams(false);

  //Dp query params
  const getQueryParamsDp = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage } = dpLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (searchString) {
      queryParams += `&serial_no=${searchString}`;
    }

    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }

    if (inputs && inputs.franchise === "ALL2") {
      queryParams += ``;
    } else if (inputs && inputs.franchise) {
      queryParams += `&franchise=${inputs.franchise}`;
    }

    // if (inputs && inputs.zone === "ALL3") {
    //   queryParams += ``;
    // } else if (inputs && inputs.zone) {
    //   queryParams += `&zone=${inputs.zone}`;
    // }

    if (ShowAreas && inputs.zone) {
      queryParams += `&zone=${zoneValue}`;
    }else if (inputs.zone !== "ALL3" && inputs.zone) {
        queryParams += `&zone=${inputs.zone}`;
      }
    if (inputs && inputs.area === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.area) {
      queryParams += `&area=${inputs.area}`;
    }
    if (!searchString && queryParams.startsWith("&")) {
      queryParams = queryParams.slice(1);
    }
    if (!isPageLimit && !queryParams.startsWith("&")) {
      queryParams = "&" + queryParams;
  }
    return queryParams;
  };
  const filterParamsdp = getQueryParamsDp(false);

  //cpe query params
  const getQueryParamsCpe = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage } = cpeLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (!isNaN(searchString) && searchString.trim() !== "") {
      queryParams += `&mobile_no=${searchString}`;
    } else if (searchString) {
      queryParams += `&username=${searchString}`;
    }

    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }

    if (inputs && inputs.franchise === "ALL2") {
      queryParams += ``;
    } else if (inputs && inputs.franchise) {
      queryParams += `&franchise=${inputs.franchise}`;
    }

    // if (inputs && inputs.zone === "ALL3") {
    //   queryParams += ``;
    // } else if (inputs && inputs.zone) {
    //   queryParams += `&zone=${inputs.zone}`;
    // }
    if (ShowAreas && inputs.zone) {
      queryParams += `&zone=${zoneValue}`;
    }else if (inputs.zone !== "ALL3" && inputs.zone) {
        queryParams += `&zone=${inputs.zone}`;
      }

    if (inputs && inputs.area === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.area) {
      queryParams += `&area=${inputs.area}`;
    }
    if (queryParams.startsWith("&")) {
      queryParams = queryParams.slice(1);
    }
    if (!isPageLimit && !queryParams.startsWith("&")) {
      queryParams = "&" + queryParams;
  }
    return queryParams;
  };
  const filterParamscpe = getQueryParamsCpe(false);

  // olt query params
  const getQueryParamsOlt = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage } = oltLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (searchString) {
      queryParams += `&serial_no=${searchString}`;
    }

    if (inputs) {
      const { branch, franchise, zone, area } = inputs;

      if (branch !== "ALL1" && branch) {
        queryParams += `&branch=${branch}`;
      }

      if (franchise !== "ALL2" && franchise) {
        queryParams += `&franchise=${franchise}`;
      }

      // if (zone !== "ALL3" && zone) {
      //   queryParams += `&zone=${zone}`;
      // }
       if (ShowAreas && zone) {
        queryParams += `&zone=${zoneValue}`;
      }else if (zone !== "ALL3" && zone) {
          queryParams += `&zone=${zone}`;
        }
      // if (inputs && inputs.zone === "ALL3") {
      //   queryParams += ``;
      // }  else if (ShowAreas && inputs && inputs.zone) {
      //   queryParams += `&zone=${zoneValue}`;
      // }else if (inputs && inputs.zone && sendZone) {
      //   queryParams += `&zone=${inputs.zone}`;
      // }

      if (area !== "ALL4" && area) {
        queryParams += `&area=${area}`;
      }
    }
    if (queryParams.startsWith("&")) {
      queryParams = queryParams.slice(1);
    }

    if (!isPageLimit && !queryParams.startsWith("&")) {
      queryParams = "&" + queryParams;
  }
    return queryParams;
  };
  const filterParams = getQueryParamsOlt(false);

  //nas query params
  const fetchNetworkLists = () => {
    setLoading(true);

    updateNetworkLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    networkaxios
      .get(`network/nas/enh/list?${queryParams}`)
      .then((response) => {
        setLoading(false);
        const { data } = response;
        const { counts, count, next, previous, page, results } = data;
        updateNetworkLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
      })

      .catch((error) => {
        toast.error("Something went wrong");
        setLoading(false);
        updateNetworkLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
        // const { code, detail } = error;
        // const errorString = JSON.stringify(error);
        // const is500Error = errorString.includes("500");
        // if (detail === "INSUFFICIENT_PERMISSIONS") {
        //   togglePermissionModal();
        // } else if (is500Error) {
        //   setPermissionModalText("Something went wrong !");
        //   togglePermissionModal();
        // } else if (
        //   code === "In-valid token. Please login again" ||
        //   detail === "In-valid token. Please login again"
        // ) {
        //   logout();
        // } else {
        //   toast.error(error.detail, {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // }
      })
      .finally(function () {
        updateNetworkLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

 

  const fetchOltNetworkLists = () => {
    setLoading(true);

    updateOltLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    var queryParamsOlt = getQueryParamsOlt();
    setQueryParamsOlt(queryParamsOlt)
    networkaxios
      .get(`network/olt/enh/list?${queryParamsOlt}`)
      .then((response) => {
        setLoading(false);
        const { data } = response;
        const { counts, count, next, previous, page, results } = data;
        updateOltLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
      })
      .catch((error) => {
        toast.error("Something went wrong");
        setLoading(false);
        updateOltLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
        // const { code, detail } = error;
        // const errorString = JSON.stringify(error);
        // const is500Error = errorString.includes("500");
        // if (detail === "INSUFFICIENT_PERMISSIONS") {
        //   togglePermissionModal();
        // } else if (is500Error) {
        //   setPermissionModalText("Something went wrong !");
        //   togglePermissionModal();
        // } else if (
        //   code === "In-valid token. Please login again" ||
        //   detail === "In-valid token. Please login again"
        // ) {
        //   logout();
        // } else {
        //   toast.error(error.detail, {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // }
      })
      .finally(function () {
        updateOltLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  //Cpe query params
  const fetchCpeNetworkLists = () => {
    setLoading(true);

    updateCpeLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParamsCpe();
    networkaxios
      .get(`network/cpe/enh/list?${queryParams}`)
      .then((response) => {
        setLoading(false);
        const { data } = response;
        const { counts, count, next, previous, page, results } = data;
        updateCpeLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
      })
      .catch((error) => {
        toast.error("Something went wrong");
        setLoading(false);
        updateCpeLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
        // const { code, detail } = error;
        // const errorString = JSON.stringify(error);
        // const is500Error = errorString.includes("500");
        // if (detail === "INSUFFICIENT_PERMISSIONS") {
        //   togglePermissionModal();
        // } else if (is500Error) {
        //   setPermissionModalText("Something went wrong !");
        //   togglePermissionModal();
        // } else if (
        //   code === "In-valid token. Please login again" ||
        //   detail === "In-valid token. Please login again"
        // ) {
        //   logout();
        // } else {
        //   toast.error(error.detail, {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // }
      })
      .finally(function () {
        updateCpeLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };
  console.log(filteredData, "filteredData");
  //Parent Dp and Child Dp
  const fetchDpNetworkLists = () => {
    setLoading(true);

    updateDpLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParamsDp();
    networkaxios
      .get(`network/${selectedDpRadioBtnDisplay}/enh/list?${queryParams}`)
      .then((response) => {
        setLoading(false);
        const { data } = response;
        const { counts, count, next, previous, page, results } = data;
        updateDpLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
      })
      .catch((error) => {
        toast.error("Something went wrong");
        setLoading(false);
        updateDpLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
        // const { code, detail } = error;
        // const errorString = JSON.stringify(error);
        // const is500Error = errorString.includes("500");
        // if (detail === "INSUFFICIENT_PERMISSIONS") {
        //   togglePermissionModal();
        // } else if (is500Error) {
        //   setPermissionModalText("Something went wrong !");
        //   togglePermissionModal();
        // } else if (
        //   code === "In-valid token. Please login again" ||
        //   detail === "In-valid token. Please login again"
        // ) {
        //   logout();
        // } else {
        //   toast.error(error.detail, {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        // }
      })
      .finally(function () {
        updateDpLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  //state for adding parent dp
  useEffect(() => {
    let showStepperListNew = [];
    if (!!availableHardware && availableHardware.available_hardware) {
      const available_hardwareKeys = Object.keys(
        availableHardware.available_hardware
      );
      let available_hardwareKeysFinal = [];

      if (available_hardwareKeys.includes("parentnas_info")) {
        available_hardwareKeysFinal.push("parentnas_info");
      } else if (available_hardwareKeys.includes("nas_info")) {
        available_hardwareKeysFinal.push("nas_info");
      }
      if (available_hardwareKeys.includes("parentolt_info")) {
        available_hardwareKeysFinal.push("parentolt_info");
      } else if (available_hardwareKeys.includes("olt_info")) {
        available_hardwareKeysFinal.push("olt_info");
      }
      if (available_hardwareKeys.includes("parentdp2_info")) {
        available_hardwareKeysFinal.push("parentdp2_info");
      }
      if (available_hardwareKeys.includes("parentdp1_info")) {
        available_hardwareKeysFinal.push("parentdp1_info");
      }
      if (available_hardwareKeys.includes("childdp_info")) {
        available_hardwareKeysFinal.push("childdp_info");
      }

      const availableHardwareObject = {
        ...availableHardware.available_hardware,
      };

      showStepperListNew = available_hardwareKeysFinal.map((hardware) => {
        return {
          title: availableHardwareObject[hardware].device_type,
          name: availableHardwareObject[hardware].name,
          total_ports: availableHardwareObject[hardware].total_ports,
          available_ports: availableHardwareObject[hardware].available_ports,
          zone: availableHardwareObject[hardware].zone,
          connection_port: availableHardwareObject[hardware].connection_port,
          branch: availableHardwareObject[hardware].branch,
        };
      });
    }
    setShowStepperListFromAddHardware(showStepperListNew);
  }, [availableHardware]);

  const Verticalcentermodaltoggle = () => {
    {
      {
        if (Verticalcenter == true) {
          setIsChecked([]);
          setClearSelection(true);
        }

        if (isChecked.length > 0) {
          setVerticalcenter(!Verticalcenter);
        } else {
          toast.error("Please select any record", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      }
    }
  };

  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    setLoading(true);
    if (networkState !== "nas") {
      const defaultLayoutObj = classes.find(
        (item) => Object.values(item).pop(1) === sidebar_type
      );
      const modifyURL =
        process.env.PUBLIC_URL +
        "/dashboard/default/" +
        Object.keys(defaultLayoutObj).pop();
      const id =
        window.location.pathname === "/"
          ? history.push(modifyURL)
          : window.location.pathname.split("/").pop();
      // fetch object by getting URL
      const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
      const layout = id ? layoutobj : defaultLayoutObj;
      DefaultLayout = defaultLayoutObj;
      handlePageLayputs(layout);
      let deleteUrl = networkState;
      if (networkState == "dp") {
        deleteUrl = selecteddpradiobutton;
      }
      const queryParams = getQueryParamsDp();
      networkaxios
        .get(`network/${deleteUrl}/enh/list?${queryParams}`)
        .then((res) => {
          setData(res.data);
          setFiltereddata(res.data);
          setLoading(false);
          setRefresh(0);
        })
        .catch((error) => {
          const { code, detail, status } = error;
          const errorString = JSON.stringify(error);
          const is500Error = errorString.includes("500");
          if (detail === "INSUFFICIENT_PERMISSIONS") {
            //calling the modal here
            permissiontoggle();
          } else if (is500Error) {
            setPermissionModalText("Something went wrong !");
            permissiontoggle();
          } else if (
            code === "In-valid token. Please login again" ||
            detail === "In-valid token. Please login again"
          ) {
            logout();
          } else {
            token.permissions.includes(NETWORK.NAS_LIST);
            toast.error("Something went wrong", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
          }
        });
    }
  }, [refresh, networkState]);

  // logout
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  useEffect(() => {
    if (networkState === "nas") {
      if (token.permissions.includes(NETWORK.NAS_LIST)) {
        // networkaxios.get("network/v2/nas/display")
        //   .then((res) => {
        //     setRowlength((prevState) => {
        //       return {
        //         ...prevState,
        //         ["nas"]: res.data.length,
        //       };
        //     });
        //   })
        //   .catch((error) => {
        //     const { code, detail, status } = error;
        //     const errorString = JSON.stringify(error);
        //     const is500Error = errorString.includes("500");
        //     if (detail === "INSUFFICIENT_PERMISSIONS") {
        //       permissiontoggle();
        //     } else if (is500Error) {
        //       setPermissionModalText("Something went wrong !");
        //       permissiontoggle();
        //     } else if (
        //       code === "In-valid token. Please login again" ||
        //       detail === "In-valid token. Please login again"
        //     ) {
        //       logout();
        //     } else {
        //       token.permissions.includes(NETWORK.NAS_LIST)
        //       toast.error("Something went wrong", {
        //         position: toast.POSITION.TOP_RIGHT,
        //         autoClose: 1000,
        //       });
        //     }
        //   });
        fetchNetworkLists();
      } else {
        // Do something if the token doesn't have the required permission, e.g., display an error message
      }
    } else if (networkState === "olt") {
      fetchOltNetworkLists();
      // networkaxios.get(`network/v2/olt/display`)
      //   .then((res) => {
      //     setRowlength((prevState) => {
      //       return {
      //         ...prevState,
      //         ["olt"]: res.data.length,
      //       };
      //     });
      //     networkState("olt")
      //   })
      //   .catch((error) => {
      //     const { code, detail, status } = error;
      //     const errorString = JSON.stringify(error);
      //     const is500Error = errorString.includes("500");
      //     if (detail === "INSUFFICIENT_PERMISSIONS") {
      //       permissiontoggle();
      //     } else if (is500Error) {
      //       setPermissionModalText("Something went wrong !");
      //       permissiontoggle();
      //     } else if (
      //       code === "In-valid token. Please login again" ||
      //       detail === "In-valid token. Please login again"
      //     ) {
      //       logout();
      //     } else {
      //       token.permissions.includes(NETWORK.NAS_LIST)
      //       toast.error("Something went wrong", {
      //         position: toast.POSITION.TOP_RIGHT,
      //         autoClose: 1000,
      //       });
      //     }
      //   });
    } else if (networkState === "dp") {
      // networkaxios.get(`network/v2/parentdp/display`)
      //   .then((res) => {
      //     setRowlength((prevState) => {
      //       return {
      //         ...prevState,
      //         ["dp"]: res.data.length,
      //       };
      //     });
      //   })
      //   .catch((error) => {
      //     const { code, detail, status } = error;
      //     const errorString = JSON.stringify(error);
      //     const is500Error = errorString.includes("500");
      //     if (detail === "INSUFFICIENT_PERMISSIONS") {
      //       permissiontoggle();
      //     } else if (is500Error) {
      //       setPermissionModalText("Something went wrong !");
      //       permissiontoggle();
      //     } else if (
      //       code === "In-valid token. Please login again" ||
      //       detail === "In-valid token. Please login again"
      //     ) {
      //       logout();
      //     } else {
      //       token.permissions.includes(NETWORK.NAS_LIST)
      //       toast.error("Something went wrong", {
      //         position: toast.POSITION.TOP_RIGHT,
      //         autoClose: 1000,
      //       });
      //     }
      // });
      fetchDpNetworkLists();
    } else if (networkState === "cpe") {
      fetchCpeNetworkLists();
      // networkaxios.get("network/v2/cpe/display")
      //   .then((res) => {
      //     setRowlength((prevState) => {
      //       return {
      //         ...prevState,
      //         ["cpe"]: res.data.length,
      //       };
      //     });
      //   })
      //   .catch((error) => {
      //     const { code, detail, status } = error;
      //     const errorString = JSON.stringify(error);
      //     const is500Error = errorString.includes("500");
      //     if (detail === "INSUFFICIENT_PERMISSIONS") {
      //       permissiontoggle();
      //     } else if (is500Error) {
      //       setPermissionModalText("Something went wrong !");
      //       permissiontoggle();
      //     } else if (
      //       code === "In-valid token. Please login again" ||
      //       detail === "In-valid token. Please login again"
      //     ) {
      //       logout();
      //     } else {
      //       token.permissions.includes(NETWORK.NAS_LIST)
      //       toast.error("Something went wrong", {
      //         position: toast.POSITION.TOP_RIGHT,
      //         autoClose: 1000,
      //       });
      //     }
      //   });
    }
  }, [
    networkLists.currentPageNo,
    networkLists.currentItemsPerPage,
    oltLists.currentPageNo,
    oltLists.currentItemsPerPage,
    cpeLists.currentPageNo,
    cpeLists.currentItemsPerPage,
    dpLists.currentPageNo,
    dpLists.currentItemsPerPage,
    // activeTab,
    // networkLists.appliedFilters, // Remove to handle all in FE
    // networkLists.additionalFilters, // Remove to handle all in FE
    refresh,
  ]);

  // filtering data by making a backup
  useEffect(() => {
    if (data) {
      setData(data);
      setFiltereddataBkp(data);
    }
  }, [data]);
  // end
  useEffect(() => {
    setExportData({
      ...exportData,
      data: oltexport,
    });
  }, [oltexport]);
  //update api
  const update = () => {
    setLoading(true);
    let deleteUrl = networkState;
    if (networkState == "dp") {
      deleteUrl = selecteddpradiobutton;
    }

    // networkaxios.get(`network/v2/${deleteUrl}/display`).then((res) => {
    //   setData(res.data);
    //   setFiltereddata(res.data);
    //   setLoading(false);
    //   setRefresh(0);
    // });
    closeCustomizer();
  };

  const toggle = () => {
    setModal(!modal);
  };
  const closeCustomizer = () => {
    let tab = Object.keys(isDirty).find((d) => isDirty[d] == true);
    if (tab) {
      setisDirtyModal(true);
    } else {
      setisDirtyModal(false);
      setRightSidebar(!rightSidebar);
      document
        .querySelector(".customizer-contain-alloptical")
        .classList.remove("open");
      setIsDirty(false);
      setAccordionActiveKey("-1");
    }
    setIsExpand(false);
  };
  const tabList = ["nas", "olt", "dp", "cpe"];
  const saveDataInDraftAndCloseModal = () => {
    let tab = Object.keys(isDirty).find((d) => isDirty[d] == true);

    localStorage.setItem(
      "network/" + tab,
      JSON.stringify(formDataForSaveInDraft)
    );
    localStorage.setItem("networkDraftSaveKey", "network/" + tab);

    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document
      .querySelector(".customizer-contain-alloptical")
      .classList.remove("open");
    setAccordionActiveKey("" + tabList.indexOf(tab));
    setIsDirty({ ...initialDirty });
  };

  const setIsDirtyFun = (tab) => {
    if (tabList.includes(tab)) {
      for (let i = 0; i < tabList.length; i++) {
        if (tabList[i] == tab) {
          setIsDirty({ ...initialDirty, [tab]: true });
        } else if (localStorage.getItem("network/" + tabList[i])) {
          localStorage.removeItem("network/" + tabList[i]);
        }
      }
    } else {
      setIsDirty({ ...initialDirty });
    }
  };

  const closeDirtyModal = () => {
    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document
      .querySelector(".customizer-contain-alloptical")
      .classList.remove("open");
    let tab = Object.keys(isDirty).find((d) => isDirty[d] == true);
    localStorage.removeItem("network/" + tab);
    localStorage.removeItem("networkDraftSaveKey");
    setAccordionActiveKey("-1");
    setIsDirty({ initialDirty });
    setLead({});
  };

  const openCustomizer = (type, id) => {
    if (id) {
      setLead(id);
      // setNasLead(id);
    }
    const getLocalDraftKey = localStorage.getItem("networkDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
      setAccordionActiveKey(
        "" + tabList.indexOf(getLocalDraftKey.split("/")[1])
      );
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    // if (rightSidebar) {
    document
      .querySelector(".customizer-contain-alloptical")
      .classList.add("open");
    // }
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  //refresh
  const Refreshhandler = () => {
    setRefresh(1);
    setDpRefresh(1);
    setCpeRefresh(1);
    setNasRefresh(1);
    if (searchInputField.current) {
      searchInputField.current.value = "";
    }
  };

  const searchInputField = useRef(null);

  //imports

  const columns = [
    {
      name: "ID",
      selector: "id",
      cell: (row) => (
        <a onClick={() => openCustomizer("3", row)} className="openmodal">
          N{row.id}
        </a>
      ),
      sortable: true,
    },
    {
      name: "Branch",
      selector: "branch",
      sortable: true,
    },

    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "IP Address",
      selector: "ip_address",
      sortable: true,
    },
    {
      name: "Secret",
      selector: "secret",
      sortable: true,
    },

    {
      name: "Accounting Time Interval",
      selector: "accounting_interval_time",
      sortable: true,
    },

    {
      name: "Created At",
      selector: "created_at",
      sortable: true,
    },
    {
      name: "Updated At",
      selector: "updated_at",
      sortable: true,
    },
  ];
  const [exportData, setExportData] = useState({
    columns: oltexport,
    exportHeaders: [],
  });
  //filter show and hide level menu
  const OnLevelMenu = (menu) => {
    setLevelMenu(!menu);
  };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");

    if (concernedElement && concernedElement.contains(event.target)) {
      setLevelMenu(true);
    } else {
      if (event.target.className !== "btn btn-primary nav-link") {
        if (event.target.className !== "icon-filter") {
          setLevelMenu(false);
        }
      }
    }
  });
  //  automatic display of table in optical network
  const handleTableDataFilter = (status, isCount = false) => {
    setSelectedTab(status);
    switch (status) {
      case "nas":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["nas"]: data.length,
            };
          });
        }
        break;

      case "olt":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["olt"]: data.length,
            };
          });
        }
        break;

      case "dp":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["dp"]: data.length,
            };
          });
        }

        break;
      case "cpe":
        if (isCount) {
          setRowlength((prevState) => {
            return {
              ...prevState,
              ["cpe"]: data.length,
            };
          });
        }
        break;
      default:
        setFiltereddata(data);
    }
  };

  //zones useeffect
  useEffect(() => {
    adminaxios
      .get("accounts/loggedin/zones")
      .then((res) => {
        setZone([...res.data]);
      })
      .catch(() => toast.error("error zone list "));
  }, []);

  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end
  //getting background color while selecting delete
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "##E4EDF7",
      },
    },
  ];

  // scroll top
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollIntoView(0, 0);
  }, []);

  //onside click hide sidebar
  const box = useRef(null);
  useOutsideAlerter(box);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      // Function for click event
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (!rightSidebar && !event.target.className.includes("openmodal")) {
            closeCustomizer();
          }
        }
      }

      // Adding click event listener
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  //end

  //search functionality
  const handlesearchChange = (event) => {
    event.preventDefault();
    // let value = event.target.value.toLowerCase();
    setSearchString(event.target.value);
  };

  useEffect(() => {
    setSearchString("");
  }, [networkState]);
  // only admin was showing
  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let networkDelete = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Super Admin") ||
    (tokenInfo && tokenInfo.user_type === "Admin")
  ) {
    networkDelete = true;
  }

  // css for breadcrumb by Marieya
  //added condition for line 717 filters for olt and dp table by Marieya

  const handleNasPerRowsChange = (newPerPage, page) => {
    updateNetworkLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleNasPageChange = (page) => {
    updateNetworkLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  // olt
  const handleOltPerRowsChange = (newPerPage, page) => {
    updateOltLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleOltPageChange = (page) => {
    updateOltLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };
  //dp
  const handleDpPerRowsChange = (newPerPage, page) => {
    updateDpLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleDpPageChange = (page) => {
    updateDpLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };
  //cpe
  const handleCpePerRowsChange = (newPerPage, page) => {
    updateCpeLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleCpePageChange = (page) => {
    updateCpeLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  // nasalllocations

  const [nasLocation, setLocation] = useState([]);
  const nasLocationsAPi = () => {
    networkaxios.get(`network/nas/gis/info`).then((res) => {
      setLocation(res.data.nas);
    });
  };
  console.log(nasLocation, "nasLocation");
  // oltlocations
  const [oltLocation, setOLTLocation] = useState([]);
  const oltLocationsAPI = () => {
    networkaxios.get(`network/olt/gis/info`).then((res) => {
      setOLTLocation(res.data.olt);
    });
  };
  // parentdp locations
  const [pdpLocations, setPDPLocations] = useState([]);
  const pdpLocationAPI = () => {
    networkaxios.get(`network/parentdp/gis/info`).then((res) => {
      setPDPLocations(res.data.parentdp);
    });
  };

  // child dp locations
  const [cdpLocations, setCdpLocations] = useState([]);
  const cdpLocationAPI = () => {
    networkaxios.get(`network/childdp/gis/info`).then((res) => {
      setCdpLocations(res?.data?.childdp);
    });
  };

  // cpe locations
  const [cpeLocations, setCPELocations] = useState([]);

  const cpeLocationAPI = () => {
    networkaxios.get(`network/cpes/gis/info`).then((res) => {
      setCPELocations(res.data.cpes);
    });
  };
  const getAreasforZNMR = () => {
    return (
      <>
        {ShowAreas
          ? adminaxios
            .get(`accounts/areahierarchy`)
            .then((res) => {
              setGetAreas(res.data);

              setGetZoneAreas(res.data.franchises.zones);
            })
            .catch((error) => {
              console.log(error);
            })
          : ""}
      </>
    );
  };
  useEffect(() => {
    getAreasforZNMR();
  }, []);
  return (
    <Fragment>
      <div ref={ref}>
        <br />

        <Container fluid={true}>
          <Grid container spacing={1} id="breadcrumb_margin">
            <Grid item md="12">
              <Breadcrumbs
                aria-label="breadcrumb"
                separator={
                  <NavigateNextIcon
                    fontSize="small"
                    className="navigate_icon"
                  />
                }
              >
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color=" #377DF6"
                  fontSize="14px"
                >
                  Business Operations
                </Typography>
                {/* Sailaja Changed  Network Color from Breadcrumbs  on 13th July */}

                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Network
                </Typography>
                <Typography
                  sx={{ display: "flex", alignItems: "center" }}
                  color="#00000 !important"
                  fontSize="14px"
                  className="last_typography"
                >
                  Optical Network
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <br />
          <br />
          <div className="edit-profile data_table" id="breadcrumb_table">
            <Stack direction="row" spacing={2}>
              <span className="all_cust"> Optical Network </span>

              <Stack direction="row" justifyContent="flex-end" sx={{ flex: 1 }}>
                {/* <Paper component="div" className="search_bar">
                  {" "}
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search With  Name"
                    inputProps={{ "aria-label": "search google maps" }}
                    onChange={(event) => handlesearchChange(event)}
                    value={searchString}
                  />
                  <IconButton
                    type="submit"
                    sx={{ p: "10px" }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </Paper> */}
                {/*Sailaja Added Refresh Tool Tip on 19th July Ref NET_10 */}
                {/* export */}
                {networkState == "nas" ? (
                  <>
                    <NasExport
                      filteredData={networkLists.pageLoadData}
                      openCustomizer={openCustomizer}
                      filterParamsnas={filterParamsnas}
                    />
                  </>
                ) : (
                  ""
                )}
                {networkState == "olt" ? (
                  <OLtExport filteredData={oltexport} queryParamsOlt={filterParams} />
                ) : (
                  ""
                )}
                {networkState == "dp" ? (
                  <ParentDp filteredData={dpLists?.pageLoadData}  selectedDpRadioBtnDisplay={selectedDpRadioBtnDisplay} filterParamsdp={filterParamsdp}/>
                ) : (
                  ""
                )}
                {networkState == "cpe" ? (
                  <CPEExport filteredData={cpeLists?.pageLoadData} filterParamscpe={filterParamscpe}/>
                ) : (
                  ""
                )}
                {/* refrsh */}
                <Tooltip title={"Refresh"}>
                  <MUIButton
                    onClick={() => Refreshhandler()}
                    variant="outlined"
                    className="muibuttons"
                  >
                    <img src={REFRESH} style={{ width: "20px" }} />
                  </MUIButton>
                </Tooltip>
                {networkDelete ? (
                  <>
                    {/* {networkState == "dp" ||
                    networkState == "cpe" ? ( */}
                      <MUIButton
                        onClick={Verticalcentermodaltoggle}
                        variant="outlined"
                        className="muibuttons"
                        startIcon={
                          <DeleteIcon
                            style={{ color: "#285295", fontSize: "25px" }}
                          />
                        }
                      ></MUIButton>
                    {/* // ) : (
                    //   ""
                    // )} */}
                  </>
                ) : (
                  ""
                )}
                {/*Sailaja Added Filter Tool Tip on 19th July Ref NET_10 */}
                {/* Filter */}
                {/* {networkState == "olt" || networkState == "dp" ? (
                  <Tooltip title={"Filter"}>
                    <MUIButton
                      onClick={() => OnLevelMenu(levelMenu)}
                      variant="outlined"
                      className="muibuttons"
                    >
                      <img src={FILTERS} style={{ width: "20px" }} />
                    </MUIButton>
                  </Tooltip>
                ) : (
                  ""
                )} */}
                <OpticalNetworkFilterContainer
                  levelMenu={levelMenu}
                  setLevelMenu={setLevelMenu}
                  filteredData={filteredData}
                  setFiltereddata={setFiltereddata}
                  filteredDataBkp={filteredDataBkp}
                  loading={loading}
                  setLoading={setLoading}
                  showTypeahead={false}
                  zone={zone}
                />
                {/* {networkState == "nas" &&
                  <button
                    className="btn btn-primary openmodal"
                    id="MapView_button"
                    type="submit"
                    onClick={() => {
                      openCustomizer("4");
                      nasLocationsAPi();
                    }}                    
                    // onClick={() => { openCustomizer("4"); nasLocationsAPi() }}
                  >
                    <span
                      className="openmodal"
                    >
                      Map View new&nbsp;&nbsp;
                    </span>
                    <PublicIcon />
                  </button>} */}
                {networkState == "nas" && (
                  <button
                    className="btn btn-primary openmodal"
                    id="MapView_button"
                    type="submit"
                    disabled={true}
                    onClick={() => {
                      openCustomizer("4");
                      nasLocationsAPi();
                      OpenMap();
                    }}
                  >
                    <span className="openmodal">Map View&nbsp;&nbsp;</span>
                    <PublicIcon />
                  </button>
                )}
                {networkState == "olt" && (
                  <button
                    className="btn btn-primary openmodal"
                    id="MapView_button"
                    type="submit"
                    disabled={true}
                    onClick={() => {
                      openCustomizer("5");
                      oltLocationsAPI();
                    }}
                  >
                    <span className="openmodal">Map View &nbsp;&nbsp;</span>
                    <PublicIcon />
                  </button>
                )}
                {networkState == "dp" &&
                  selectedDpRadioBtnDisplay !== "cpe" && (
                    <button
                      className="btn btn-primary openmodal"
                      id="MapView_button"
                      type="submit"
                      disabled={true}
                      onClick={() => {
                        openCustomizer("6");
                        pdpLocationAPI();
                      }}
                    >
                      <span className="openmodal">Map View &nbsp;&nbsp;</span>
                      <PublicIcon />
                    </button>
                  )}
                {/* {selectedDpRadioBtnDisplay == "childdp" &&
                  networkState !== "cpe" && (
                    <button
                      className="btn btn-primary openmodal"
                      id="MapView_button"
                      type="submit"
                      disabled={true}
                      onClick={() => {
                        openCustomizer("7");
                        cdpLocationAPI();
                      }}
                    >
                      <span className="openmodal">Map View &nbsp;&nbsp;</span>
                      <PublicIcon />
                    </button>
                  )} */}
                {networkState == "cpe" && (
                  <button
                    className="btn btn-primary openmodal"
                    id="MapView_button"
                    type="submit"
                    disabled={true}
                    onClick={() => {
                      openCustomizer("8");
                      cpeLocationAPI();
                    }}
                  >
                    <span className="openmodal">Map View &nbsp;&nbsp;</span>
                    <PublicIcon />
                  </button>
                )}
                &nbsp;&nbsp;
                <button
                  className="btn btn-primary openmodal"
                  id="newbuuon"
                  type="submit"
                  onClick={() => openCustomizer("2")}
                >
                  <span
                    className="openmodal"
                    style={{ fontSize: "16px", marginLeft: "-9px" }}
                  >
                    New &nbsp;&nbsp;
                  </span>
                  <i className="icofont icofont-plus openmodal"></i>
                </button>
              </Stack>
            </Stack>
            <br />
            <Row>
              <Col md="12">
                <NetworkFilters
                             zoneValue={zoneValue}
                             setZoneValue={setZoneValue}
                DisplayAreas={DisplayAreas}
                ShowAreas={ShowAreas}
                   getareas={getareas}
                   getzoneareas={getzoneareas}
                  setSearchString={setSearchString}
                  selectedTab={selectedTab}
                  handlesearchChange={handlesearchChange}
                  searchString={searchString}
                  setNetworkState={setNetworkState}
                  networkState={networkState}
                  networkStateforolt={networkStateforolt}
                  setNetworkStateforolt={setNetworkStateforolt}
                  setInputs={setInputs}
                  inputs={inputs}
                  setBranchFilter={setBranchFilter}
                  setBranchId={setBranchId}
                  branchid={branchid}
                  areaid={areaid}
                  setAreaId={setAreaId}
                  serialid={serialid}
                  setSerialId={setSerialId}
                  branchFilter={branchFilter}
                  franchiseid={franchiseid}
                  setFranchsieId={setFranchsieId}
                  zoneid={zoneid}
                  setZoneId={setZoneId}
                  hide={hide}
                  setHide={setHide}
                />
              </Col>
            </Row>
            <Row>
              <Col md="12" style={{ borderRadius: "10%" }}>

                <DeleteModal
                  serialNo={serialNo}
                  setSerialNo={setSerialNo}
                  Refreshhandler={Refreshhandler}
                  visible={Verticalcenter && isChecked.length > 0}
                  handleVisible={Verticalcentermodaltoggle}
                  isChecked={isChecked}
                  tokenAccess={tokenAccess}
                  setFiltereddata={setFiltereddata}
                  filteredData={filteredData}
                  setClearSelectedRows={setClearSelectedRows}
                  setIsChecked={setIsChecked}
                  setClearSelection={setClearSelection}
                  clearSelectedRows={clearSelectedRows}
                  clearSelection={clearSelection}
                  selectedTab={networkState}
                  setisDeleted={setisDeleted}
                  selecteddpradiobutton={selecteddpradiobutton}
                  setFailed={setFailed}
                />
              </Col>
              <Col md="12">
                {/* <OpticalBadge
                  handleTableDataFilter={handleTableDataFilter}
                  rowlength={rowlength}
                  selectedTab={selectedTab}
                  setSelectedtab={setSelectedTab}
                /> */}
              </Col>

              {/* Sailaja Changed Data Table position on 20th July  */}

              <Col
                md="12"
                className="alloptical-tables"
                style={{ position: "relative", marginTop: "2%" }}
              >
                <div
                  style={{
                    display: networkState == "nas" ? "block" : "none",
                  }}
                >
                  {token.permissions.includes(NETWORK.NAS_LIST) ? (
                    <>
                      {networkState == "nas" && (
                        <NasTable
                        serialNo={serialNo}
                        setSerialNo={setSerialNo}
                          showNasLocation={showNasLocation}
                          setShowNasLocation={setShowNasLocation}
                          naslead={naslead}
                          setNasLead={setNasLead}
                          handleNasPerRowsChange={handleNasPerRowsChange}
                          handleNasPageChange={handleNasPageChange}
                          networkLists={networkLists}
                          fetchNetworkLists={fetchNetworkLists}
                          selectedTab={selectedTab}
                          loaderSpinneer={loaderSpinneer}
                          setLoaderSpinner={setLoaderSpinner}
                          detailsname={detailsname}
                          setDeatilsname={setDeatilsname}
                          networkState={networkState}
                          nasrefresh={nasrefresh}
                          setRowlength={setRowlength}
                          rowlength={rowlength}
                          selectedTab={networkState}
                          setIsChecked={setIsChecked}
                          Refreshhandler={Refreshhandler}
                          isDeleted={isDeleted}
                          data={filteredData}
                          setRowdeleterecord={setRowdeleterecord}
                          setClearSelectedRows={setClearSelectedRows}
                          setClearSelection={setClearSelection}
                          clearSelectedRows={clearSelectedRows}
                          clearSelection={clearSelection}
                          conditionalRowStyles={conditionalRowStyles}
                          setFiltereddata={setFiltereddata}
                          setData={setData}
                          setFiltereddataBkp={setFiltereddataBkp}
                          searchString={searchString}
                          setBranchId={setBranchId}
                          branchid={branchid}
                          areaid={areaid}
                          setAreaId={setAreaId}
                          serialid={serialid}
                          setSerialId={setSerialId}
                          franchiseid={franchiseid}
                          setFranchsieId={setFranchsieId}
                          setBranchFilter={setBranchFilter}
                          zoneid={zoneid}
                          setZoneId={setZoneId}
                          inputs={inputs}
                          setInputs={setInputs}
                          hide={hide}
                          setHide={setHide}
                        />
                      )}
                    </>
                  ) : (
                    <p style={{ textAlign: "center" }}>
                      {"You have insufficient permissions to view this"}
                    </p>
                  )}
                </div>

                {networkState === "olt" && <div
                  style={{
                    display: networkState === "olt" ? "block" : "none",
                    marginTop: "19px",
                  }}
                >
                  {/* {networkState == "olt" && ( */}
                  <OltTable
                   serialNo={serialNo}
                   setSerialNo={setSerialNo}
                    handleOltPerRowsChange={handleOltPerRowsChange}
                    handleOltPageChange={handleOltPageChange}
                    oltLists={oltLists}
                    fetchOltNetworkLists={fetchOltNetworkLists}
                    detailsname={detailsname}
                    setDeatilsname={setDeatilsname}
                    networkState={networkState}
                    selectedTab={networkState}
                    refresh={refresh}
                    setRowlength={setRowlength}
                    rowlength={rowlength}
                    setIsChecked={setIsChecked}
                    isDeleted={isDeleted}
                    setRowdeleterecord={setRowdeleterecord}
                    data={filteredData}
                    setClearSelectedRows={setClearSelectedRows}
                    setClearSelection={setClearSelection}
                    clearSelectedRows={clearSelectedRows}
                    clearSelection={clearSelection}
                    setFiltereddata={setFiltereddata}
                    setData={setData}
                    setFiltereddataBkp={setFiltereddataBkp}
                    conditionalRowStyles={conditionalRowStyles}
                    searchString={searchString}
                    Refreshhandler={Refreshhandler}
                    branchFilter={branchFilter}
                    setBranchId={setBranchId}
                    branchid={branchid}
                    areaid={areaid}
                    setAreaId={setAreaId}
                    serialid={serialid}
                    setSerialId={setSerialId}
                    franchiseid={franchiseid}
                    setFranchsieId={setFranchsieId}
                    setBranchFilter={setBranchFilter}
                    zoneid={zoneid}
                    setZoneId={setZoneId}
                    inputs={inputs}
                    setInputs={setInputs}
                    setRefresh={setRefresh}
                  />
                  {/* )} */}
                </div>
                }

                <div
                  style={{
                    display: networkState == "dp" ? "block" : "none",
                    marginTop: "19px",
                  }}
                >
                  {networkState == "dp" && (
                    <DpTable
                      serialNo={serialNo}
                      setSerialNo={setSerialNo}
                      handleDpPerRowsChange={handleDpPerRowsChange}
                      handleDpPageChange={handleDpPageChange}
                      selectedDpRadioBtnDisplay={selectedDpRadioBtnDisplay}
                      setSelectedDpRadioBtnDisplay={
                        setSelectedDpRadioBtnDisplay
                      }
                      dpLists={dpLists}
                      fetchDpNetworkLists={fetchDpNetworkLists}
                      detailsname={detailsname}
                      setDeatilsname={setDeatilsname}
                      networkState={networkState}
                      rowlength={rowlength}
                      selectedTab={networkState}
                      dprefresh={dprefresh}
                      setDpRefresh={setDpRefresh}
                      setRowlength={setRowlength}
                      setIsChecked={setIsChecked}
                      isDeleted={isDeleted}
                      selectedDpRadioBtn={setSelecteddpradiobutton}
                      setRowdeleterecord={setRowdeleterecord}
                      data={filteredData}
                      setClearSelectedRows={setClearSelectedRows}
                      setClearSelection={setClearSelection}
                      clearSelectedRows={clearSelectedRows}
                      clearSelection={clearSelection}
                      setFiltereddata={setFiltereddata}
                      setData={setData}
                      setFiltereddataBkp={setFiltereddataBkp}
                      conditionalRowStyles={conditionalRowStyles}
                      searchString={searchString}
                      Refreshhandler={Refreshhandler}
                      branchid={branchid}
                      setBranchId={setBranchId}
                      franchiseid={franchiseid}
                      setFranchsieId={setFranchsieId}
                      zoneid={zoneid}
                      setZoneId={setZoneId}
                      areaid={areaid}
                      setAreaId={setAreaId}
                      inputs={inputs}
                      setInputs={setInputs}
                    />
                  )}
                </div>
                <div
                  style={{
                    display: networkState == "cpe" ? "block" : "none",
                    marginTop: "19px",
                  }}
                >
                  {networkState == "cpe" && (
                    <CpeTable
                      serialNo={serialNo}
                      setSerialNo={setSerialNo}
                      handleCpePerRowsChange={handleCpePerRowsChange}
                      handleCpePageChange={handleCpePageChange}
                      cpeLists={cpeLists}
                      fetchCpeNetworkLists={fetchCpeNetworkLists}
                      detailsname={detailsname}
                      setDeatilsname={setDeatilsname}
                      networkState={networkState}
                      rowlength={rowlength}
                      cperefresh={cperefresh}
                      setCpeRefresh={setCpeRefresh}
                      setRowlength={setRowlength}
                      setIsChecked={setIsChecked}
                      isDeleted={isDeleted}
                      selectedTab={networkState}
                      setRowdeleterecord={setRowdeleterecord}
                      data={filteredData}
                      setClearSelectedRows={setClearSelectedRows}
                      setClearSelection={setClearSelection}
                      clearSelectedRows={clearSelectedRows}
                      clearSelection={clearSelection}
                      setFiltereddata={setFiltereddata}
                      setData={setData}
                      setFiltereddataBkp={setFiltereddataBkp}
                      conditionalRowStyles={conditionalRowStyles}
                      searchString={searchString}
                      Refreshhandler={Refreshhandler}
                      branchid={branchid}
                      setBranchId={setBranchId}
                      franchiseid={franchiseid}
                      setFranchsieId={setFranchsieId}
                      zoneid={zoneid}
                      setZoneId={setZoneId}
                      areaid={areaid}
                      setAreaId={setAreaId}
                      inputs={inputs}
                      setInputs={setInputs}
                    />
                  )}
                </div>
              </Col>

              <Row>
                <Col
                  md="12"
                  className={`${
                    isExpand ? "customizer-contain-alloptical-expand" : ""
                  }`}
                >
                  <div
                    ref={box}
                    className="customizer-contain customizer-contain-alloptical custom-scrollbar"
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                      width: "90% !important",
                    }}
                  >
                    <div
                      className="customizer-header"
                      style={{
                        padding: "0px",
                        border: "none",
                        padding: "35px 0 15px 0",
                        borderTopLeftRadius: "20px",
                      }}
                    >
                      {/* <div
                        style={{
                          paddingLeft: "9px",
                          fontSize: "large",
                          fontWeight: "700",
                        }}
                      >
                        Add New Hardware
                      </div> */}
                      <span>
                        <i className="icon-close" onClick={closeCustomizer}></i>
                      </span>
                    </div>
                    <Row>
                      {!!showStepperListFromAddHardware.find(
                        (s) => s.title != ""
                      ) && (
                        <div
                          className="expand-icon-container"
                          style={{ cursor: "pointer" }}
                        >
                          <p
                            id="styleofnasoltdpcpe"
                            onClick={() => setIsExpand(!isExpand)}
                          >
                            Network Hierarchy
                          </p>
                        </div>
                      )}
                      <Col md={`${isExpand ? 8 : 12}`}>
                        <div className="tab-content" id="c-pills-tabContent">
                          <Modal
                            isOpen={modal}
                            toggle={toggle}
                            className="modal-body"
                            centered={true}
                          >
                            <ModalHeader toggle={toggle}>
                              {ModalTitle}
                            </ModalHeader>
                            <ModalFooter>
                              <CopyToClipboard text={JSON.stringify(configDB)}>
                                <Button
                                  color="primary"
                                  className="notification"
                                  onClick={() =>
                                    toast.success(
                                      "Code Copied to clipboard !",
                                      {
                                        position: toast.POSITION.BOTTOM_RIGHT,
                                      }
                                    )
                                  }
                                >
                                  {CopyText}
                                </Button>
                              </CopyToClipboard>
                              <Button color="secondary" onClick={toggle}>
                                {Cancel}
                              </Button>
                            </ModalFooter>
                          </Modal>
                          <div className=" customizer-body custom-scrollbar">
                            <TabContent activeTab={activeTab1}>
                              <TabPane tabId="2">
                                <div id="headerheading"> Add New Hardware</div>
                                <ul
                                  className="layout-grid layout-types"
                                  style={{ border: "none" }}
                                >
                                  <li
                                    data-attr="compact-sidebar"
                                    onClick={(e) =>
                                      handlePageLayputs(classes[0])
                                    }
                                  >
                                    <div className="layout-img">
                                      <AddHardware
                                        Refreshhandler={Refreshhandler}
                                        dataClose={closeDirtyModal}
                                        onUpdate={(data) => update(data)}
                                        rightSidebar={rightSidebar}
                                        setIsDirtyFun={setIsDirtyFun}
                                        setformDataForSaveInDraft={
                                          setformDataForSaveInDraft
                                        }
                                        setAccordionActiveKey={
                                          setAccordionActiveKey
                                        }
                                        accordionActiveKey={accordionActiveKey}
                                        lead={lead}
                                        setLead={setLead}
                                        setIsExpand={setIsExpand}
                                        isExpand={isExpand}
                                        setShowStepperListFromAddHardware={
                                          setShowStepperListFromAddHardware
                                        }
                                        setAvailableHardware={
                                          setAvailableHardware
                                        }
                                        zone={zone}
                                        setZone={setZone}
                                      />
                                    </div>
                                  </li>
                                </ul>
                              </TabPane>
                              <TabPane tabId="4">
                                <div id="headerheading">
                                  {" "}
                                  NAS Information
                                </div>
                                <AllLocations nasLocation={nasLocation}/>
                              </TabPane>
                              <TabPane tabId="5">
                                <div id="headerheading"> OLT Information</div>
                                <OLtAllLocations oltLocation={oltLocation} />
                              </TabPane>
                              <TabPane tabId="6">
                                <div id="headerheading"> PDP Information</div>
                                <PdpAllLocations  pdpLocations={pdpLocations} />
                              </TabPane>
                              <TabPane tabId="7">
                                <div id="headerheading"> CDP Information</div>
                                <CdpAllLocations  cdpLocations={cdpLocations} />
                              </TabPane>
                              <TabPane tabId="8">
                                <div id="headerheading"> CPE Information</div>
                                <CpeAllLocations  cpeLocations={cpeLocations} />
                              </TabPane>
                            </TabContent>
                          </div>

                          <Modal
                            isOpen={isDirtyModal}
                            toggle={() => setisDirtyModal(!isDirtyModal)}
                            className="modal-body"
                            centered={true}
                            backdrop="static"
                          >
                            <ModalHeader
                              toggle={() => setisDirtyModal(!isDirtyModal)}
                            >
                              {"Confirmation"}
                            </ModalHeader>
                            <ModalBody>
                              Do you want to save this data in draft?
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                color="primary"
                                className="notification"
                                onClick={saveDataInDraftAndCloseModal}
                                id="sub_plan"
                              >
                                {"Save & Close"}
                              </Button>
                              {/* Sailaja Changed close button Styles (Line Number 1051)on 13th July */}
                              <Button
                                color="secondary"
                                onClick={() => closeDirtyModal()}
                                id="resetid"
                              >
                                {"Close"}
                              </Button>
                            </ModalFooter>
                          </Modal>
                        </div>
                      </Col>
                      <Col
                        md="4"
                        className={`${
                          isExpand
                            ? "customizer-contain-alloptical-expand-stepper-section-show"
                            : "customizer-contain-alloptical-expand-stepper-section"
                        }`}
                      >
                        <Card>
                          <CardBody style={{ padding: "15px" }}>
                            <div className="customizer-contain-alloptical-expand-stepper-section-info">
                              <Steps
                                current={showStepperListFromAddHardware.length}
                                direction="vertical"
                                labelPlacement="vertical"
                              >
                                {showStepperListFromAddHardware.map((step) => {
                                  return (
                                    <Steps.Step
                                      title={step.title}
                                      description={
                                        <div className="step-description">
                                          <span>
                                            Harware Device Name:
                                            <span className="btn btn-primary btn-xs step-span">
                                              {" "}
                                              {step.name}
                                            </span>
                                          </span>
                                          <br />
                                          {step.branch && (
                                            <>
                                              <span>
                                                Current Device's Branch:
                                                <span className="btn btn-primary btn-xs step-span">
                                                  {" "}
                                                  {step.branch}
                                                </span>
                                              </span>
                                              <br />
                                            </>
                                          )}
                                          {step.total_ports && (
                                            <>
                                              <span>
                                                Total ports & Available ports:
                                                <span className="btn btn-primary btn-xs step-span">
                                                  {" "}
                                                  ( {step.total_ports}/{" "}
                                                  {step.available_ports})
                                                </span>
                                              </span>
                                              <br />
                                            </>
                                          )}
                                          {step.zone && (
                                            <>
                                              <span>
                                                Current Device Zone:{" "}
                                                <span className="btn btn-primary btn-xs step-span">
                                                  {" "}
                                                  {step.zone}
                                                </span>
                                              </span>
                                              <br />
                                            </>
                                          )}
                                          {step.connection_port && (
                                            <>
                                              {" "}
                                              <span>
                                                Connection Port:
                                                <span className="btn btn-primary btn-xs step-span">
                                                  {step.connection_port}
                                                </span>
                                              </span>
                                              <br />
                                            </>
                                          )}
                                        </div>
                                      }
                                    />
                                  );
                                })}
                              </Steps>
                            </div>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Col>
                {/* modal for insufficient permissions */}

                <PermissionModal
                  content={permissionModalText}
                  visible={permissionmodal}
                  handleVisible={permissiontoggle}
                />
                {/* end */}
              </Row>
            </Row>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default AllOptical;

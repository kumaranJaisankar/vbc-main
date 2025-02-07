import React, { useEffect, useState, useRef, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { logout_From_Firebase } from "../../../utils";
import PermissionModal from "../../common/PermissionModal";
import NewCustomerUtilityBadge from "../../utilitycomponents/NewCustomerUtilityBadge";
import { NewCustomerListsHeaderButtons } from "./NewCustomerListsHeaderButtons";
import { NewCustomerListsCustomizer } from "./NewCustomerListsCustomizer";
import { NewCustomerListsRenewChangePlanModal } from "./NewCustomerListsRenewChangePlanModal";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import DeleteModal from "../leads/DeleteModal";
import { Spinner } from "reactstrap";
import {
  getCustomerListsTableColumns,
  getAppliedFiltersObj,
  getAdditionalFiltersObj,
} from "./data";
import { customeraxios, adminaxios } from "../../../axios";
import moment from "moment";
import { CUSTOMER_LIST } from "../../../utils/permissions";
import AllFilters from "./allFilters";

const storageToken = localStorage.getItem("token");
const token = JSON.parse(storageToken);
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

const NewCustomerLists = (initialValues) => {
  const history = useHistory();
  const location = useLocation();
  const id = window.location.pathname.split("/").pop();
  const [inputs, setInputs] = useState(initialValues);
  const [customstartdate, setCustomstartdate] = useState();
  const [customenddate, setCustomenddate] = useState();
  const [customerLists, updateCustomerLists] = useState(
    {
      uiState: { loading: false },
      currentPageNo: 1,
      currentItemsPerPage: 10,
      pageLoadData: [],
      pageLoadDataForFilter: [],
      prevURI: null,
      nextURI: null,
      appliedFilters: { ...getAppliedFiltersObj() },
      additionalFilters: { ...getAdditionalFiltersObj() },
      currentTab: "all",
      tabCounts: {},
      totalRows: "",
    },
    location?.state?.billingDateRange
  );

  const [filtersData, updateDataForFilters] = useState({
    branch: [],
    zone: [],
    area: [],
    franchiseBranches: [],
    franchiseBranchesBackUp: [],
    franchises: [],
    franchisesBackUp: [],
  });

  const [activeTab, setActiveTab] = useState(
    location?.state?.billingDateRange || "all"
  );

  const [selectedRow, setSelectedRow] = useState({});
  const [columnsToHide, setColumnsToHide] = useState([]);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [isSessionHistoryOpen, setIsSessionHistoryOpen] = useState(false);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [refresh, setRefresh] = useState(0);
  const [showHidePermissionModal, setShowHidePermissionModal] = useState(false);
  const [renew, setRenew] = useState("RPAY");
  const [isRenewChangePlanModalOpen, setIsRenewChangePlanModalOpen] =
    useState(false);
  const [serviceObjData, setServiceObjData] = useState([]);
  const [selectID, setSelectID] = useState("");

  // change plan state
  const [changeplan, setChangeplan] = useState([]);
  const [changeplanListBkp, setChangeplanListBkp] = useState([]);
  //end
  // spinner
  const [loader, setLoader] = useState(false);
  // service plan state
  const [serviceplanobj, setServiceplanobj] = useState([]);
  const [serviceplanobjbkp, setServiceplanobjbkp] = useState([]);
  //end
  //delete modal states
  const [isChecked, setIsChecked] = useState([]);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  const [clearSelection, setClearSelection] = useState(false);
  // const [filteredData, setFiltereddata] = useState(customerLists.pageLoadData);
  //state for area api only for zonalmanager
  const [getareas, setGetAreas] = useState([]);
  // const [getareas1, setGetAreas1] = useState([]);

  const [getzoneareas, setGetZoneAreas] = useState([]);
  //zone id state
  const [zoneValue, setZoneValue] = useState([]);

  const toggleRenewChangePlanModalOpen = () =>
    setIsRenewChangePlanModalOpen(!isRenewChangePlanModalOpen);

  const togglePermissionModal = () =>
    setShowHidePermissionModal(!showHidePermissionModal);

  const ref = useRef();
  const box = useRef(null);
  const searchInputField = useRef(null);

  useEffect(() => {
    ref.current && ref.current.scrollIntoView(0, 0);
  }, []);

  //Hide sidebar on overlay click
  useOutsideAlerter(box);
  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleOutsideClick(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          if (
            isCustomerDetailsOpen &&
            !event.target.className.includes("openmodal")
          ) {
            closeCustomizer();
          }
        }
      }
      document.addEventListener("click", handleOutsideClick);
    }, [ref]);
  }

  const getConvertedAccountStatus = (status) => {
    switch (status) {
      case "Active":
        return "act";
      case "Expired":
        return "exp";
      case "Online":
        return "online";
      default:
        return "";
    }
  };

  const [previousBranch, setPreviousBranch] = useState(null);
  const [sendFranchise, setSendFranchise] = useState(true);
  const [sendZone, setSendZone] = useState(true);
  const [sendArea, setSendArea] = useState(true);
  const handleBranchSelect = (event) => {
    setPreviousBranch(inputs.branch);
    setSendFranchise(false);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected branch value
  };

  const handleFranchiseSelect = (event) => {
    setPreviousBranch(inputs.franchise);
    setSendFranchise(true);
    setSendZone(false);
    setSendArea(false);
    // Update your 'inputs' state with the selected franchise value
  };

  const handleZoneSelect = (event) => {
    setSendZone(true);
    setSendArea(false);
  };
  const handleAreaSelect = (event) => {
    setSendArea(true);
  };

  var startDate = moment().format("YYYY-MM-DD");
  var endDate = moment().format("YYYY-MM-DD");
  let connection = `&created=${startDate}&created_end=${endDate}`;
  const getQueryParams = (isPageLimit = true) => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedFilters,
      additionalFilters,
    } = customerLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (activeTab !== "all") {
      queryParams += `${queryParams ? "&" : ""}${
        activeTab === "online" || activeTab === "offline"
          ? "line_status"
          : "account_status"
      }=${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTab
      }`;
    }

    //   // branch
    //   if (inputs && inputs.branch === "ALL1") {
    //     queryParams += ``;
    //   } else if (inputs && inputs.branch) {
    //     queryParams += `&branch=${inputs.branch}`;
    //   }

    //   // fracnhise
    //  if (inputs && inputs.franchise === "ALL2") {
    //     queryParams += ``;
    //   }
    //   else if (inputs && inputs.franchise) {
    //     queryParams += `&franchise=${inputs.franchise}`;
    //   }

    // branch
    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }

    // franchise
    if (inputs && inputs.franchise === "ALL2") {
      queryParams += ``;
    } else if (inputs && inputs.franchise && sendFranchise) {
      queryParams += `&franchise=${inputs.franchise}`;
    }

    // zone
    // if (inputs && inputs.zone === "ALL3") {
    //   queryParams += ``;
    // } else if (ShowAreas && inputs && inputs.zone) {
    //   queryParams += `&zone=${zoneValue}`;
    // } else if (inputs && inputs.zone) {
    //   queryParams += `&zone=${inputs.zone}`;
    // }

    if (inputs && inputs.zone === "ALL3") {
      queryParams += ``;
    } else if (ShowAreas && inputs && inputs.zone) {
      queryParams += `&zone=${zoneValue}`;
    } else if (inputs && inputs.zone && sendZone) {
      queryParams += `&zone=${inputs.zone}`;
    }

    // area

    if (inputs && inputs.area === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.area && sendArea) {
      queryParams += `&area=${inputs.area}`;
    }

    // gst in

    if (inputs && inputs.is_gst === "ALL5") {
      queryParams += ``;
    } else if (inputs && inputs.is_gst) {
      queryParams += `&is_gst=${inputs.is_gst}`;
    }

    // custome dates
    if (customstartdate === "ALL6") {
      queryParams += ``;
    } else if (customstartdate && activeTab && activeTab === "&static_ip=0") {
      queryParams += `&plan_updated=${customstartdate}`;
    } else if (customstartdate) {
      console.log("hiii1");
      queryParams += `&created=${customstartdate}`;
    }

    if (customenddate === "ALL6") {
      queryParams += ``;
    } else if (customenddate && activeTab && activeTab === "&static_ip=0") {
      queryParams += `&plan_updated_end=${customenddate}`;
    } else if (customenddate) {
      queryParams += `&created_end=${customenddate}`;
    }

    if (appliedFilters.created_at_status.value.strVal) {
      const status = getConvertedAccountStatus(
        appliedFilters.created_at_status.value.strVal
      );
      if (status === "online" || status === "offline") {
        queryParams += `${queryParams ? "" : ""}&line_status=${status}`;
      } else {
        queryParams += `${queryParams ? "" : ""}&account_status=${status}`;
      }
    }
    if (appliedFilters.first_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}firstname=${
        appliedFilters.first_name.value.strVal
      }`;
    }
    if (appliedFilters.last_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}lastname=${
        appliedFilters.last_name.value.strVal
      }`;
    }
    // gst yes or no code
    if (
      appliedFilters.created_at_status &&
      appliedFilters.created_at_status.value.strVal === "Yes"
    ) {
      queryParams += `${queryParams ? "&" : ""}is_gst=true`;
    }
    if (
      appliedFilters.created_at_status &&
      appliedFilters.created_at_status.value.strVal === "No"
    ) {
      queryParams += `${queryParams ? "&" : ""}is_gst=false`;
    }
    if (appliedFilters.created_at_from_date.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}created=${moment(
        appliedFilters.created_at_from_date.value.strVal
      ).format("YYYY-MM-DD")}`;
    }

    if (appliedFilters.created_at_to_date.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}created_end=${moment(
        appliedFilters.created_at_to_date.value.strVal
      ).format("YYYY-MM-DD")}`;
    }
    if (appliedFilters.expiry_date.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}expiry_date=${moment(
        appliedFilters.expiry_date.value.strVal
      ).format("YYYY-MM-DD")}`;
    }

    if (appliedFilters.expiry_date_end.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}expiry_date_end=${moment(
        appliedFilters.expiry_date_end.value.strVal
      ).format("YYYY-MM-DD")}`;
    }
    if (appliedFilters.branch.value.results.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }branch=${appliedFilters.branch.value.results
        .map((r) => r.id)
        .join(",")}`;
    }
    if (appliedFilters.zone.value.results.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }zone=${appliedFilters.zone.value.results.map((r) => r.id).join(",")}`;
    }
    if (appliedFilters.area.value.results.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }area=${appliedFilters.area.value.results.map((r) => r.id).join(",")}`;
    }
    if (additionalFilters.franchiseBranches.value.idVal.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }franchise_branches=${additionalFilters.franchiseBranches.value.idVal.join(
        ","
      )}`;
    }
    if (additionalFilters.franchises.value.idVal.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }franchises=${additionalFilters.franchises.value.idVal.join(",")}`;
    }
    // console.log(queryParams + "line 212");

    if (appliedFilters.username.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.username.value.name
      }=${appliedFilters.username.value.strVal}`;
    }

    const tempParams = queryParams;
    queryParams = queryParams.split("&account_status");
    queryParams =
      queryParams.length === 3
        ? queryParams[0] + "&account_status" + queryParams[1]
        : tempParams;
    return queryParams;
  };

  const getQueryParams1 = (isPageLimit = true) => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedFilters,
      additionalFilters,
    } = customerLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    // if (activeTab !== "all") {
    //   queryParams += `${queryParams ? "&" : ""}`
    // }

    // branch
    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }

    // franchise
    if (inputs && inputs.franchise === "ALL2") {
      queryParams += ``;
    } else if (inputs && inputs.franchise && sendFranchise) {
      queryParams += `&franchise=${inputs.franchise}`;
    }

    // zone
    if (inputs && inputs.zone === "ALL3") {
      queryParams += ``;
    } else if (ShowAreas && inputs && inputs.zone) {
      queryParams += `&zone=${zoneValue}`;
    } else if (inputs && inputs.zone && sendZone) {
      queryParams += `&zone=${inputs.zone}`;
    }

    // area

    if (inputs && inputs.area === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.area && sendArea) {
      queryParams += `&area=${inputs.area}`;
    }

    // gst in

    if (inputs && inputs.is_gst === "ALL5") {
      queryParams += ``;
    } else if (inputs && inputs.is_gst) {
      queryParams += `&is_gst=${inputs.is_gst}`;
    }

    // custome dates
    if (customstartdate === "ALL6") {
      queryParams += ``;
    } else if (customstartdate && activeTab && activeTab === "&static_ip=0") {
      queryParams += `&plan_updated=${customstartdate}`;
    } else if (customstartdate) {
      queryParams += `&created=${customstartdate}`;
    }

    if (customenddate === "ALL6") {
      queryParams += ``;
    } else if (customenddate && activeTab && activeTab === "&static_ip=0") {
      queryParams += `&plan_updated_end=${customenddate}`;
    } else if (customenddate) {
      queryParams += `&created_end=${customenddate}`;
    }

    if (appliedFilters.first_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}firstname=${
        appliedFilters.first_name.value.strVal
      }`;
    }
    if (appliedFilters.last_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}lastname=${
        appliedFilters.last_name.value.strVal
      }`;
    }
    // gst yes or no code
    if (
      appliedFilters.created_at_status &&
      appliedFilters.created_at_status.value.strVal === "Yes"
    ) {
      queryParams += `${queryParams ? "&" : ""}is_gst=true`;
    }
    if (
      appliedFilters.created_at_status &&
      appliedFilters.created_at_status.value.strVal === "No"
    ) {
      queryParams += `${queryParams ? "&" : ""}is_gst=false`;
    }

    if (appliedFilters.branch.value.results.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }branch=${appliedFilters.branch.value.results
        .map((r) => r.id)
        .join(",")}`;
    }
    if (appliedFilters.zone.value.results.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }zone=${appliedFilters.zone.value.results.map((r) => r.id).join(",")}`;
    }
    if (appliedFilters.area.value.results.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }area=${appliedFilters.area.value.results.map((r) => r.id).join(",")}`;
    }
    if (additionalFilters.franchiseBranches.value.idVal.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }franchise_branches=${additionalFilters.franchiseBranches.value.idVal.join(
        ","
      )}`;
    }
    if (additionalFilters.franchises.value.idVal.length > 0) {
      queryParams += `${
        queryParams ? "&" : ""
      }franchises=${additionalFilters.franchises.value.idVal.join(",")}`;
    }
    // console.log(queryParams + "line 212");

    if (appliedFilters.username.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.username.value.name
      }=${appliedFilters.username.value.strVal}`;
    }

    const tempParams = queryParams;
    queryParams = queryParams.split("&account_status");
    queryParams =
      queryParams.length === 3
        ? queryParams[0] + "&account_status" + queryParams[1]
        : tempParams;
    return queryParams;
  };

  const renderAfterCalled = useRef(false);
  useEffect(() => {
    fetchCustomerLists();
  }, [
    customerLists.currentPageNo,
    customerLists.currentItemsPerPage,
    activeTab,
    customerLists.appliedFilters, // Remove to handle all in FE
    customerLists.additionalFilters, // Remove to handle all in FE
    refresh,
    // inputs,
    // customstartdate,
    // customenddate,
  ]);

  const [customerCount, setCustomeCount] = useState({});
  useEffect(() => {
    const queryParams = getQueryParams1();
    customeraxios
      .get(
        `customers/v3/list/count?tabs=act,exp,spd,prov,new_customers,static_ip_customers,buffer,hld,dct&${queryParams}`
      )
      .then((res) => {
        setCustomeCount(res?.data?.context, "countss");
      });
  }, [activeTab === "&static_ip=0"]);

  const handleSearch = (myArray) => {
    const queryParams = getQueryParams1();
    customeraxios
      .get(
        `customers/v3/list/count?tabs=act,exp,spd,prov,new_customers,static_ip_customers,buffer&${queryParams}`
      )
      .then((res) => {
        setCustomeCount(res?.data?.context, "countss");
        console.log(myArray); // log the array passed to handleSearch
      });
  };

  const myArray = [
    inputs,
    customstartdate,
    customenddate,
    activeTab === "&static_ip=0",
  ];

  const fetchCustomerLists = () => {
    setLoader(true);
    updateCustomerLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));

    const queryParams = getQueryParams();
    customeraxios
      .get(`customers/v3/list/new?${queryParams}`)
      .then((response) => {
        setLoader(false);
        const { data } = response;
        const { counts, count, next, previous, page, results } = data;
        let newresults = results.map((item) => ({
          id: item?.id,
          username: item?.user?.username,
          cleartext_password: item?.user?.cleartext_password,
          area: item?.area?.name,
          area_id: item?.area?.id,
          franchise: item?.area?.franchise?.name,
          branch: item?.area?.zone?.branch?.name,
          zone: item?.area?.zone?.name,
          package_name: item?.service_plan?.package_name,
          download: item?.service_plan?.download_speed,
          upload: item?.service_plan?.upload_speed,
          user: item?.user?.id,
          first_name: item?.first_name,
          last_name: item?.last_name,
          service_plan: item?.service_plan?.id,
          service_type: item?.service_type,
          register_mobile: item?.register_mobile,
          registered_email: item?.registered_email,
          account_status: item?.account_status,
          restrict_access: item?.restrict_access,
          payment_status: item?.payment_status,
          created: item?.created,
          account_type: item?.account_type,
          expiry_date: item?.expiry_date,
          plan_updated: item?.plan_updated,
          monthly_date: item?.monthly_date,
          last_invoice_id: item?.last_invoice_id,
          radius_info: item?.radius_info,
          user_advance_info: item?.user_advance_info,
          address: item?.address,
          network_info: item?.network_info,
          acctstoptime: item?.status,
          static_ip: item?.radius_info?.static_ip_bind,
          account_type: item?.account_type,
        }));
        updateCustomerLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...newresults],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...newresults],
          totalRows: count,
        }));
      })
      .catch((error) => {
        setLoader(false);
        updateCustomerLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
        const { code, detail } = error;
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        if (detail === "INSUFFICIENT_PERMISSIONS") {
          togglePermissionModal();
        } else if (is500Error) {
          setPermissionModalText("Something went wrong !");
          togglePermissionModal();
        } else if (
          code === "In-valid token. Please login again" ||
          detail === "In-valid token. Please login again"
        ) {
          logout();
        } else {
          toast.error(error.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      })
      .finally(function () {
        updateCustomerLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  const userIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsCustomerDetailsOpen(true);
  };

  const noOfSessionClickHandler = (row) => {
    setSelectedRow(row);
    setIsSessionHistoryOpen(true);
  };

  const changePlanClickHandler = (service_plan_id, row_id, row_area_id) => {
    dataSubmit({ ID: service_plan_id, customerID: row_id, area: row_area_id });
    changePlanSubmit({
      ID: service_plan_id,
      area: row_area_id,
    });
    toggleRenewChangePlanModalOpen();
  };

  const dataSubmit = ({ ID, customerID, area }) => {
    setSelectID(customerID);
    // if(!renderAfterCalled){

    adminaxios
      .get(`accounts/loggedin/${area}/plans/${ID}`)
      .then((res) => {
        setServiceplanobj(res.data);
        setServiceplanobjbkp(res.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    // }
  };

  const changePlanSubmit = ({ ID, area }) => {
    // if(!renderAfterCalled){
    let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
    adminaxios
      .get(`accounts/area/${area}/otherplans/${ID}/${customerInfo.id}`)
      .then((res) => {
        setChangeplan(res.data);
        setChangeplanListBkp(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
    // }
  };

  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };

  const redirectToCustomerDetails = (row) => {
    if (!!row) {
      sessionStorage.setItem("customerInfDetails", JSON.stringify(row));
      history.push(
        `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/customerdetails/${row.user}/${row.username}/${row.radius_info?.id}/${process.env.REACT_APP_API_URL_Layout_Name}`
      );
    }
  };

  // columns
  const tableColumns = getCustomerListsTableColumns({
    userIdClickHandler,
    noOfSessionClickHandler,
    changePlanClickHandler,
    RefreshHandler,
    redirectToCustomerDetails,
  });

  const hideActionColumn =
    token.permissions.includes(CUSTOMER_LIST.DISCONNECT) ||
    token.permissions.includes(CUSTOMER_LIST.RENEW_PLAN) ||
    token.permissions.includes(CUSTOMER_LIST.CHANGE_PLAN);

  const hideSessionColumn = token.permissions.includes(
    CUSTOMER_LIST.CUNSUMPTION_LOGS
  );

  const updatedColumns = useMemo(
    () =>
      tableColumns.filter((item) => {
        if (item.selector === "action") {
          // return hideActionColumn;
        } else if (item.selector === "session_count") {
          return hideSessionColumn;
        }
        return true;
      }),
    [tableColumns, hideSessionColumn, hideActionColumn]
  );

  const memoizedTableColumns = useMemo(
    () =>
      columnsToHide.length === 0
        ? updatedColumns
        : updatedColumns.filter((item) =>
            columnsToHide.includes(item.selector)
          ),
    [updatedColumns, columnsToHide]
  );

  // when id is checked change background color of row
  const conditionalRowStyles = [
    {
      when: (row) => row.selected == true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  // const handleSelectedRows = (selectedRows) => {
  //   const tempFilteredData =
  //   filtersData.map((item) => ({ ...item, selected: false })) || [];
  //   const selectedIds = selectedRows.map((item) => item.id);
  //   const temp = tempFilteredData.map((item) => {
  //     if (selectedIds.includes(item.id)) return { ...item, selected: true };
  //     else return { ...item, selected: false };
  //   });
  //   updateDataForFilters(temp);
  // };

  const closeCustomizer = () => {
    setRenew("RPAY");
    setIsCustomerDetailsOpen(false);
    setIsSessionHistoryOpen(false);
  };

  const detailsUpdate = () => {
    RefreshHandler();
    closeCustomizer();
  };

  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        htmlFor="booty-check"
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="booty-check" />
    </div>
  ));

  const Verticalcentermodaltoggle = () => {
    if (Verticalcenter == true) {
      setIsChecked([]);
      setClearSelection(true);
    }

    // if (isChecked.length > 0) {
    //   let selectedIdsForDelete = [...isChecked];
    //   let notOpenLeadIds = selectedIdsForDelete.filter((id) => {
    //     let data = filteredData.find((d) => d.id == id);
    //     return data.status !== "OPEN";
    //   });
    //   setNotOpenLeadIdsForDelete(notOpenLeadIds);
    //   setVerticalcenter(!Verticalcenter);
    // } else {
    //   toast.error("Please select any record", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000,
    //   });
    // }
  };

  // dates
  const [showhidecustomfields, setShowhidecustomfields] = useState(false);

  const basedonrangeselector = (e, value) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    if (e.target.value === "ALL6") {
      setShowhidecustomfields(false);
      reportstartdate = "";
      reportenddate = "";
    }
    if (e.target.value === "today") {
      setShowhidecustomfields(true);

      reportstartdate = moment().format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //yesterday
    else if (e.target.value === "yesterday") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");

      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days
    else if (e.target.value === "last7days") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      setShowhidecustomfields(true);

      reportstartdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //end
    //last week
    else if (e.target.value === "lastweek") {
      setShowhidecustomfields(true);

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
      setShowhidecustomfields(true);
      reportstartdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .format("YYYY-MM-DD");
    } else if (e.target.value === "custom") {
      setShowhidecustomfields(true);
      reportstartdate = e.target.value;

      reportstartdate = e.target.value;
    }
    setCustomstartdate(reportstartdate);
    setCustomenddate(reportenddate);
  };
  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
    }
  };
  let styleobj = { "font-size": "25px !important" };

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
    <div style={{ padding: "20px" }}>
      <Grid container spacing={1} style={{ position: "relative" }}>
        <Grid item md="12" id="breadcrumb_margin">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={
              <NavigateNextIcon fontSize="small" className="navigate_icon" />
            }
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
              color="#00000 !important"
              fontSize="14px"
              className="last_typography"
            >
              Customers
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <br />
      <br />
      {/* Sailaja on 11th July   Line number 647 id="breadcrumb_table" change the breadcrumb position */}
      <Grid
        container
        spacing={1}
        className=" edit-profile data_table"
        id="breadcrumb_table"
      >
        <Grid item md="12">
          <NewCustomerListsHeaderButtons
            currentTab={activeTab}
            customerLists={customerLists}
            filtersData={filtersData}
            RefreshHandler={RefreshHandler}
            updateCustomerLists={updateCustomerLists}
            tableColumns={tableColumns}
            setColumnsToHide={setColumnsToHide}
            getQueryParams={getQueryParams}
          />
        </Grid>
        {token.permissions.includes(CUSTOMER_LIST.FILTERS) && (
          <Grid item md="12">
            <AllFilters
              handleBranchSelect={handleBranchSelect}
              handleFranchiseSelect={handleFranchiseSelect}
              handleZoneSelect={handleZoneSelect}
              handleAreaSelect={handleAreaSelect}
              setInputs={setInputs}
              inputs={inputs}
              customenddate={customenddate}
              customHandler={customHandler}
              customstartdate={customstartdate}
              showhidecustomfields={showhidecustomfields}
              basedonrangeselector={basedonrangeselector}
              ShowAreas={ShowAreas}
              DisplayAreas={DisplayAreas}
              getareas={getareas}
              getzoneareas={getzoneareas}
              zoneValue={zoneValue}
              setZoneValue={setZoneValue}
            />
          </Grid>
        )}
        {/* <Grid item ms = "12" style={{marginTop:"-20px"}}> */}
        &nbsp; &nbsp;
        <button
          className="btn btn-primary openmodal"
          id=""
          type="button"
          onClick={() => {
            handleSearch(myArray);
            fetchCustomerLists(inputs);
          }}
          disabled={loader ? loader : loader}
        >
          {loader ? <Spinner size="sm"> </Spinner> : null} &nbsp;
          <b>Search </b>{" "}
        </button>
        <Grid item md="12">
          <NewCustomerUtilityBadge
            currentTab={activeTab}
            setActiveTab={setActiveTab}
            tabCounts={customerCount}
          />
        </Grid>
        <Grid item md="12">
          {token.permissions.includes(CUSTOMER_LIST.LIST) ? (
            <DataTable
              className="customer-list"
              columns={memoizedTableColumns}
              data={customerLists.pageLoadData || []}
              noHeader
              clearSelectedRows={false}
              progressPending={customerLists.uiState?.loading}
              progressComponent={
                <SkeletonLoader loading={customerLists.uiState.loading} />
              }
              pagination
              paginationServer
              paginationTotalRows={customerLists.totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noDataComponent={"No Data"}
              // clearSelectedRows={clearSelectedRows}
              conditionalRowStyles={conditionalRowStyles}
              selectableRows
              selectableRowsComponent={NewCheckbox}
              style={styleobj}
            />
          ) : (
            <p style={{ textAlign: "center" }}>
              {"You have insufficient permissions to view this"}
            </p>
          )}
        </Grid>
      </Grid>
      {(isCustomerDetailsOpen || isSessionHistoryOpen) && (
        <NewCustomerListsCustomizer
          ref={box}
          isCustomerDetailsOpen={isCustomerDetailsOpen}
          isSessionHistoryOpen={isSessionHistoryOpen}
          selectedRow={selectedRow}
          renew={renew}
          setRenew={setRenew}
          detailsUpdate={detailsUpdate}
          closeCustomizer={closeCustomizer}
          RefreshHandler={RefreshHandler}
        />
      )}
      <NewCustomerListsRenewChangePlanModal
        isRenewChangePlanModalOpen={isRenewChangePlanModalOpen}
        toggleRenewChangePlanModalOpen={toggleRenewChangePlanModalOpen}
        serviceObjData={serviceObjData}
        setServiceObjData={setServiceObjData}
        RefreshHandler={RefreshHandler}
        selectID={selectID}
        changeplan={changeplan}
        setChangeplan={setChangeplan}
        changeplanListBkp={changeplanListBkp}
        setChangeplanListBkp={setChangeplanListBkp}
        serviceplanobj={serviceplanobj}
        setServiceplanobj={setServiceplanobj}
        serviceplanobjbkp={serviceplanobjbkp}
        setServiceplanobjbkp={setServiceplanobjbkp}
      />
      <DeleteModal
        visible={Verticalcenter && isChecked.length > 0}
        handleVisible={Verticalcentermodaltoggle}
        isChecked={isChecked}
        // tokenAccess={tokenAccess}
        // setFiltereddata={setFiltereddata}
        setClearSelectedRows={setClearSelectedRows}
        setIsChecked={setIsChecked}
        // setClearSelection={setClearSelection}
        // notOpenLeadIdsForDelete={notOpenLeadIdsForDelete}
      />
      <PermissionModal
        content={permissionModalText}
        visible={showHidePermissionModal}
        handleVisible={togglePermissionModal}
      />
    </div>
  );
};

const SkeletonLoader = ({ loading }) => {
  const tableData = useMemo(
    () => (loading ? Array(10).fill({}) : []),
    [loading]
  );

  return (
    <Box sx={{ width: "100%", pl: 2, pr: 2 }}>
      {tableData.map((_) => (
        <Skeleton height={50} />
      ))}
    </Box>
  );
};

export default NewCustomerLists;

import React, {
  useEffect,
  useState,
  useRef,
  useMemo
} from "react";
import { useHistory } from "react-router-dom";
import Grid from '@mui/material/Grid';
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import moment from "moment";
import Skeleton from "@mui/material/Skeleton";
import {
  getCustomerListsTableColumns,
  getAppliedFiltersObj,
  getAdditionalFiltersObj,
} from "./data";
import AllFilters from "../../customermanagement/allFilters"
import { customeraxios } from "../../../../axios";
import { NewCustomerListsHeaderButtons } from "../../customermanagement/NewCustomerListsHeaderButtons";
import Box from "@mui/material/Box";
import { Spinner } from "reactstrap"
import DashboardFilters from "./DashboardFilter"
const CustomerExpiredTable = (props, initialValues) => {

  const history = useHistory();
  const [customerLists, updateCustomerLists] = useState({
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
  });
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRow, setSelectedRow] = useState({});
  const [columnsToHide, setColumnsToHide] = useState([]);
  const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
  const [isSessionHistoryOpen, setIsSessionHistoryOpen] = useState(false);
  const [inputs, setInputs] = useState(initialValues);
  const [refresh, setRefresh] = useState(0);
  const ref = useRef();
  const box = useRef(null);
  const searchInputField = useRef(null);

  const [filtersData, updateDataForFilters] = useState({
    branch: [],
    zone: [],
    area: [],
    franchiseBranches: [],
    franchiseBranchesBackUp: [],
    franchises: [],
    franchisesBackUp: [],
  });
  const userIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsCustomerDetailsOpen(true);
  };

  const noOfSessionClickHandler = (row) => {
    setSelectedRow(row);
    setIsSessionHistoryOpen(true);
  };

  const [searchLoader, setSearchLoader] = useState(false)

  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current)
      searchInputField.current.value = "";
  };


  const redirectToCustomerDetails = (row) => {
    if (!!row) {
      sessionStorage.setItem("customerInfDetails", JSON.stringify(row));
      window.open(
        `${process.env.PUBLIC_URL}/app/customermanagement/customerlists/customerdetails/${row.user}/${row.username}/${row.radius_info?.id}/${process.env.REACT_APP_API_URL_Layout_Name}`
      );
    }
  };
  const tableColumns = getCustomerListsTableColumns({
    userIdClickHandler,
    noOfSessionClickHandler,
    RefreshHandler,
    redirectToCustomerDetails,
  });

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

  // when id is checked change background color of row
  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#FFE1D0",
      },
    },
  ];




  // get params 

  var startDate = moment().format("YYYY-MM-DD");
  var endDate = moment().format("YYYY-MM-DD");
  if (props.expiredTableRange == 'Expired Today') {
    startDate = moment().format("YYYY-MM-DD");
    endDate = moment().format("YYYY-MM-DD");
  } else if (props.expiredTableRange === 'Expired Yesterday') {
    startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
    endDate = startDate;
  } else if (props.expiredTableRange == 'Tomorrow') {
    startDate = moment().add(1, 'days').format("YYYY-MM-DD");
    endDate = moment().add(1, 'days').format("YYYY-MM-DD");
  } else if (props.expiredTableRange == 'Expiring Next 7 Days') {
    startDate = moment().format("YYYY-MM-DD");
    endDate = moment().add(6, 'days').format("YYYY-MM-DD");
  } else if (props.expiredTableRange == `Expiring - ${moment().add(1, 'days').format("MMM Do")}`) {
    startDate = moment().add(1, 'days').format("YYYY-MM-DD");
    endDate = moment().add(1, 'days').format("YYYY-MM-DD");
  }
  else if (props.expiredTableRange == `Expiring - ${moment().add(2, 'days').format("MMM Do")}`) {
    startDate = moment().add(2, 'days').format("YYYY-MM-DD");
    endDate = moment().add(2, 'days').format("YYYY-MM-DD");
  } else if (props.expiredTableRange == `Expiring - ${moment().add(3, 'days').format("MMM Do")}`) {
    startDate = moment().add(3, 'days').format("YYYY-MM-DD");
    endDate = moment().add(3, 'days').format("YYYY-MM-DD");
  }
  else if (props.expiredTableRange == `Expiring - ${moment().add(4, 'days').format("MMM Do")}`) {
    startDate = moment().add(4, 'days').format("YYYY-MM-DD");
    endDate = moment().add(4, 'days').format("YYYY-MM-DD");
  }

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
  const getQueryParams = (isPageLimit = true) => {
    const {
      currentPageNo,
      currentItemsPerPage,
    } = customerLists;



    let queryParams = `expiry_date=${startDate}&expiry_date_end=${endDate}&limit=${currentItemsPerPage}`;

    // queryParams += connection;
    if (currentItemsPerPage) {
      queryParams += ``;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    // branch
    if (inputs && inputs.branch === "ALL1") {
      queryParams += ``;
    } else if (inputs && inputs.branch) {
      queryParams += `&branch=${inputs.branch}`;
    }


    // fracnhise

    if (inputs && inputs.franchise === "ALL2") {
      queryParams += ``;
    } else if (inputs && inputs.franchise && sendFranchise) {
      queryParams += `&franchise=${inputs.franchise}`;
    }
    // zone
    if (inputs && inputs.zone === "ALL3") {
      queryParams += ``;
    } else if (inputs && inputs.zone && sendZone) {
      queryParams += `&zone=${inputs.zone}`;
    }

  


    // area

    if (inputs && inputs.area === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.area && sendArea) {
      queryParams += `&area=${inputs.area}`;
    }
    return queryParams;
  };






  useEffect(() => {
    fetchCustomerLists();

  }, [props.expiredTableRange, customerLists.currentPageNo,
  customerLists.currentItemsPerPage])

  const fetchCustomerLists = () => {
    setSearchLoader(true)
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
        setSearchLoader(false)
        const { data } = response;
        const { count, next, previous, page, results } = data;
        let newresults = results.map((item) => (
          {
            "id": item?.id,
            "username": item?.user?.username,
            "cleartext_password": item?.user?.cleartext_password,
            "area": item?.area?.name,
            "area_id": item?.area?.id,
            "franchise": item?.area?.franchise?.name,
            "branch": item?.area?.zone?.branch?.name,
            "zone": item?.area?.zone?.name,
            "package_name": item?.service_plan?.package_name,
            "download": item?.service_plan?.download,
            "upload": item?.service_plan?.upload,
            "user": item?.user?.id,
            "first_name": item?.first_name,
            "last_name": item?.last_name,
            "service_plan": item?.service_plan?.id,
            "service_type": item?.service_type,
            "register_mobile": item?.register_mobile,
            "registered_email": item?.registered_email,
            "account_status": item?.account_status,
            "restrict_access": item?.restrict_access,
            "payment_status": item?.payment_status,
            "created": item?.created,
            "account_type": item?.account_type,
            "expiry_date": item?.expiry_date,
            "plan_updated": item?.plan_updated,
            "monthly_date": item?.monthly_date,
            "last_invoice_id": item?.last_invoice_id,
            "radius_info": item?.radius_info,
            "user_advance_info": item?.user_advance_info,
            "address": item?.address,
            "network_info": item?.network_info,
            "acctstoptime": item?.status,
          }
        ))
        updateCustomerLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          pageLoadData: [...newresults],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...newresults],
          totalRows: count,
        }));
      })
      .catch((error) => {
        setSearchLoader(false)
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

        toast.error(error.detail, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });

      })
      .finally(function () {
        setSearchLoader(false)
        updateCustomerLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  const handleSelectedRows = () => { };

  return (
    <div>
      <Grid item md="10" style={{ position: "relative", top: "-36px", left: "9px", textAlign: "end" }}>
        <NewCustomerListsHeaderButtons
          currentTab={activeTab}
          customerLists={customerLists}
          filtersData={filtersData}
          RefreshHandler={RefreshHandler}
          updateCustomerLists={updateCustomerLists}
          tableColumns={tableColumns}
          setColumnsToHide={setColumnsToHide}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
        />
      </Grid>
      <Grid item md="12" sx={{ display: 'flex', flexFlow: 'column-reverse' }}>
        <DashboardFilters
          handleBranchSelect={handleBranchSelect}
          handleFranchiseSelect={handleFranchiseSelect}
          handleZoneSelect={handleZoneSelect}
          handleAreaSelect={handleAreaSelect}
          setInputs={setInputs}
          inputs={inputs}
          showOnlyExportButton={true}
        />
      </Grid>
      <Grid item md="12">
        <button
          className="btn btn-primary openmodal"
          id=""
          type="button" onClick={() => { fetchCustomerLists(inputs) }}
          disabled={searchLoader ? searchLoader : searchLoader}
        >
          {searchLoader ? <Spinner size="sm"> </Spinner> : null} &nbsp;
          <b>Search
          </b>
        </button>
      </Grid>
      <br />
      <Grid item md="12" sx={{ display: 'flex', flexFlow: 'column-reverse' }}>

        <DataTable
          columns={tableColumns}
          data={customerLists.pageLoadData || []}
          noHeader
          onSelectedRowsChange={({ selectedRows }) =>
            handleSelectedRows(selectedRows)
          }
          clearSelectedRows={false}
          // progressPending={customerLists.uiState.loading}
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
          conditionalRowStyles={conditionalRowStyles}
        />
      </Grid>



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

CustomerExpiredTable.propTypes = {

};

export default CustomerExpiredTable;
import React, { useState, useEffect, useRef, useMemo } from "react";
import WalletHeaderButtons from "./WalletHeaderButtons";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { classes } from "../../../data/layouts";
import { adminaxios } from "../../../axios";
import Skeleton from "@mui/material/Skeleton";
import DataTable from "react-data-table-component";
import Box from "@mui/material/Box";
import { getWalletListsTableColumns, getAppliedFiltersObj } from "./data";
import moment from "moment";
import { NewWalletDetails } from "./Newwalletdetails";
import { toast } from "react-toastify";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Walletfilter from "./walletFilters"
import WalletBadge from "../../utilitycomponents/walletbadge"
import TotalCount from "./Total"
const Newwallet = (initialValues) => {
  const [inputs, setInputs] = useState(initialValues);
  const [walletLists, updateWalletLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    appliedFilters: { ...getAppliedFiltersObj() },

    tabCounts: {},
    totalRows: "",
  });

  const [filtersData, updateDataForFilters] = useState({
    branch: [],
  });
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRow, setSelectedRow] = useState({});
  const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false);
  const [calender, setCalender] = useState(false);
  //state for custom start and end date
  const [customenddate, setCustomenddate] = useState();
  const [customstartdate, setCustomstartdate] = useState();
  const [refresh, setRefresh] = useState(0);
  const [searchLoader, setSearchLoader] = useState(false)
  //state for select id
  const [selectedid, setSelectedid] = useState({});
  //based on filterselection
  const [filterselectedid, setFilterselectedid] = useState([]);
  //handle debit credit
  const [checkdedit, setCheckdedit] = useState(false);
  const [desedit, setDesedit] = useState(false);

  const [summardetails, setSummarydetails] = useState();
  const [credit, setCredit] = useState(false);
  const [debit, setDebit] = useState(false);
  //end
  const [walletheaderstartdate, setWalletHeaderstartdate] = useState(
    // moment().format("YYYY-MM-DD")
  );
  const [walletheaderenddate, setWalletHeaderenddate] = useState(
    // moment().format("YYYY-MM-DD")
  );

  // slide panel
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );

  let history = useHistory();
  let DefaultLayout = {};
  const dispatch = useDispatch();
  useEffect(() => {
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === sidebar_type
    );

    const id =
      window.location.pathname === "/"
        ? history.push()
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);
  }, []);
  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    localStorage.setItem("layout", key);
    history.push(key);
  };

  const openCustomizer = (type) => {
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const closeCustomizer = () => {
    document.querySelector(".customizer-contain").classList.remove("open");
  };



  const [previousBranch, setPreviousBranch] = useState(null);
  const [sendFranchise, setSendFranchise] = useState(true);
  const handleBranchSelect = (event) => {
    setPreviousBranch(inputs.branch);
    setSendFranchise(false);
    // Update your 'inputs' state with the selected branch value
  };

  const handleFranchiseSelect = (event) => {
    setPreviousBranch(inputs.franchise);
    setSendFranchise(true);
    // Update your 'inputs' state with the selected franchise value
  };




  // getQueryParams for tabs

  const getQueryParams = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage, appliedFilters } = walletLists;

    let queryParams = "";
    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (activeTab !== "all") {
      queryParams += `${queryParams ? "&" : ""}${activeTab === "debit"
        ? "debit_is=true"
        : "credit_is=true"
        }`;
    }
    if (walletheaderstartdate) {
      queryParams += `${queryParams ? "&" : ""
        }start_date=${walletheaderstartdate}`;
    }
    if (walletheaderenddate) {
      queryParams += `${queryParams ? "&" : ""}end_date=${walletheaderenddate}`;
    }

    if (credit === true) {
      queryParams += `${queryParams ? "&" : ""}credit_is=${credit}`;
    }
    if (debit === true) {
      queryParams += `${queryParams ? "&" : ""}debit_is=${debit}`;
    }
    //filters queryparams

    if (appliedFilters.branch.value.results.length > 0) {
      queryParams += `${queryParams ? "&" : ""
        }branch=${appliedFilters.branch.value.results.map(item => item.id).join(",")}`;
    }
    // if (appliedFilters.branch.value.results.length > 0) {
    //   queryParams += `${
    //     queryParams ? "&" : ""
    //   }branch=${appliedFilters.branch.value.results
    //     .map((item) => item.id)
    //     .join(",")}`;
    // }
    //end

    // queryParams += `${
    //   queryParams ? "&" : ""
    // }credit_is=${credit}&debit_is=${debit}`;




    // branch
    // if (inputs && (inputs.branch === "ALL1" )) {
    //   queryParams += ``;
    // } 
    //  else if(inputs && inputs.branch  && (inputs.franchise  && inputs.franchise !== "ALL2")){
    //   queryParams += `&franchise=${inputs.franchise}`;
    // } 
    // else if (inputs && inputs.branch && (!inputs.franchise || inputs.franchise === "ALL2")) {
    //   queryParams += `&branch=${inputs.branch}`;
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

    // fracnhise

    // if (inputs && inputs.franchise === "ALL2" ) {
    //   queryParams += ``;
    // } else if (inputs && inputs.franchise) {
    //   console.log(queryParams,"queryParams")
    //   queryParams += `&franchise=${inputs.franchise}`;
    // }




    return queryParams;
  };

  // get API

  useEffect(() => {
    applyFilteringinUI();
  }, [
    walletLists.appliedFilters, // Remove to handle all in FE
    walletLists.additionalFilters, // Remove to handle all in FE
  ]);

  const applyFilteringinUI = () => { };

  const fetchwalletLists = () => {
    setSearchLoader(true)
    updateWalletLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    adminaxios
      .get(`wallet/v2/transactions?${queryParams}`)
      .then((response) => {
        setSearchLoader(false)
        setSummarydetails(response.data.summary)
        const { data } = response;
        const { counts, count, next, previous, page, results } = data;

        updateWalletLists((prevState) => ({
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
        setSearchLoader(false)
        updateWalletLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
      })
      .finally(function () {
        updateWalletLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });

  };

  // selected rows

  const handleWalletSelectedRows = () => { };
  useEffect(() => {
    fetchwalletLists();
  }, [
    walletLists.currentPageNo,
    walletLists.currentItemsPerPage,
    activeTab,
    walletLists.appliedFilters, // Remove to handle all in FE
    refresh,
    // walletheaderenddate,
    // walletheaderstartdate,
    debit,
    credit,
    // inputs
  ]);

  const handleWalletPerRowsChange = (newPerPage, page) => {
    updateWalletLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleWalletPageChange = (page) => {
    updateWalletLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  const walletIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsWalletDetailsOpen(true);
    adminaxios
      .get(`wallet/ledger/${row.entity_id}`)

      .then((res) => {
        setSelectedid(res.data);
        setFilterselectedid(res.data);
        console.log(res.data);
      });
  };

  const closeCustomizer1 = () => {
    setIsWalletDetailsOpen(false);
  };

  const detailsUpdate = () => {
    RefreshHandler();
    closeCustomizer1();
  };
  const searchInputField = useRef(null);
  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  // table columns list
  const tableColumns = getWalletListsTableColumns({
    walletIdClickHandler,
    RefreshHandler,
  });
  const handlecreditcheckbox = (e) => {
    // let credit_is = true;/

    const data = { ...walletLists };
    const creditValue = e.target.checked;
    setDesedit(e.target.checked);
    // setDebit(false);
    setCredit(creditValue);

    const { pageLoadData } = data;
    if (
      (debit === true && creditValue === true) ||
      (debit === false && creditValue === false)
    ) {
      updateWalletLists(data);
    } else if (debit == false && creditValue === true) {
      let filtered_trans = pageLoadData.filter((item) => item.credit === true);
      // credit_is = false;
      updateWalletLists({ ...data, pageLoadData: filtered_trans });
    } else if (debit == true && creditValue === false) {
      let filtered_trans = pageLoadData.filter((item) => item.credit === false);
      updateWalletLists({ ...data, pageLoadData: filtered_trans });
    }
  };

  const handledebitcheckbox = (e) => {
    // let debit_is = true;

    // const name = e.target.name;
    // const value = e.target.checked
    // if(name == "debit"){
    //   set
    // }
    const data = { ...walletLists };
    const debitValue = e.target.checked;
    setCheckdedit(e.target.checked);
    setDebit(debitValue);
    // setCredit(true);

    const { pageLoadData } = data;
    if (
      (debitValue === true && credit === true) ||
      (debitValue === false && credit === false)
    ) {
      updateWalletLists(data);
    } else if (debitValue == true && credit === false) {
      let filtered_trans = pageLoadData.filter((item) => item.credit === false);
      // debit_is = false;

      updateWalletLists({ ...data, pageLoadData: filtered_trans });
    } else if (debitValue == false && credit === true) {
      let filtered_trans = pageLoadData.filter((item) => item.credit === true);
      updateWalletLists({ ...data, pageLoadData: filtered_trans });
    }
  };


  useEffect(() => {
    (async function () {
      try {
        const [branch] =
          await Promise.allSettled([
            adminaxios.get("accounts/branch/list"),

          ]);

        updateDataForFilters((prevState) => ({
          ...prevState,
          branch: [...(branch?.value?.data || [])],
        }));
      } catch (error) {
        console.log(error, ": error");
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
    })();
  }, []);

  // fucntionality for date range selection
  const basedonrangeselector = (e) => {
    //today
    let reportstartdate = moment().format("YYYY-MM-DD");
    let reportenddate = moment(new Date(), "DD-MM-YYYY").add(1, "day");
    if (e.target.value === "ALL6") {
      setCalender(false);
      reportstartdate = "";
      reportenddate = "";
    }
    if (e.target.value === "today") {
      setCalender(false);
      reportstartdate = moment().format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //yesterday
    else if (e.target.value === "yesterday") {
      setCalender(false);
      reportstartdate = moment().subtract(1, "d").format("YYYY-MM-DD");
      reportenddate = moment().subtract(1, "d").format("YYYY-MM-DD");
    }
    //last 7 days
    else if (e.target.value === "last7days") {
      setCalender(false);

      reportstartdate = moment().subtract(7, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //last week
    else if (e.target.value === "lastweek") {
      setCalender(false);

      reportstartdate = moment()
        .subtract(1, "weeks")
        .startOf("week")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "weeks")
        .endOf("week")
        .format("YYYY-MM-DD");
    }
    //last 30 days
    else if (e.target.value === "last30days") {
      setCalender(false);

      reportstartdate = moment().subtract(30, "d").format("YYYY-MM-DD");
      reportenddate = moment().format("YYYY-MM-DD");
    }
    //end
    // last month
    else if (e.target.value === "lastmonth") {
      reportstartdate = moment()
        .subtract(1, "months")
        .startOf("months")
        .format("YYYY-MM-DD");

      reportenddate = moment()
        .subtract(1, "months")
        .endOf("months")
        .format("YYYY-MM-DD");
    } else if (e.target.value === "custom") {
      setCalender(true);
      // reportstartdate = e.target.value;

      // reportenddate = e.target.value;
    }
    if (e.target.value !== "custom") {
      setCustomstartdate(reportstartdate);
      setCustomenddate(reportenddate);
      setWalletHeaderenddate(reportenddate);

      setWalletHeaderstartdate(reportstartdate);
    }
  };


  //handler for custom date
  const customHandler = (e) => {
    if (e.target.name === "start_date") {
      setCustomstartdate(e.target.value);
      setWalletHeaderstartdate(e.target.value);
    }
    if (e.target.name === "end_date") {
      setCustomenddate(e.target.value);
      setWalletHeaderenddate(e.target.value);
    }
  };

  return (
    <>
      <div style={{ padding: "20px" }}>
        <Grid container spacing={1} id="breadcrumb_margin">
          <Grid item md="12">
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
              {/* Sailaja changed line numbers 943,944 on 13th July */}
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                className="last_typography"
                fontSize="14px"
              >
                Payments
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                className="last_typography"
              >
                Wallet
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid container spacing={1} className=" edit-profile data_table" id="breadcrumb_table">
          <Grid item md="12">
            <WalletHeaderButtons
              walletLists={walletLists}
              openCustomizer={openCustomizer}
              RefreshHandler={RefreshHandler}
              getQueryParams={getQueryParams}
              setWalletHeaderstartdate={setWalletHeaderstartdate}
              filtersData={filtersData}
              updateWalletLists={updateWalletLists}
            />
          </Grid>

          {/* <Grid item md="12">
            <div style={{ display: "flex", marginLeft: "20px" }}>
              <div className="checkbox checkbox-dark">
                <Input
                  id="inline-2"
                  type="checkbox"
                  onChange={handledebitcheckbox}
                  name="debit"
                // checked={debit}
                />
                <Label for="inline-2">Debit</Label>
              </div>
              <div
                className="checkbox checkbox-dark"
                style={{ marginLeft: "20px" }}
              >
                <Input
                  id="inline-1"
                  type="checkbox"
                  onChange={handlecreditcheckbox}
                  name="crebit"
                // checked={credit}
                />
                <Label for="inline-1">Credit</Label>
              </div>
            </div>
          </Grid> */}

          <Grid item md="12">
            <Walletfilter
              handleBranchSelect={handleBranchSelect}
              handleFranchiseSelect={handleFranchiseSelect}
              searchLoader={searchLoader}
              setInputs={setInputs}
              inputs={inputs}
              basedonrangeselector={basedonrangeselector}
              calender={calender}
              customHandler={customHandler}
              customstartdate={customstartdate}
              customenddate={customenddate}
              fetchwalletLists={fetchwalletLists} />
          </Grid>
          <Grid item md="12">
            <WalletBadge
              currentTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={walletLists.tabCounts} />
          </Grid>
          <br />
          <Grid item md="12" style={{ marginTop: "20px" }}>
            <TotalCount summardetails={summardetails} />
          </Grid>
          <Grid
            item
            md="12"
          >
            <>
              <DataTable
                columns={tableColumns}
                data={walletLists.pageLoadData || []}
                noHeader
                onSelectedRowsChange={({ selectedRows }) =>
                  handleWalletSelectedRows(selectedRows)
                }
                progressComponent={
                  <SkeletonLoader loading={walletLists.uiState.loading} />
                }
                selectableRows
                clearSelectedRows={false}
                progressPending={walletLists.uiState.loading}
                pagination
                paginationServer
                paginationTotalRows={walletLists.totalRows}
                onChangeRowsPerPage={handleWalletPerRowsChange}
                onChangePage={handleWalletPageChange}
                noDataComponent={"No Data"}
                openCustomizer={openCustomizer}
              />
            </>
          </Grid>

          <Grid>
            {isWalletDetailsOpen && (
              <NewWalletDetails
                detailsUpdate={detailsUpdate}
                isWalletDetailsOpen={isWalletDetailsOpen}
                closeCustomizer1={closeCustomizer1}
                selectedRow={selectedRow}
                setFilterselectedid={setFilterselectedid}
                filterselectedid={filterselectedid}
                selectedid={selectedid}
                setSelectedid={setSelectedid}
              />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item md="12">
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
                    padding: "30px 25px",
                    borderTopLeftRadius: "20px",
                  }}
                >
                  <i className="icon-close" onClick={closeCustomizer}></i>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
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
export default Newwallet;

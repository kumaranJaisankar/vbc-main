import React, { useState, useEffect, useRef } from "react";
import NewBillingHeaderButtons from "./NewBillingHeaderButtons";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
// import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { classes } from "../../../data/layouts";
// import { Label, Input } from "reactstrap";
import { adminaxios, billingaxios } from "../../../axios";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import { getNewBillingListsTableColumns } from "./data";
import { logout_From_Firebase } from "../../../utils";
// import moment from "moment";
// import { NewWalletDetails } from "./Newwalletdetails";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";


const NewBilling = (props) => {
  const [newBillingLists, updateNewBillingLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    // pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    // appliedFilters: { ...getAppliedFiltersObj() },

    // tabCounts: {},
    totalRows: "",
  });

  const [filtersData, updateDataForFilters] = useState({
    branch: [],
  });
  //   const [activeTab, setActiveTab] = useState("all");
  const [selectedRow, setSelectedRow] = useState({});
  //   const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [showHidePermissionModal, setShowHidePermissionModal] = useState(false);
  const togglePermissionModal = () =>
    setShowHidePermissionModal(!showHidePermissionModal);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );

  // slide panel
  const [activeTab1, setActiveTab1] = useState("1");
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


  // getQueryParams for tabs

  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage } = newBillingLists;

    let queryParams = "";
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    return queryParams;
  };

  // get API

  useEffect(() => {
    applyFilteringinUI();
  }, [
    newBillingLists.appliedFilters, // Remove to handle all in FE
    newBillingLists.additionalFilters, // Remove to handle all in FE
  ]);

  const applyFilteringinUI = () => { };

  const fetchnewBillingLists = () => {
    updateNewBillingLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    billingaxios
      .get(`/payment/v2/list?${queryParams}`)
      .then((response) => {
        const { data } = response;
        const { count, next, previous, page, results } = data;

        updateNewBillingLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          //   tabCounts: { ...count },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          //   pageLoadDataForFilter: [...results],
          totalRows: count,
        }));
      })
      .catch((error) => {
        updateNewBillingLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          //   pageLoadDataForFilter: [],
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
        updateNewBillingLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  // selected rows

  const handleNewBillingSelectedRows = () => { };
  useEffect(() => {
    fetchnewBillingLists();
  }, [
    newBillingLists.currentPageNo,
    newBillingLists.currentItemsPerPage,
    // activeTab,
    newBillingLists.appliedFilters, // Remove to handle all in FE
    refresh,
    // walletheaderenddate,
    // walletheaderstartdate,
    // debit,
    // credit,
  ]);

  const handleNewBillingPerRowsChange = (newPerPage, page) => {
    updateNewBillingLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleNewBillingPageChange = (page) => {
    updateNewBillingLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  const newBillingIdClickHandler = (row) => {
    setSelectedRow(row);
    // setIsWalletDetailsOpen(true);
    // adminaxios
    //   .get(`wallet/ledger/${row.entity_id}`)

    //   .then((res) => {
    //     // setSelectedid(res.data);
    //     // setFilterselectedid(res.data);
    //     console.log(res.data);
    //   });
  };

  const searchInputField = useRef(null);
  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current)
      searchInputField.current.value = "";
  };
  // table columns list
  const tableColumns = getNewBillingListsTableColumns({
    newBillingIdClickHandler,
    RefreshHandler,
  });
  //   const handlecreditcheckbox = (e) => {
  //     // let credit_is = true;/

  //     const data = { ...newBillingLists };
  //     const creditValue = e.target.checked;
  //     setDesedit(e.target.checked);
  //     // setDebit(false);
  //     setCredit(creditValue);

  //     const { pageLoadData } = data;
  //     if (
  //       (debit === true && creditValue === true) ||
  //       (debit === false && creditValue === false)
  //     ) {
  //       updateNewBillingLists(data);
  //     } else if (debit == false && creditValue === true) {
  //       let filtered_trans = pageLoadData.filter((item) => item.credit === true);
  //       // credit_is = false;
  //       updateNewBillingLists({ ...data, pageLoadData: filtered_trans });
  //     } else if (debit == true && creditValue === false) {
  //       let filtered_trans = pageLoadData.filter((item) => item.credit === false);
  //       updateNewBillingLists({ ...data, pageLoadData: filtered_trans });
  //     }
  //   };

  //   const handledebitcheckbox = (e) => {
  //     // let debit_is = true;

  //     // const name = e.target.name;
  //     // const value = e.target.checked
  //     // if(name == "debit"){
  //     //   set
  //     // }
  //     const data = { ...newBillingLists};
  //     const debitValue = e.target.checked;
  //     setCheckdedit(e.target.checked);
  //     setDebit(debitValue);
  //     // setCredit(true);

  //     const { pageLoadData } = data;
  //     if (
  //       (debitValue === true && credit === true) ||
  //       (debitValue === false && credit === false)
  //     ) {
  //       updateNewBillingLists(data);
  //     } else if (debitValue == true && credit === false) {
  //       let filtered_trans = pageLoadData.filter((item) => item.credit === false);
  //       // debit_is = false;

  //       updateNewBillingLists({ ...data, pageLoadData: filtered_trans });
  //     } else if (debitValue == false && credit === true) {
  //       let filtered_trans = pageLoadData.filter((item) => item.credit === true);
  //       updateNewBillingLists({ ...data, pageLoadData: filtered_trans });
  //     }
  //   };
 
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
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

  return (
    <>
      <Container maxWidth="xl" sx={{ paddingTop: "20px" }}>
        <Grid container spacing={1}>
          <Grid item md="12">
            <NewBillingHeaderButtons
              newBillingLists={newBillingLists}
              //   openCustomizer={openCustomizer}
              RefreshHandler={RefreshHandler}
              getQueryParams={getQueryParams}
              tableColumns={tableColumns}
              updateNewBillingLists={updateNewBillingLists}
              //   setWalletHeaderenddate={setWalletHeaderenddate}
              //   setWalletHeaderstartdate={setWalletHeaderstartdate}
              filtersData={filtersData}
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
          <Grid
            item
            md="12"
            sx={{ display: "flex", flexFlow: "column-reverse" }}
          >
            {!newBillingLists.pageLoadData ? (
              <Skeleton
                count={11}
                height={30}
                style={{ marginBottom: "10px", marginTop: "15px" }}
              />
            ) : (
              <>
                <DataTable
                  className="customer-list"
                  columns={tableColumns}
                  data={newBillingLists.pageLoadData || []}
                  noHeader
                  onSelectedRowsChange={({ selectedRows }) =>
                    handleNewBillingSelectedRows(selectedRows)
                  }
                  selectableRows
                  clearSelectedRows={false}
                  progressPending={newBillingLists.uiState.loading}
                  pagination
                  paginationServer
                  paginationTotalRows={newBillingLists.totalRows}
                  onChangeRowsPerPage={handleNewBillingPerRowsChange}
                  onChangePage={handleNewBillingPageChange}
                  noDataComponent={"No Data"}
                //   openCustomizer={openCustomizer}
                />
              </>
            )}
          </Grid>

          {/* <Grid>
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
          </Grid> */}
        </Grid>

        {/* <Grid container spacing={1}>
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
          </Grid> */}
        {/* </Grid> */}
      </Container>
    </>
  );
};
export default NewBilling;

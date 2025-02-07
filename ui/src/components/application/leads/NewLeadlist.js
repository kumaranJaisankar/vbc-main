import React, { useState, useEffect, useRef } from "react";
import { LeadHeaderButtons } from "./LeadHeaderButtons";
import AddLeads from "./addleads";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { classes } from "../../../data/layouts";
import { TabContent, TabPane } from "reactstrap";
import { default as axiosBaseURL } from "../../../axios";
import Skeleton from "react-loading-skeleton";
import { logout_From_Firebase } from "../../../utils";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import {
  getLeadListsTableColumns,
  getAppliedFiltersObj,
} from "./ConstatantData";
import NewLeadUtilityBadge from "../../utilitycomponents/NewLeadUtilityBadge";
import moment from "moment";
import { NewLeadDetails } from "./NewLeadDetails";
import { CorrectLeadRow } from "./Import/correctLeadRow";


const NewLeadList = () => {

  // delete
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [isChecked, setIsChecked] = useState([]);
  const [clearSelection, setClearSelection] = useState(false);
  const [notOpenLeadIdsForDelete, setNotOpenLeadIdsForDelete] = useState([]);
  const [clearSelectedRows, setClearSelectedRows] = useState(false);
  // imort
  const [
    openSetImportPanelCloseConfirmationModal,
    setImportPanelCloseConfirmationModal,
  ] = useState(false);
  const [importDivStatus, setImportDivStatus] = useState(false);
  const [validImportedData, setValidImportedData] = useState([]);
  const [isImportFlow, setIsImportFlow] = useState(false);
  const [invalidImportedData, setInvalidImportedData] = useState([]);
  const [typeby, setTypeby] = useState([]);
  const [statusby, setStatusby] = useState([]);
// const [levelMenu, setLevelMenu] = useState(false);
  // pagination
  const [leadLists, updateleadLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    appliedFilters: { ...getAppliedFiltersObj() },
    currentTab: "all",
    tabCounts: {},
    totalRows: "",
  });

  const [filtersData, updateDataForFilters] = useState({
    lead_source: [],
  });

  const [activeTab, setActiveTab] = useState("all");
  const [selectedRow, setSelectedRow] = useState({});
  const [isLeadDetailsOpen, setIsLeadDetailsOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [showHidePermissionModal, setShowHidePermissionModal] = useState(false);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  // const [rightSidebar, setRightSidebar] = useState(true);
  // lead source
  const [sourceby, setSourceby] = useState([]);
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

  const openCustomizer = (type) => {
    setActiveTab1(type);
    // setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const closeCustomizer = () => {
    setIsImportFlow(false);
    // setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const togglePermissionModal = () =>
      setShowHidePermissionModal(!showHidePermissionModal);
  // getQueryParams for tabs

  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage, appliedFilters } = leadLists;

    let queryParams = "";
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (activeTab !== "all") {
      queryParams += `${queryParams ? "&" : ""}${
        activeTab === moment().format("YYYY-MM-DD") ? "follow_up" : "status"
      }=${"" ? "" : activeTab}`;
    }

    if (appliedFilters.first_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}first_name=${
        appliedFilters.first_name.value.strVal
      }`;
    }
    if (appliedFilters.last_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}last_name=${
        appliedFilters.last_name.value.strVal
      }`;
    }

    if (appliedFilters.lead_source.value.results.length > 0) {
      queryParams += `${queryParams ? "&" : ""
        }lead_source__name=${appliedFilters.lead_source.value.results.map(item => item.id).join(",")}`;
    }

    return queryParams;
  };

  useEffect(() => {
    applyFilteringinUI();
  }, [
    leadLists.appliedFilters, // Remove to handle all in FE
  ]);

  const applyFilteringinUI = () => {}; // Implement this function if we need to handle filtering in UI
  // get API

  const fetchleadLists = () => {
    updateleadLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    axiosBaseURL
      .get(`radius/v2/lead/display?${queryParams}`)
      .then((response) => {
        const { data } = response;
        const { counts, next, previous, page, results } = data;

        updateleadLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: counts[activeTab],
        }));
      })
      .catch((error) => {
        updateleadLists((prevState) => ({
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
     updateleadLists((prevState) => ({
        ...prevState,
        uiState: {
          loading: false,
        },
      }));
    // })
  // }
      });
  };

  // selected rows

  const handleLeadSelectedRows = () => {};
  useEffect(() => {
    fetchleadLists();
  }, [
    leadLists.currentPageNo,
    leadLists.currentItemsPerPage,
    leadLists.appliedFilters, // Remove to handle all in FE
    activeTab,
    refresh,
  ]);

  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };

  const handleLeadPerRowsChange = (newPerPage, page) => {
    updateleadLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleLeadPageChange = (page) => {
    updateleadLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  const leadIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsLeadDetailsOpen(true);
  };

  const closeCustomizer1 = () => {
    setIsLeadDetailsOpen(false);
    // setRightSidebar(!rightSidebar);
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
  const tableColumns = getLeadListsTableColumns({
    leadIdClickHandler,
    RefreshHandler,
  });

  //filter lead source
 
// import file
  const openCorrectDataPanel = () => {
    openCustomizer("4");
  };

  const setImportedData = (validImportedData, invalidData) => {
    setValidImportedData(validImportedData);
    setInvalidImportedData(invalidData);
  };
  // lead source filtersData
  useEffect(() => {
    (async function () {
      try {
        const [lead_source] =
          await Promise.allSettled([
            axiosBaseURL.get("radius/source/display"),
          ]);

       
        updateDataForFilters((prevState) => ({
          ...prevState,
          lead_source: [...(lead_source?.value?.data || [])],
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

// delete

const Verticalcentermodaltoggle = () => {
  if (Verticalcenter == true) {
    setIsChecked([]);
    setClearSelection(true);
  }

  if (isChecked.length > 0) {
    let selectedIdsForDelete = [...isChecked];
    let notOpenLeadIds = selectedIdsForDelete.filter((id) => {
      let data = leadLists.pageLoadData.find((d) => d.id == id);
      return data.status !== "OPEN";
    });
    setNotOpenLeadIdsForDelete(notOpenLeadIds);
    setVerticalcenter(!Verticalcenter);
  } else {
    toast.error("Please select any record", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  }
};
  

 //delete button
 const deleteRows = (selected) => {
  setClearSelection(false);
  let rows = selected.map((ele) => ele.id);
  setIsChecked([...rows]);
};
  // //onside click hide sidebar
  // const box = useRef(null);
  // useOutsideAlerter(box);
  // const ref = useRef();

  // function useOutsideAlerter(ref) {
  //   useEffect(() => {
  //     // Function for click event
  //     function handleOutsideClick(event) {
  //       if (ref.current && !ref.current.contains(event.target)) {
  //         if (rightSidebar && !event.target.className.includes("openmodal")) {
  //           closeCustomizer();
  //         }
  //       }
  //     }

  //     // Adding click event listener
  //     document.addEventListener("click", handleOutsideClick);
  //   }, [ref]);
  // }



  // document.addEventListener("mousedown", (event) => {
  //   const concernedElement = document.querySelector(".import-container");

  //   if (concernedElement && concernedElement.contains(event.target)) {
  //     setImportDivStatus(true);
  //   } else {
  //     if (event.target.className !== "btn btn-primary") {
  //       if (event.target.className !== "icon-import") {
  //         setImportDivStatus(false);
  //       }
  //     }
  //   }
  // });

  return (
    // <div ref={ref}>
    <>
      <Container maxWidth="xl" sx={{ paddingTop: "20px" }}>
        <Grid container spacing={1}>
          <Grid item md="12">
            <LeadHeaderButtons
              leadLists={leadLists}
              openCustomizer={openCustomizer}
              RefreshHandler={RefreshHandler}
              updateleadLists={updateleadLists}
              tableColumns={tableColumns}
              getQueryParams={getQueryParams}
              setImportDivStatus={setImportDivStatus}
              importDivStatus={importDivStatus}
              setIsImportFlow={setIsImportFlow}
              openCorrectDataPanel={openCorrectDataPanel}
              setImportedData={setImportedData}
              detailsUpdate={detailsUpdate}
              openSetImportPanelCloseConfirmationModal={
                openSetImportPanelCloseConfirmationModal
              }
              setImportPanelCloseConfirmationModal={
                setImportPanelCloseConfirmationModal
              }
              closeCustomizer={closeCustomizer}
              filtersData={filtersData}
              Verticalcenter={Verticalcenter}
              Verticalcentermodaltoggle={Verticalcentermodaltoggle}
              notOpenLeadIdsForDelete={notOpenLeadIdsForDelete}
              isChecked={isChecked} setIsChecked={setIsChecked}
              setClearSelectedRows={setClearSelectedRows}
              setClearSelection={setClearSelection}
              
            />
          </Grid>
          <Grid item md="12">
            <NewLeadUtilityBadge
              currentTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={leadLists.tabCounts}
            />
          </Grid>
          <Grid
            item
            md="12"
            sx={{ display: "flex", flexFlow: "column-reverse" }}
          >
            {!leadLists.pageLoadData ? (
              <Skeleton
                count={11}
                height={30}
                style={{ marginBottom: "10px", marginTop: "15px" }}
              />
            ) : (
              <DataTable
                className="customer-list"
                columns={tableColumns}
                data={leadLists.pageLoadData || []}
                noHeader
                onSelectedRowsChange={({ selectedRows }) =>{
                  handleLeadSelectedRows(selectedRows)
                  deleteRows(selectedRows)
                }}
                selectableRows
                // clearSelectedRows={false}
                progressPending={leadLists.uiState.loading}
                clearSelectedRows={clearSelection}
                pagination
                paginationServer
                paginationTotalRows={leadLists.totalRows}
                onChangeRowsPerPage={handleLeadPerRowsChange}
                onChangePage={handleLeadPageChange}
                noDataComponent={"No Data"}
                openCustomizer={openCustomizer}
              />
            )}
          </Grid>
          <Grid>
            {isLeadDetailsOpen && (
              <NewLeadDetails
                detailsUpdate={detailsUpdate}
                isLeadDetailsOpen={isLeadDetailsOpen}
                closeCustomizer1={closeCustomizer1}
                // rightSidebar={rightSidebar}
                selectedRow={selectedRow}
              />
            )}
          </Grid>
        </Grid>

        <Grid container spacing={1}>
          <Grid item md="12">
            <div
              className="customizer-contain"
              // ref={box}
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
                  <i className="icon-close"  onClick={closeCustomizer}></i>
                </div>
              </div>

              <div className="tab-content" id="c-pills-tabContent">
                <div className=" customizer-body custom-scrollbar">
                  <TabContent activeTab={activeTab1} >
                    <TabPane tabId="2">
                      <div id="headerheading"> Add Lead </div>
                      <ul
                        className="layout-grid layout-types"
                        style={{ border: "none" }}
                      >
                        <li
                          data-attr="compact-sidebar"
                          onClick={(e) => handlePageLayputs(classes[0])}
                        >
                          <div className="layout-img">
                            {activeTab1 == "2" && (
                              <AddLeads
                                dataClose={closeCustomizer}
                                onUpdate={detailsUpdate}
                                // rightSidebar={rightSidebar}
                              />
                            )}
                          </div>
                        </li>
                      </ul>
                    </TabPane>
                    <TabPane tabId="4">
                      <h6 style={{ textAlign: "center" }}> Lead Data </h6>
                      <ul
                        className="layout-grid layout-types"
                        style={{ border: "none", overflow: "hidden" }}
                      >
                        <li
                          data-attr="compact-sidebar"
                          onClick={(e) => handlePageLayputs(classes[0])}
                        >
                          <div className="layout-img">
                            <CorrectLeadRow
                              dataClose={closeCustomizer}
                              onUpdate={detailsUpdate}
                              inVaildData={invalidImportedData}
                              updateleadLists={updateleadLists}
                              sourceby={sourceby}
                              typeby={typeby}
                              statusby={statusby}
                            />
                          </div>
                        </li>
                      </ul>
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
    // </div>
  );
};
export default NewLeadList;

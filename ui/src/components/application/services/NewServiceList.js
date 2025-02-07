import React, { useState, useEffect, useRef, useMemo } from "react";
import { ServiceHeaderButtons } from "./ServiceHeaderButtons";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { classes } from "../../../data/layouts";
import { TabContent, TabPane } from "reactstrap";
import { servicesaxios } from "../../../axios";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import { logout_From_Firebase } from "../../../utils";
import {
  getServiceListsTableColumns,
  getAppliedServiceFiltersObj,
} from "./data";
import AddServicePlan from "./addserviceplan";
import { NewServiceDetails } from "./NewServiceDestails";
import NewServiceUtilityBadge from "../../utilitycomponents/NewServiceUtilityBadge";
import { toast } from "react-toastify";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
const NewServiceList = () => {
  const [serviceLists, updateserviceLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    currentTab: "ACT",
    tabCounts: {},
    totalRows: "",
    appliedServiceFilters: { ...getAppliedServiceFiltersObj() },
  });
  const [showHidePermissionModal, setShowHidePermissionModal] = useState(false);
  const [activeTab, setActiveTab] = useState("ACT");
  const [selectedRow, setSelectedRow] = useState({});
  const [isServiceDetailsOpen, setIsServiceDetailsOpen] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [rightSidebar, setRightSidebar] = useState(true);
  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );

  // combo buttons
  const [addCombo, setAddCombo] = useState(0);
  // slide panel
  const [activeTab1, setActiveTab1] = useState("1");
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [serviceSelectedCheckboxObjects, setServiceSelectedCheckboxObjects] =
    useState({});
  var updateBysub = false;

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
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  const togglePermissionModal = () =>
    setShowHidePermissionModal(!showHidePermissionModal);
  // getQueryParams for tabs

  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage, appliedServiceFilters } =
      serviceLists;

    let queryParams = "";
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    queryParams += `${queryParams ? "&" : ""}status=${activeTab}`;

    if (appliedServiceFilters.package_name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}plan_name=${
        appliedServiceFilters.package_name.value.strVal
      }`;
    }
    return queryParams;
  };

  // get API

  const fetchserviceLists = () => {
    updateserviceLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    servicesaxios
      .get(`plans/v3/list?${queryParams}`)
      .then((response) => {
        const { data } = response;
        const { count, counts, next, previous, page, results } = data;

        updateserviceLists((prevState) => ({
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
      // .catch((error) => {
      //   toast.error("Something went wrong", {
      //     position: toast.POSITION.TOP_RIGHT,
      //     autoClose:1000
      //   });
      //   updateserviceLists((prevState) => ({
      //     ...prevState,
      //     currentPageNo: 1,
      //     currentItemsPerPage: 10,
      //     pageLoadData: [],
      //     pageLoadDataForFilter: [],
      //     prevURI: null,
      //     nextURI: null,
      //   }));
      // })

      .catch(function (error) {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is500Error) {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else if (is404Error) {
          toast.error("API mismatch", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        } else {
          toast.error("Something went wrong", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }
      })

      .finally(function () {
        updateserviceLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      })
      .finally(function () {
        updateserviceLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  const subCheckboxHandler = (e, rowid, subid) => {
    var selectedCheckboxes = { ...serviceSelectedCheckboxObjects };

    var currentRowList = selectedCheckboxes[rowid]
      ? selectedCheckboxes[rowid]
      : [];

    if (e.target.checked) {
      currentRowList.push(subid);
      if (!selectedCheckboxes[rowid]) {
        selectedCheckboxes[rowid] = [subid];
      } else {
        selectedCheckboxes[rowid] = [...selectedCheckboxes[rowid], subid];
      }
    } else {
      currentRowList = currentRowList.filter((f) => f != subid);
    }

    var newpageLoadData = [...serviceLists.pageLoadData].map((l) => {
      return {
        ...l,
        isSelected: false,
      };
    });
    selectedCheckboxes[rowid] = [...new Set([...currentRowList])];
    setAddCombo([...new Set([...currentRowList])].length);

    for (let k in selectedCheckboxes) {
      let key = parseInt(k);
      var currentRow = newpageLoadData.find((a) => a.id == key);
      var currentRowIndex = newpageLoadData.findIndex((a) => a.id == key);
      currentRow.isSelected = false;
      if (currentRow && currentRow.sub_plans == null) {
        currentRow.isSelected = true;
      } else {
        currentRow.isSelected =
          currentRow.sub_plans.length == selectedCheckboxes[key].length;
      }

      newpageLoadData[currentRowIndex] = currentRow;
    }

    setServiceSelectedCheckboxObjects({ ...selectedCheckboxes });
    updateBysub = true;
    updateserviceLists((prevState) => ({
      ...prevState,
      pageLoadData: [...newpageLoadData],
    }));
  };

  // selected rows

  const handleServiceSelectedRows = (row, count, allselected) => {
    const rowIds = row.map((list) => list.id);

    var selectedCheckboxes = { ...serviceSelectedCheckboxObjects };
    for (let i = 0; i < row.length; i++) {
      const subplansIds = row[i].sub_plans
        ? row[i].sub_plans.map((list) => list.id)
        : [];
      selectedCheckboxes[row[i].id] = [...subplansIds];
    }

    for (let k in selectedCheckboxes) {
      let key = parseInt(k);
      if (!rowIds.includes(key)) {
        var newpageLoadData = [...serviceLists.pageLoadData];
        var currentRow = newpageLoadData.find((a) => a.id == key);
        if (currentRow && !!currentRow.sub_plans) {
          if (selectedCheckboxes[key].length == currentRow.sub_plans.length) {
            selectedCheckboxes = { ...selectedCheckboxes, [key]: [] };
          }
        } else {
          delete selectedCheckboxes[key];
        }
      }
    }

    setServiceSelectedCheckboxObjects({ ...selectedCheckboxes });
  };

  useEffect(() => {
    fetchserviceLists();
  }, [
    serviceLists.currentPageNo,
    serviceLists.currentItemsPerPage,
    activeTab,
    refresh,
    serviceLists.appliedServiceFilters,
  ]);

  const handleServicePerRowsChange = (newPerPage, page) => {
    updateserviceLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handleServicePageChange = (page) => {
    updateserviceLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };
  // side panel
  const serviceIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsServiceDetailsOpen(true);
  };

  const closeCustomizer1 = () => {
    setRightSidebar(!rightSidebar);
    setIsServiceDetailsOpen(false);
  };

  const detailsUpdate = () => {
    RefreshHandler();
    closeCustomizer1();
  };
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };
  const searchInputField = useRef(null);
  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };
  // table columns list
  const tableColumns = getServiceListsTableColumns({
    serviceIdClickHandler,
    serviceSelectedCheckboxObjects,
    subCheckboxHandler,
    RefreshHandler,
  });

  const callAPIforActiveInctive = () => {
    var planList = [];
    var selectedCheckboxes = { ...serviceSelectedCheckboxObjects };

    for (let key in selectedCheckboxes) {
      var newpageLoadData = [...serviceLists.pageLoadData];
      var currentRow = newpageLoadData.find((a) => a.id == key);
      if (currentRow && !!currentRow.sub_plans) {
        if (selectedCheckboxes[key].length == currentRow.sub_plans.length) {
          planList = [...planList, ...selectedCheckboxes[key], key];
        } else {
          planList = [...planList, ...selectedCheckboxes[key]];
        }
      } else {
        planList = [...planList, key];
      }
    }
    const formData = {
      plans: [...planList],
      status: activeTab == "IN" ? "ACT" : "IN",
    };
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    servicesaxios
      .post("/plans/status/change", formData, config)
      .then((response) => {
        console.log(response.data);
        // props.onUpdate(response.data);
        // Sailaja Modified Toast message from plan update successfully to Plan updated successfully on 28th March 2023
        toast.success("Plan updated successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        RefreshHandler();
      })
      .catch(function (error) {
        toast.error("Something went wrong!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };
  // function for checkbox selection in dataTable
  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="check" />
    </div>
  ));

  const conditionalRowStyles = [
    {
      when: (row) => row.selected === true,
      style: {
        backgroundColor: "#E4EDF7",
      },
    },
  ];
  // const handleSelectedRows = (selectedRows) => {
  //   const tempFilteredData =
  //     filteredData.map((item) => ({ ...item, selected: false })) || [];
  //   const selectedIds = selectedRows.map((item) => item.id);
  //   const temp = tempFilteredData.map((item) => {
  //     if (selectedIds.includes(item.id)) return { ...item, selected: true };
  //     else return { ...item, selected: false };
  //   });
  //   setFiltereddata(temp);
  // };

  return (
    <>
      <div style={{ paddingTop: "20px" }}>
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
                Business Operations
              </Typography>
              {/* Sailaja Changed  Service Plan Color from Breadcrumbs  on 13th July */}

              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color=" #00000"
                fontSize="14px"
                className="last_typography"
              >
                Services
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                fontSize="14px"
                className="last_typography"
              >
                Internet Plans
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid
          container
          spacing={1}
          className="data_table"
          id="breadcrumb_table"
        >
          <Grid item md="12">
            <ServiceHeaderButtons
              serviceLists={serviceLists}
              openCustomizer={openCustomizer}
              RefreshHandler={RefreshHandler}
              setAddCombo={setAddCombo}
              addCombo={addCombo}
              activeTab={activeTab}
              callAPIforActiveInctive={callAPIforActiveInctive}
              updateserviceLists={updateserviceLists}
            />
          </Grid>
          <Grid item md="12">
            <NewServiceUtilityBadge
              currentTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={serviceLists.tabCounts}
            />
          </Grid>
          <Grid item md="12">
            <DataTable
              className="service-list"
              columns={tableColumns}
              data={serviceLists.pageLoadData || []}
              noHeader
              onSelectedRowsChange={({
                allSelected,
                selectedCount,
                selectedRows,
              }) => {
                setAddCombo(selectedCount);
                handleServiceSelectedRows(
                  selectedRows,
                  selectedCount,
                  allSelected
                );
              }}
              conditionalRowStyles={conditionalRowStyles}
              selectableRows
              selectableRowsComponent={NewCheckbox}
              selectableRowSelected={(row) => row.isSelected}
              clearSelectedRows={false}
              progressPending={serviceLists.uiState.loading}
              progressComponent={
                <SkeletonLoader loading={serviceLists.uiState.loading} />
              }
              pagination
              paginationServer
              paginationTotalRows={serviceLists.totalRows}
              onChangeRowsPerPage={handleServicePerRowsChange}
              onChangePage={handleServicePageChange}
              noDataComponent={"No Data"}
              openCustomizer={openCustomizer}
            />
          </Grid>

          <Grid>
            {isServiceDetailsOpen && (
              <NewServiceDetails
                detailsUpdate={detailsUpdate}
                isServiceDetailsOpen={isServiceDetailsOpen}
                closeCustomizer1={closeCustomizer1}
                selectedRow={selectedRow}
                RefreshHandler={RefreshHandler}
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
                  <i
                    className="icon-close"
                    style={{ position: "absolute", top: "20px" }}
                    onClick={closeCustomizer}
                  ></i>
                </div>
              </div>

              <div className="tab-content" id="c-pills-tabContent">
                <div className=" customizer-body custom-scrollbar">
                  <TabContent activeTab={activeTab1}>
                    <TabPane tabId="2">
                      <div id="headerheading"> Add New Plan </div>
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
                              <AddServicePlan
                                dataClose={closeCustomizer}
                                onUpdate={detailsUpdate}
                                rightSidebar={rightSidebar}
                              />
                            )}
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
export default NewServiceList;

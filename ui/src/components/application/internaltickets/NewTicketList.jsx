import React, { useState, useEffect,useRef } from "react";
import Grid from "@mui/material/Grid";
import { TicketHeaderButtons } from "./TicketHeaderButtons";
import AddTicket from "../internaltickets/addticket";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { classes } from "../../../data/layouts";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { Row, Col, TabContent, TabPane } from "reactstrap";
import { helpdeskaxios } from "../../../axios";
import { getTicketListsTableColumns } from "./TicketConstantData";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import Container from "@mui/material/Container";
import NewTicketUtilityBadge from "../../utilitycomponents/NewTicketUtilityBadge"
import {NewTicketDetails} from "./NewTicektDetails"
const NewTicketList = () => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const [activeTab1, setActiveTab1] = useState("1");
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  const [ticketLists, updateTicketLists] = useState({
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
  });
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [refresh, setRefresh] = useState(0);  
  const [selectedRow, setSelectedRow] = useState({});
  const [isTicketDetailsOpen, setIsTicektDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isDirty, setIsDirty] = useState(false);
  const [data, setData] = useState([]);
  const [lead, setLead] = useState([]);


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
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  const openCustomizer = (type) => {
    setActiveTab1(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };


  const closeCustomizer = () => {
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage, appliedFilters } = ticketLists;

    let queryParams = "";
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (activeTab !== "all") {
      queryParams += `${queryParams ? "&" : ""}category=${activeTab}`;
    }

    return queryParams;
  };

 

  const fetchticketLists = () => {
    updateTicketLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    helpdeskaxios
      .get(`/v2/list/ticket?${queryParams}`)
      .then((response) => {
        const { data } = response;
        const { counts,count, next, previous, page, results } = data;

        updateTicketLists((prevState) => ({
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
        updateTicketLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
      });
  };

  const handleSelectedRows = () => {};
  useEffect(() => {
    fetchticketLists();
  }, [
    ticketLists.currentPageNo,
    ticketLists.currentItemsPerPage,
    activeTab,
  ]);

  const handlePerRowsChange = (newPerPage, page) => {
    updateTicketLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateTicketLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  

  

  const searchInputField = useRef(null);
  //refresh page
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };

  // sidepanel

  const ticketIdClickHandler = (row) => {
    setSelectedRow(row);
    setIsTicektDetailsOpen(true);
  };

  const closeCustomizer1 = () => {
    setIsTicektDetailsOpen(false);
  };

  // detailsuptade
  const detailsUpdate = () => {
    RefreshHandler();
    closeCustomizer1();
  };

// columns
  const tableColumns = getTicketListsTableColumns({
    ticketIdClickHandler,RefreshHandler
  });
  return (
    <Container maxWidth="xl" sx={{ paddingTop: "20px" }}>
      <Grid container spacing={1}>
        <Grid item md="12">
          <TicketHeaderButtons openCustomizer={openCustomizer}  RefreshHandler={RefreshHandler} ticketLists={ticketLists} getQueryParams={getQueryParams}/>
        </Grid>
        <Grid item md="12">
            <NewTicketUtilityBadge
              currentTab={activeTab}
              setActiveTab={setActiveTab}
              tabCounts={ticketLists.tabCounts}
            />
          </Grid>

        <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse" }}>
          {!ticketLists.pageLoadData ? (
            <Skeleton
              count={11}
              height={30}
              style={{ marginBottom: "10px", marginTop: "15px" }}
            />
          ) : (
            <DataTable
              className="customer-list"
              columns={tableColumns}
              data={ticketLists.pageLoadData || []}
              noHeader
              onSelectedRowsChange={({ selectedRows }) =>
                handleSelectedRows(selectedRows)
              }
              selectableRows
              clearSelectedRows={false}
              
              pagination
              paginationServer
              paginationTotalRows={ticketLists.totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noDataComponent={"No Data"}
            />
          )}
        </Grid>
        <Grid>
            {isTicketDetailsOpen && (
              <NewTicketDetails
                detailsUpdate={detailsUpdate}
                isTicketDetailsOpen={isTicketDetailsOpen}
                closeCustomizer1={closeCustomizer1}
                selectedRow={selectedRow}
              />
            )}
          </Grid>
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
                    padding: "30px 25px",
                    borderTopLeftRadius: "20px",
                  }}
                >
                  <i className="icon-close" onClick={closeCustomizer}></i>
                </div>
              </div>

              <div className="tab-content" id="c-pills-tabContent">
                <div className=" customizer-body custom-scrollbar">
                  <TabContent activeTab={activeTab1}>
                    <TabPane tabId="2">
                      <div id="headerheading"> Add Ticket </div>
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
                              <AddTicket
                              dataClose={closeCustomizer}
                              onUpdate={detailsUpdate}
                              
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
          </Col>
        </Row>
      </Grid>
    </Container>
  );
};
export default NewTicketList;

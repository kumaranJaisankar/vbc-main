import React, { useState, useEffect, useRef, useMemo } from "react";
import Grid from "@mui/material/Grid";
import DataTable from "react-data-table-component";
import { FranchiseHeaderButtons } from "./FranchiseHeaderButtons";
import { getNewFranchiseTableColumns } from "./data";
import { franchiseaxios, adminaxios } from "../../../../axios";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { classes } from "../../../../data/layouts";
import AddFranchise from "../addfranchise";
import { logout_From_Firebase } from "../../../../utils";
import { toast } from "react-toastify";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import { getAdditionalFiltersObj } from "./data";
import { AllFranchiseDetails } from "../franchisedetails/allfranchisedetails";
import PermissionModal from "../../../common/PermissionModal";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { ModalTitle, CopyText, Cancel } from "../../../../constant";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Modal,
  Button,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";

// Sailaja imported common component Sorting on 28th March 2023
import { Sorting } from "../../../common/Sorting";

const NewFranchiseLists = (initialValues) => {
  const [franchiseLists, updateFranchiseLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    totalRows: "",
    appliedFilters: { ...getAdditionalFiltersObj() },
    currentTab: "all",
  });
  const [filtersData, updateDataForFilters] = useState({
    branch: [],
    zone: [],
    area: [],
    franchiseBranches: [],
    franchiseBranchesBackUp: [],
    franchises: [],
    franchisesBackUp: [],
  });
  const [permissionmodal, setPermissionModal] = useState();

  const [activeTab, setActiveTab] = useState("All");
  const [isFranchiseDetailsOpen, setIsFranchiseDetailsOpen] = useState(false);
  const [formDataForSaveInDraft, setformDataForSaveInDraft] = useState({});
  const [loading, setLoading] = useState(false);
  //states for filters
  const [inputs, setInputs] = useState({});
  const [franchisesms, setFranchisesms] = useState([]);
  const [franchisetype, setFranchisetype] = useState([]);
  const [franchisestatus, setFranchisestatus] = useState([]);
  //end
  const [loader, setLoader] = useState(false);

  const [permissionModalText, setPermissionModalText] = useState(
    "You are not authorized for this action"
  );
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const [refresh, setRefresh] = useState(0);
  const [showHidePermissionModal, setShowHidePermissionModal] = useState(false);
  const togglePermissionModal = () =>
    setShowHidePermissionModal(!showHidePermissionModal);
  // addding franchise

  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [filteredDataBkp, setFiltereddataBkp] = useState(data);
  const [filteredDataForModal, setFilteredDataForModal] =
    useState(filteredData);
  // slide panel
  const [lead, setLead] = useState([]);
  const [isChecked, setIsChecked] = useState([]);
  const [clearSelection, setClearSelection] = useState(false);
  const [isDirtyModal, setisDirtyModal] = useState(false);
  const [isExportDataModalOpen, setIsExportDataModalToggle] = useState(false);
  const [headersForExport, setHeadersForExport] = useState([]);
  const [modal, setModal] = useState();

  const [activeTab1, setActiveTab1] = useState("1");
  const configDB = useSelector((content) => content.Customizer.customizer);
  const [rightSidebar, setRightSidebar] = useState(true);
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const Verticalcentermodaltoggle = () => {
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
      // return false;
    }
  };

  useEffect(() => {
    adminaxios
      .get(`franchise/options`)
      .then((res) => {
        let { status, type, sms } = res.data;
        // setFranchisesms([...sms]);
        // Sailaja sorting the Franchise Module -> SMS Gateway Dropdown data as alphabetical order on 28th March 2023
        setFranchisesms(Sorting([...sms], "name"));
        // Sailaja sorting the Franchise Module -> Status * Dropdown data as alphabetical order on 28th March 2023
        setFranchisesms(Sorting([...sms], "name"));
        // setFranchisestatus([...status]);
        setFranchisestatus(Sorting([...status], "name"));

        //setFranchisetype([...type])
        // Sailaja sorting the Franchise Module -> Franchise Type Dropdown data as alphabetical order on 28th March 2023
        setFranchisetype(Sorting([...type], "name"));
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //dynamic options
  // useEffect(() => {
  //   //franchiselist
  //   franchiseaxios
  //     .get("/franchise/options")
  //     .then((res) => {
  //       let { type } = res.data;
  //       setFranchiseType([...type]);
  //     })
  //     .catch((err) => console.log(err));
  // }, []);
  const headersForExportFile = [
    ["all", "All"],
    ["name", "Franchise Name"],
    ["code", "Franchise Code"],
    ["type", "Type"],
    ["status", "Status"],
    ["wallet_amount", "Current Balance"],
    ["renewal_amount", "Renewal Balance"],
    ["outstanding_balance", "Outstanding Balance"],
    ["created_at", "Created Date"],
    ["updated_at", "Updated Date"],
    ["customer_count", "No of Customers"],
    ["sms_gateway_type", "SMS Gateway"],
    ["branch", "Branch"],
    ["nas_type", "NAS Type"],
    ["address", "Address"],
  ];

  const headersForExcel = [
    ["all", "All"],
    ["name", "Franchise Name"],
    ["code", "Franchise Code"],
    ["type", "Type"],
    ["status", "Status"],
    ["wallet_amount", "Current Balance"],
    ["renewal_amount", "Renewal Balance"],
    ["outstanding_balance", "Outstanding Balance"],
    ["created_at", "Created Date"],
    ["updated_at", "Updated Date"],
    ["customer_count", "No of Customers"],
    ["sms_gateway_type", "SMS Gateway"],
    ["branch", "Branch"],
    ["nas_type", "NAS Type"],
    ["address", "Address"],
  ];
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

  const openCustomizer = (type, id) => {
    console.log(id);
    if (id) {
      setLead(id);
    }
    const getLocalDraftKey = localStorage.getItem("franchiseDraftSaveKey");
    if (!!getLocalDraftKey) {
      const getLocalDraftData = localStorage.getItem(getLocalDraftKey);
      setLead(JSON.parse(getLocalDraftData));
    }
    setActiveTab1(type);
    console.log(type);
    document.querySelector(".customizer-contain").classList.add("open");
  };
  // const closeCustomizer = () => {
  //   document.querySelector(".customizer-contain").classList.remove("open");
  // };
  const handleExportclose = () => {
    setIsExportDataModalToggle(false);
    setHeadersForExport([]);
  };

  const closeCustomizer = (value) => {
    // draft
    if (isDirty && value) {
      setisDirtyModal(true);
    } else {
      closeDirtyModal();
    }
  };
  const closeDirtyModal = () => {
    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    localStorage.removeItem("franchise/");
    localStorage.removeItem("franchiseDraftSaveKey");
    setIsDirty(false);
    //setLead({});
  };
  // Passing QueryParams for NewFranchise
  console.log(inputs, "inputs");
  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage, appliedFilters } =
      franchiseLists;

    let queryParams = "";
    // queryParams += connection;
    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (appliedFilters.name.value.strVal) {
      queryParams += `${queryParams ? "&" : ""}name=${
        appliedFilters.name.value.strVal
      }`;
    }
    if (inputs && inputs.filterbranch === "ALL") {
      queryParams += ``;
    } else if (inputs && inputs.filterbranch) {
      queryParams += `${queryParams ? "&" : ""}branch=${inputs.filterbranch}`;
    }
    if (inputs && inputs.franchisetypee === "ALL2") {
      console.log(inputs.franchisetypee, "inputs.franchisetypee");
      queryParams += ``;
    } else if (inputs && inputs.franchisetypee) {
      queryParams += `${queryParams ? "&" : ""}type=${inputs.franchisetypee}`;
    }

    if (inputs && inputs.franchisesmsgatewayy === "ALL4") {
      queryParams += ``;
    } else if (inputs && inputs.franchisesmsgatewayy) {
      queryParams += `${queryParams ? "&" : ""}sms_gateway_type=${
        inputs.franchisesmsgatewayy
      }`;
    }
    return queryParams;
  };

  // Calling fetchFranchiseLists()
  useEffect(() => {
    fetchFranchiseLists();
  }, [
    franchiseLists.currentPageNo,
    franchiseLists.currentItemsPerPage,
    refresh,
    franchiseLists.appliedFilters,
    // inputs,
  ]);

  const fetchFranchiseLists = () => {
    setLoader(true);
    updateFranchiseLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));

    // Fetching Data from API
    const queryParams = getQueryParams();
    franchiseaxios
      .get(`franchise/v2/display?${queryParams}`)
      .then((response) => {
        setLoader(false);
        const { data } = response;
        const { counts, next, previous, page, results } = data;

        updateFranchiseLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          totalRows: counts,
        }));
      })
      .catch((error) => {
        setLoader(false);
        updateFranchiseLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
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
        updateFranchiseLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };
  // Handling rows per page with handlePerRowsChange()
  const handlePerRowsChange = (newPerPage, page) => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  //Handling pages with handlePageChange()
  const handlePageChange = (page) => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  const NewFranchiseNameClickHandler = (row) => {};

  const searchInputField = useRef(null);

  //NewRefreshPage
  const RefreshHandler = () => {
    setRefresh((prevValue) => prevValue + 1);
    if (searchInputField.current) searchInputField.current.value = "";
  };

  // table columns list
  const tableColumns = getNewFranchiseTableColumns({
    NewFranchiseNameClickHandler,
    RefreshHandler,
    openCustomizer,
  });

  const handleSelectedRows = () => {};

  const detailsUpdate = (updatedata) => {
    console.log(updatedata);
    setData([...data, updatedata]);
    // setFiltereddata((prevFilteredData) => [...prevFilteredData, updatedata]);
    setFiltereddata((prevFilteredData) =>
      prevFilteredData.map((data) =>
        data.id == updatedata.id ? updatedata : data
      )
    );
    closeCustomizer(false);
    RefreshHandler();
  };
  const logout = () => {
    logout_From_Firebase();
    history.push(`${process.env.PUBLIC_URL}/login`);
  };
  const setIsDirtyFun = (val) => {
    setIsDirty(val);
  };

  const NewCheckbox = React.forwardRef(({ onClick, ...rest }, ref) => (
    <div className="checkbox_header">
      <input
        type="checkbox"
        class="new-checkbox"
        ref={ref}
        onClick={onClick}
        {...rest}
      />
      <label className="form-check-label" id="booty-check" />
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
  const box = useRef(null);

  //modal for insufficient modal
  const permissiontoggle = () => {
    setPermissionModal(!permissionmodal);
  };
  //end
  //draft start
  const saveDataInDraftAndCloseModal = () => {
    localStorage.setItem("franchise/", JSON.stringify(formDataForSaveInDraft));
    localStorage.setItem("franchiseDraftSaveKey", "franchise/");

    setisDirtyModal(false);
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
    setIsDirty(false);
  };

  // new records update in table

  const update = (newRecord) => {
    setData([...data, newRecord]);
    // setFiltereddata([...data, newRecord]);
    setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    closeCustomizer(false);
    RefreshHandler();
  };

  const toggle = () => {
    setModal(!modal);
  };
  return (
    <>
      <div style={{ padding: "20px" }}>
        <Grid container spacing={1} id="breadcrumb_margin">
          <Grid item md="12">
            <Breadcrumbs
              aria-label="breadcrumb "
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
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="#00000 !important"
                fontSize="14px"
                className="last_typography"
              >
                Franchise
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <br />
        <br />
        <Grid
          container
          spacing={1}
          className=" edit-profile data_table"
          id="breadcrumb_table"
        >
          <Grid item md="12">
            <FranchiseHeaderButtons
              headersForExcel={headersForExcel}
              loader={loader}
              setLoader={setLoader}
              fetchFranchiseLists={fetchFranchiseLists}
              headersForExportFile={headersForExportFile}
              RefreshHandler={RefreshHandler}
              franchiseLists={franchiseLists}
              filtersData={filtersData}
              updateFranchiseLists={updateFranchiseLists}
              tableColumns={tableColumns}
              getQueryParams={getQueryParams}
              openCustomizer={openCustomizer}
              setActiveTab1={setActiveTab1}
              activeTab1={activeTab1}
              // franchiseType={franchiseType}
              setFiltereddata={setFiltereddata}
              filteredData={filteredData}
              filteredDataBkp={filteredDataBkp}
              setFiltereddataBkp={setFiltereddataBkp}
              loading={loading}
              setLoading={setLoading}
              inputs={inputs}
              setInputs={setInputs}
              currentTab={activeTab}
              franchisesms={franchisesms}
              franchisetype={franchisetype}
              franchisestatus={franchisestatus}
            />
          </Grid>
          <br />
          <Grid item md="12">
            {/* {!franchiseLists.pageLoadData ?  */}
            <DataTable
              className="franchise-list"
              columns={tableColumns}
              data={franchiseLists.pageLoadData || []}
              noHeader
              onSelectedRowsChange={({ selectedRows }) =>
                handleSelectedRows(selectedRows)
              }
              progressComponent={
                <SkeletonLoader loading={franchiseLists.uiState.loading} />
              }
              selectableRows
              selectableRowsComponent={NewCheckbox}
              conditionalRowStyles={conditionalRowStyles}
              clearSelectedRows={false}
              progressPending={franchiseLists.uiState.loading}
              pagination
              paginationServer
              paginationTotalRows={franchiseLists.totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noDataComponent={"No Data"}
            />
            {/* :""
            } */}
          </Grid>
          <Row>
            <Col md="12">
              <div
                className="customizer-contain"
                ref={box}
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
                      borderTopLeftRadius: "20px",
                    }}
                  >
                    <br />
                    <i
                      className="icon-close"
                      onClick={() => closeCustomizer(true)}
                    ></i>
                    <br />

                    <Modal
                      isOpen={modal}
                      toggle={toggle}
                      className="modal-body"
                      centered={true}
                    >
                      <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
                      <ModalFooter>
                        <CopyToClipboard text={JSON.stringify(configDB)}>
                          <Button
                            color="primary"
                            className="notification"
                            onClick={() =>
                              toast.success("Code Copied to clipboard !", {
                                position: toast.POSITION.BOTTOM_RIGHT,
                              })
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
                  </div>
                  <div className=" customizer-body custom-scrollbar">
                    <TabContent activeTab={activeTab1}>
                      <TabPane tabId="2">
                        <div id="headerheading"> Add New Franchise </div>
                        <ul
                          className="layout-grid layout-types"
                          style={{ border: "none" }}
                        >
                          <li
                            data-attr="compact-sidebar"
                            onClick={(e) => handlePageLayputs(classes[0])}
                          >
                            <div className="layout-img">
                              {activeTab1 == 2 && (
                                <AddFranchise
                                  dataClose={closeCustomizer}
                                  onUpdate={(data) => update(data)}
                                  rightSidebar={rightSidebar}
                                  setIsDirtyFun={setIsDirtyFun}
                                  setformDataForSaveInDraft={
                                    setformDataForSaveInDraft
                                  }
                                  lead={lead}
                                />
                              )}
                            </div>
                          </li>
                        </ul>
                      </TabPane>
                      <TabPane tabId="3">
                        <div id="headerheading">
                          {" "}
                          <span> Franchise Information : {lead.name} </span>
                          <span style={{ marginLeft: "30px" }}>
                            ID: F{lead.id}
                          </span>
                        </div>

                        <AllFranchiseDetails
                          lead={lead}
                          setLead={setLead}
                          onUpdate={(data) => detailsUpdate(data)}
                          rightSidebar={rightSidebar}
                          dataClose={closeCustomizer}
                          detailsUpdate={detailsUpdate}
                          openCustomizer={openCustomizer}
                          Refreshhandler={RefreshHandler}
                          franchisesms={franchisesms}
                          franchisetype={franchisetype}
                          franchisestatus={franchisestatus}
                        />
                      </TabPane>
                    </TabContent>
                  </div>
                </div>
              </div>
            </Col>

            {/* modal */}
            <Modal
              isOpen={Verticalcenter}
              toggle={Verticalcentermodaltoggle}
              centered
            >
              <ModalHeader toggle={Verticalcentermodaltoggle}>
                Confirmation
              </ModalHeader>
              <ModalBody>
                <div>
                  {isChecked.map((id) => (
                    <span>F{id},</span>
                  ))}
                </div>
                <p>Are you sure you want to delete?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onClick={Verticalcentermodaltoggle}>
                  No
                </Button>
                <Button
                  color="primary"
                  // onClick={() => onDelete()}
                >
                  Yes
                </Button>
              </ModalFooter>
            </Modal>
            {/* modal for insufficient permissions */}
            <PermissionModal
              content={permissionModalText}
              visible={permissionmodal}
              handleVisible={permissiontoggle}
            />
            {/* end */}
            {/* draft modal start*/}
            <Modal
              isOpen={isDirtyModal}
              toggle={() => setisDirtyModal(!isDirtyModal)}
              className="modal-body"
              centered={true}
            >
              <ModalHeader toggle={() => setisDirtyModal(!isDirtyModal)}>
                {"Confirmation"}
              </ModalHeader>
              <ModalBody>Do you want to save this data in draft?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  className="notification"
                  onClick={saveDataInDraftAndCloseModal}
                >
                  {"Save as Draft"}
                </Button>

                <Button id="resetid" onClick={() => closeDirtyModal()}>
                  {"Close"}
                </Button>
              </ModalFooter>
            </Modal>
            {/* draft modal end */}
            {/* export */}

            <Modal
              isOpen={isExportDataModalOpen}
              toggle={() => {
                setIsExportDataModalToggle(!isExportDataModalOpen);
                setFilteredDataForModal(filteredData);
                setHeadersForExport([]);
              }}
              centered
            >
              <ModalBody>
                <h5>Select the Fields Required</h5>
                <hr />

                <div>
                  {headersForExportFile.map((column, index) => (
                    <span style={{ display: "block" }}>
                      <label for={column[1]} key={`${column[1]}${index}`}>
                        <input
                          value={column[0]}
                          // onChange={handleCheckboxChange}
                          type="checkbox"
                          name={column[1]}
                          checked={headersForExport.includes(column[0])}
                        />
                        &nbsp; {column[1]}
                      </label>
                    </span>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="secondary"
                  id="resetid"
                  onClick={handleExportclose}
                >
                  {"Close"}
                </Button>
                <button
                  color="primary"
                  id="download_button1"
                  className="btn btn-primary openmodal"
                  // onClick={() => handleDownload()}
                  disabled={headersForExport.length > 0 ? false : true}
                >
                  <span className="openmodal">Download</span>
                </button>
              </ModalFooter>
            </Modal>
          </Row>
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
export default NewFranchiseLists;

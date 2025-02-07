import React, { useState, useEffect,useRef } from "react";
import Grid from "@mui/material/Grid";
import OfferHeaderButtons from "./OfferHeaderButtons";
import { servicesaxios } from "../../../../axios";
import DataTable from "react-data-table-component";
import { getofferListsTableColumns } from "./data";
import AddNewOffer from "./AddNewOffer";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { classes } from "../../../../data/layouts";
import { TabContent, TabPane } from "reactstrap";
import useDataTable from "./use-data-table"
// import { toast } from "react-toastify"
import { SERVICEPLAN } from "../../../../utils/permissions";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import Skeleton from "react-loading-skeleton";
import ErrorModal from "../../../common/ErrorModal";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const OfferList = () => {
  // slide panel
  const [rightSidebar, setRightSidebar] = useState(true);
  const [activeTab1, setActiveTab1] = useState("1");
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
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
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.add("open");
  };

  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  // Passing QueryParams for Offerlist

  const {
    // loadingTable,
    tableData,
    setTableData,
    // setLoadingTable,
    getQueryParams,
    handlePageChange,
    handlePerRowsChange,
  } = useDataTable({});
  const fetchServiceLists = () => {
    // setLoadingTable(true);
    setLoading(true);
    const queryParams = getQueryParams();
    servicesaxios.get(
      `plans/offer/create${queryParams}`
    )

      .then((response) => {
        const { data } = response;
        const { page, results, previous, next, count, counts } = data;
        setLoading(false);
        setRefresh(0);
        setTableData((previousTableData) => ({
          ...previousTableData,
          currentPageNo: page,
          pageLoadData: results,
          prevURI: previous,
          nextURI: next,
          totalRows: count,
          counts,
        })        
        )
      })
      .catch(function (error) {
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
      
        if (is500Error) {
          setShowModal(true);
          setModalMessage("Internal Server Error");
        }
      
        setLoading(false);
      });
      // Modified by Marieya
      // .catch(function (error) {
      //   const errorString = JSON.stringify(error);
      //   const is500Error = errorString.includes("500");
      //   const is404Error = errorString.includes("404");
      //   // if (error.response && error.response.data.detail) {
      //   //   toast.error(error.response && error.response.data.detail, {
      //   //     position: toast.POSITION.TOP_RIGHT,
      //   //     autoClose: 1000,
      //   //   });
      //   // } 
      //   if (is500Error) {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   }
      //   // else if (is404Error) {
      //   //   toast.error("API mismatch", {
      //   //     position: toast.POSITION.TOP_RIGHT,
      //   //     autoClose: 1000,
      //   //   });
      //   // }
      //   //  else {
      //   //   toast.error("Something went wrong", {
      //   //     position: toast.POSITION.TOP_RIGHT,
      //   //     autoClose: 1000,
      //   //   });
      //   // }
      //   setLoading(false);

      // });
    // setLoadingTable(false);
  };

  // Calling newOfferLists()
  useEffect(() => {
    console.log("Effect running with", tableData.currentItemsPerPage, tableData.currentPageNo, refresh);
    fetchServiceLists();
  }, [tableData.currentItemsPerPage, tableData.currentPageNo, refresh]);
  
  // table columns list
  const tableColumns = getofferListsTableColumns({});
 //refresh page
 const searchInputField = useRef(null);
 const RefreshHandler = () => {
  setRefresh((prevValue) => prevValue + 1);
  if (searchInputField.current) searchInputField.current.value = "";
};

  // detailsuptade
  const offerdetailsUpdate = (data) => {
    setTableData((prevState) => ({
      ...prevState,
      pageLoadData: [data, ...prevState.pageLoadData],
      totalRows: prevState.totalRows + 1,
    }));
    closeCustomizer();
  };

  // const handleSelectedRows = () => {};
  const handleSelectedRows = (selectedRows) => {
    const tempFilteredData =
      tableData.pageLoadData.map((item) => ({ ...item, selected: false })) || [];
    const selectedIds = selectedRows.map((item) => item.id);
    const temp = tempFilteredData.map((item) => {
      if (selectedIds.includes(item.id)) return { ...item, selected: true };
      else return { ...item, selected: false };
    });
    // setTableData(temp);
    // props.setFiltereddata(temp);
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
  return (
    // css for breadcrumb by Marieya 
    <div style={{ padding: "20px" }}>
      <Grid container spacing={1} id="breadcrumb_margin">
        <Grid item md="12">
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" className="navigate_icon" />}
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
              color="#00000"
              fontSize="14px"
              className="last_typography"

            >
              Service Plan
            </Typography>
            <Typography
              sx={{ display: "flex", alignItems: "center" }}
              color="#00000 !important"
              fontSize="14px"
              className="last_typography"
            >
              Add Offer

            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
      <br />
      <br />
      <Grid container spacing={1} className="data_table" id="breadcrumb_table">
        <Grid item md="12">
          <OfferHeaderButtons openCustomizer={openCustomizer} RefreshHandler={RefreshHandler}/>
        </Grid>
        <Grid item md="12">
        {loading ? (
                        <Skeleton
                          count={11}
                          height={30}
                          style={{ marginBottom: "10px", marginTop: "15px" }}
                        />
                      ) : (
                        <>
          {token.permissions.includes(SERVICEPLAN.OFFERREAD) ? (

            <DataTable

              columns={tableColumns}
              data={tableData.pageLoadData || []}
              noHeader
              onSelectedRowsChange={({ selectedRows }) =>
                handleSelectedRows(selectedRows)
              }
              clearSelectedRows={false}
              pagination
              paginationServer
              paginationTotalRows={tableData.totalRows}
              onChangeRowsPerPage={handlePerRowsChange}
              onChangePage={handlePageChange}
              noDataComponent={"No Data"}
              conditionalRowStyles={conditionalRowStyles}
              selectableRows
              // onSelectedRowsChange={({ selectedRows }) => (
              //   handleSelectedRows(selectedRows)
              //   // deleteRows(selectedRows)
              // )}
              selectableRowsComponent={NewCheckbox}
            // progressPending={loadingTable}
            />
          ) : (<p style={{ textAlign: "center" }}>{"You have insufficient permissions to view this"}</p>)}
          </>
          )}
        </Grid>
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
                <i className="icon-close"
                  onClick={() => closeCustomizer(true)}
                // onClick={closeCustomizer}
                ></i>
              </div>
            </div>

            <div className="tab-content" id="c-pills-tabContent">
              <div className=" customizer-body custom-scrollbar">
                <TabContent activeTab={activeTab1}>
                  <TabPane tabId="2">
                    <div id="headerheading"> Add New Offer </div>
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
                            <AddNewOffer
                              dataClose={closeCustomizer}
                              onUpdate={offerdetailsUpdate}
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
          <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
        </Grid>
      </Grid>
    </div>
  );
};

export default OfferList;

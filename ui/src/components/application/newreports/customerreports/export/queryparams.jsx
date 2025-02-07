// import React, {
//     useEffect,
//     useState,
//     useRef,
//   } from "react";
//   import { useHistory } from "react-router-dom";
// import Grid from '@mui/material/Grid';
// import Skeleton from "react-loading-skeleton";
// import { toast } from "react-toastify";
// import DataTable from "react-data-table-component";
// import moment from "moment";

// import {
//     getCustomerListsTableColumns,
//     getAppliedFiltersObj,
//     getAdditionalFiltersObj,
//   } from "./data";
//   import { customeraxios } from "../../../../axios";
//   import { NewCustomerListsHeaderButtons } from "../../customermanagement/NewCustomerListsHeaderButtons";

// const CustomerExpiredTable = props => {

//     const history = useHistory();
//     const [customerLists, updateCustomerLists] = useState({
//       uiState: { loading: false },
//       currentPageNo: 1,
//       currentItemsPerPage: 10,
//       pageLoadData: [],
//       pageLoadDataForFilter: [],
//       prevURI: null,
//       nextURI: null,
//       appliedFilters: { ...getAppliedFiltersObj() },
//       additionalFilters: { ...getAdditionalFiltersObj() },
//       currentTab: "all",
//       tabCounts: {},
//       totalRows: "",
//     });
//     const [activeTab, setActiveTab] = useState("all");
//     const [selectedRow, setSelectedRow] = useState({});
//     const [columnsToHide, setColumnsToHide] = useState([]);
//     const [isCustomerDetailsOpen, setIsCustomerDetailsOpen] = useState(false);
//     const [isSessionHistoryOpen, setIsSessionHistoryOpen] = useState(false);
   
//     const [refresh, setRefresh] = useState(0);
//     const ref = useRef();
//     const box = useRef(null);
//     const searchInputField = useRef(null);

//     const [filtersData, updateDataForFilters] = useState({
//         branch: [],
//         zone: [],
//         area: [],
//         franchiseBranches: [],
//         franchiseBranchesBackUp: [],
//         franchises: [],
//         franchisesBackUp: [],
//       });
//   const userIdClickHandler = (row) => {
//     setSelectedRow(row);
//     setIsCustomerDetailsOpen(true);
//   };

//   const noOfSessionClickHandler = (row) => {
//     setSelectedRow(row);
//     setIsSessionHistoryOpen(true);
//   };


//   //refresh page
//   const RefreshHandler = () => {
//     setRefresh((prevValue) => prevValue + 1);
//     if(searchInputField.current)
//     searchInputField.current.value = "";
//   };

//     const tableColumns = getCustomerListsTableColumns({
//         userIdClickHandler,
//         noOfSessionClickHandler,
//         RefreshHandler,
//       });

//       const handlePerRowsChange = (newPerPage, page) => {
//         updateCustomerLists((prevState) => ({
//           ...prevState,
//           currentPageNo: page,
//           currentItemsPerPage: newPerPage,
//         }));
//       };

//       const handlePageChange = (page) => {
//         updateCustomerLists((prevState) => ({
//           ...prevState,
//           currentPageNo: page,
//         }));
//       };

//         // when id is checked change background color of row
//   const conditionalRowStyles = [
//     {
//       when: (row) => row.selected === true,
//       style: {
//         backgroundColor: "#FFE1D0",
//       },
//     },
//   ];




//   // get params 

//   var startDate = moment().format("YYYY-MM-DD");
//   var endDate = moment().format("YYYY-MM-DD");
//   if(props.expiredTableRange == 'today'){
//        startDate = moment().format("YYYY-MM-DD");
//        endDate = moment().format("YYYY-MM-DD");
//   }else if(props.expiredTableRange == 'yesterday'){
//       startDate = moment().subtract(1, 'days').format("YYYY-MM-DD");
//       endDate = startDate;
//  }else if(props.expiredTableRange == 'tomorrow'){
//   startDate = moment().add(1, 'days').format("YYYY-MM-DD");
//   endDate = moment().add(1, 'days').format("YYYY-MM-DD");
// }else if(props.expiredTableRange == 'next 7 days'){
//   startDate = moment().format("YYYY-MM-DD");
//   endDate = moment().add(6, 'days').format("YYYY-MM-DD");
// }

//   const getQueryParams = () => {
//     const {
//       currentPageNo,
//       currentItemsPerPage,
//       appliedFilters,
//       additionalFilters,
//     } = customerLists;

//     let queryParams = `expiry_date=${startDate}&expiry_date_end=${endDate}`;
//     // queryParams += connection;
//     if (currentItemsPerPage) {
//       queryParams += ``;
//     }
//     if (currentPageNo) {
//       queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
//     }
  
  
//     return queryParams;
//   };






//   useEffect(()=>{
//     fetchCustomerLists();

//   },[props.expiredTableRange])

//   const fetchCustomerLists = () => {
//     updateCustomerLists((prevState) => ({
//       ...prevState,
//       uiState: {
//         loading: true,
//       },
//     }));
  

//     const queryParams = getQueryParams();
//     customeraxios
//       .get(`customers/v2/list?${queryParams}`)
//       .then((response) => {
//         const { data } = response;
//         const { count, next, previous, page, results } = data;

//         updateCustomerLists((prevState) => ({
//           ...prevState,
//           currentPageNo: page,
//           tabCounts: { ...count },
//           pageLoadData: [...results],
//           prevURI: previous,
//           nextURI: next,
//           pageLoadDataForFilter: [...results],
//           totalRows: count,
//         }));
//       })
//       .catch((error) => {
//         updateCustomerLists((prevState) => ({
//           ...prevState,
//           currentPageNo: 1,
//           currentItemsPerPage: 10,
//           pageLoadData: [],
//           pageLoadDataForFilter: [],
//           prevURI: null,
//           nextURI: null,
//         }));
//         const { code, detail } = error;
//         const errorString = JSON.stringify(error);
//         const is500Error = errorString.includes("500");
        
//         toast.error(error.detail, {
//             position: toast.POSITION.TOP_RIGHT,
//             autoClose: 1000,
//           });

//       })
//       .finally(function () {
//         updateCustomerLists((prevState) => ({
//           ...prevState,
//           uiState: {
//             loading: false,
//           },
//         }));
//       });
//   };

//     return (
//         <div>
            

//              <Grid item md="12" sx={{ display: 'flex', flexFlow: 'column-reverse' }}>
//           {false ? (
//             <Skeleton
//               count={11}
//               height={30}
//               style={{ marginBottom: "10px", marginTop: "15px" }}
//             />
//           ) : (
//             <DataTable
//               className="customer-list"
//               columns={tableColumns}
//               data={customerLists.pageLoadData || []}
//               noHeader
//             //   onSelectedRowsChange={({ selectedRows }) =>
//             //     handleSelectedRows(selectedRows)
//             //   }
//               clearSelectedRows={false}
//               progressPending={customerLists.uiState.loading}
//               pagination
//               paginationServer
//               paginationTotalRows={customerLists.totalRows}
//               onChangeRowsPerPage={handlePerRowsChange}
//               onChangePage={handlePageChange}
//               noDataComponent={"No Data"}
//               conditionalRowStyles={conditionalRowStyles}
//             />
//           )}
//         </Grid>

//         <Grid item md="10" style={{ position:"relative", top:"70px", textAlign:"end"}}>
//           <NewCustomerListsHeaderButtons
//             currentTab={activeTab}
//             customerLists={customerLists}
//             filtersData={filtersData}
//             RefreshHandler={RefreshHandler}
//             updateCustomerLists={updateCustomerLists}
//             tableColumns={tableColumns}
//             setColumnsToHide={setColumnsToHide}
//             showOnlyExportButton={true}
//             getQueryParams={getQueryParams}
//           />
//         </Grid>

//         </div>
//     );
// };

// CustomerExpiredTable.propTypes = {
    
// };

// export default CustomerExpiredTable;
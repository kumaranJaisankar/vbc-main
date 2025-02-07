import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import { getLedgerReportTableColumn } from "./ledgerreportdata";
import { adminaxios } from "../../../../axios";
import DepositExport from "../billingreports/Export/deposit";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
const Showledger = (props) => {
  const [ledgerLists, updateLedgerLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,

    tabCounts: {},
    totalRows: "",
  });
  const [initialcustomerlist, setInitialcustomerlist] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],

    tabCounts: {},
    totalRows: "",
  });
  const tableColumns = getLedgerReportTableColumn();

  useEffect(() => {
    fetchLedgerReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    ledgerLists.currentPageNo,
    ledgerLists.currentItemsPerPage,
  ]);

  const getQueryParams = () => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedFilters,
      additionalFilters,
    } = ledgerLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    // if (props.inputs.reporttype == 'DEPOSIT') {
    //   queryParams += `${queryParams ? "&" : ""}deposit`;
    // }

    if (props.customstartdate) {
      queryParams += `${queryParams ? "&" : ""}start_date=${
        props.customstartdate
      }`;
    }

    if (props.customenddate) {
      queryParams += `${queryParams ? "&" : ""}end_date=${props.customenddate}`;
    }

    // branch
    if (props.inputs && props.inputs.branch === "ALL") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.branch) {
      queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    }

    // if (props.inputs && props.inputs.branch) {
    //   queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    // }

    // franchuise

    if (props.inputs && props.inputs.franchiselistt === "ALL1") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.franchiselistt) {
      queryParams += `${queryParams ? "&" : ""}franchise=${
        props.inputs.franchiselistt
      }`;
    }

    // if (props.inputs && props.inputs.franchiselistt) {
    //   queryParams += `${queryParams ? "&" : ""}franchise=${
    //     props.inputs.franchiselistt
    //   }`;
    // }

    return queryParams;
  };

  const fetchLedgerReports = () => {
    const queryParams = getQueryParams();
      adminaxios
        .get(`accounts/reports/deposit?${queryParams}`)
        .then((response) => {
          const { count, counts, next, previous, page, results } =
            response.data;
          updateLedgerLists((prevState) => ({
            ...prevState,
            currentPageNo: page,
            tabCounts: { ...counts },
            pageLoadData: [...results],
            prevURI: previous,
            nextURI: next,
            pageLoadDataForFilter: [...results],
            totalRows: count,
          }));
          setInitialcustomerlist((prevState) => ({
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
        .catch(function (error) {
          const errorString = JSON.stringify(error);
          const is500Error = errorString.includes("500");
          const is404Error = errorString.includes("404");
          if (error.response && error.response.data.detail) {
            toast.error(error.response && error.response.data.detail, {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
          } 
          
          // else if (is500Error) {
          //   toast.error("Something went wrong", {
          //     position: toast.POSITION.TOP_RIGHT,
          //     autoClose: 1000,
          //   });
          // } 
          
          else if (is404Error) {
            toast.error("API mismatch", {
              position: toast.POSITION.TOP_RIGHT,
              autoClose: 1000,
            });
          } 
          
          // else {
          //   toast.error("Something went wrong", {
          //     position: toast.POSITION.TOP_RIGHT,
          //     autoClose: 1000,
          //   });
          // }
        });
    
    // if (props.inputs.reporttype == "LEDGER") {
    //   adminaxios
    //     .get(`accounts/reports/ledger?${queryParams}`)
    //     .then((response) => {
    //       const { count, counts, next, previous, page, results } =
    //         response.data;
    //       updateLedgerLists((prevState) => ({
    //         ...prevState,
    //         currentPageNo: page,
    //         tabCounts: { ...counts },
    //         pageLoadData: [...results],
    //         prevURI: previous,
    //         nextURI: next,
    //         pageLoadDataForFilter: [...results],
    //         totalRows: count,
    //       }));
    //       setInitialcustomerlist((prevState) => ({
    //         ...prevState,
    //         currentPageNo: page,
    //         tabCounts: { ...counts },
    //         pageLoadData: [...results],
    //         prevURI: previous,
    //         nextURI: next,
    //         pageLoadDataForFilter: [...results],
    //         totalRows: count,
    //       }));
    //     })
    //     .catch(function (error) {
    //       const errorString = JSON.stringify(error);
    //       const is500Error = errorString.includes("500");
    //       const is404Error = errorString.includes("404");
    //       if (error.response && error.response.data.detail) {
    //         toast.error(error.response && error.response.data.detail, {
    //           position: toast.POSITION.TOP_RIGHT,
    //           autoClose: 1000,
    //         });
    //       } 
          
        
          
    //       else if (is404Error) {
    //         toast.error("API mismatch", {
    //           position: toast.POSITION.TOP_RIGHT,
    //           autoClose: 1000,
    //         });
    //       } 
          
         
    //     });
    // }
  };

  const handlePerRowsChange = (newPerPage, page) => {
    updateLedgerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateLedgerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  return (
    <div>
      <Grid
        item
        md="10"
        style={{ position: "relative", bottom: "64px", textAlign: "end" }}
      >
        <DepositExport
          ledgerLists={ledgerLists}
          updateLedgerLists={updateLedgerLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
          inputs={props.inputs}
        />
      </Grid>

      <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse" }}>
        {false ? (
          <Skeleton
            count={11}
            height={30}
            style={{ marginBottom: "10px", marginTop: "px" }}
          />
        ) : (
          <DataTable
            columns={tableColumns}
            data={ledgerLists.pageLoadData || []}
            noHeader
            clearSelectedRows={false}
            progressPending={ledgerLists.uiState.loading}
            progressComponent={
              <SkeletonLoader loading={ledgerLists.uiState.loading} />
            }
            pagination
            paginationServer
            paginationTotalRows={ledgerLists.totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            noDataComponent={"No Data"}
            // conditionalRowStyles={conditionalRowStyles}
          />
        )}
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

export default Showledger;

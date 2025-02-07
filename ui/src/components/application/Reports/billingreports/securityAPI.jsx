import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import DataTable from "react-data-table-component";
import { getSecurityReportTableColumn } from "./securityreportsdata";
import { billingaxios } from "../../../../axios";
import SecurityExport from "./Export/securityexport";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import SecutiryDepositTotal from "./securityDepositTotal"
import { CustomerReports } from "../../../utilitycomponents/CustomerReports";
import SecurityDepositReports from "../../../utilitycomponents/securityDepositReportTabs";

const SecurityAPI = (props) => {
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
    totalCounts:{},
  });
  // const [activeTab, setActiveTab] = useState("True");
  // const [activeTabAct, setActiveTabAct] = useState("act");
  // const [activeTabSpd, setActiveTabSpd] = useState("spd");
  // const [activeTabAll, setActiveTabAll] = useState("all");
  // const [activeTabAbtExp, setActiveTabAbtExp] = useState("act");
  const [activeTab, setActiveTab] = useState("All");
 

  const tableColumns = getSecurityReportTableColumn();

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
    } = ledgerLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
// console.log(activeTab,"activeTab")
if (props.inputs && activeTab) {
  queryParams += `${queryParams ? "&" : ""}security_deposit_refund=${activeTab}`;
}
    // if (props.inputs.reporttype == 'DEPOSIT') {
    //   queryParams += `${queryParams ? "&" : ""}deposit`;
    // }

    // if (props.customstartdate && activeTab==="True") {
    //   queryParams += `${queryParams ? "&" : ""}deposit_start_date=${props.customstartdate
    //     }`;
    // } else {
    //   queryParams += `${queryParams ? "&" : ""}start_date=${props.customstartdate
    //   }`;
    // }

    // if (props.customenddate && activeTab==="True") {
    //   queryParams += `${queryParams ? "&" : ""}deposit_end_date=${props.customenddate}`;
    // } else {
    //   queryParams += `${queryParams ? "&" : ""}end_date=${props.customstartdate
    //   }`;
    // }
    if (props.customstartdate && activeTab==="True") {
      queryParams += `${queryParams ? "&" : ""}deposit_start_date=${props.customstartdate
        }`;
    } else if(props.customstartdate){
      queryParams += `${queryParams ? "&" : ""}start_date=${props.customstartdate
      }`;
    }

    if (props.customenddate && activeTab==="True") {
      queryParams += `${queryParams ? "&" : ""}deposit_end_date=${props.customenddate}`;
    } else if(props.customstartdate){
      queryParams += `${queryParams ? "&" : ""}end_date=${props.customenddate
      }`;
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
      queryParams += `${queryParams ? "&" : ""}franchise=${props.inputs.franchiselistt
        }`;
    }

    // if (props.inputs && props.inputs.franchiselistt) {
    //   queryParams += `${queryParams ? "&" : ""}franchise=${
    //     props.inputs.franchiselistt
    //   }`;
    // }

    return queryParams;
  };
  useEffect(() => {
    fetchLedgerReports();
  }, [activeTab]);
  const fetchLedgerReports = () => {
    updateLedgerLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    billingaxios
      .get(`payment/security/deposit/reports/list?${queryParams}`)
      .then((response) => {
        const { count, counts, next, previous, page, results,total_counts } =
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
          totalCounts:{...total_counts}
        }));
      })
      .catch(function (error) {
        const errorString = JSON.stringify(error);
        const is404Error = errorString.includes("404");
        if (error.response && error.response.data.detail) {
          toast.error(error.response && error.response.data.detail, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }

        else if (is404Error) {
          toast.error("API mismatch", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
        }

      })

      .finally(function () {
        updateLedgerLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
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

  // added css for DataTable by Marieya and ledger export for ledger reports
  return (
    <div>
      <Grid
        item
        md="12"
        style={{ position: "relative", bottom: "64px", textAlign: "end", marginTop: "-3%" }}
      >
        <SecurityExport
          ledgerLists={ledgerLists}
          updateLedgerLists={updateLedgerLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
          inputs={props.inputs}
        />
      </Grid>
      
      <Grid item md="12"

      // sx={{ display: "flex", flexFlow: "column-reverse" }}
      >
       
         <SecurityDepositReports
          currentTab={activeTab}
          setActiveTab={setActiveTab}
          ledgerLists={ledgerLists}
          />
          <DataTable
            columns={tableColumns}
            data={ledgerLists.pageLoadData || []}
            noHeader
            clearSelectedRows={false}
            progressPending={ledgerLists.uiState.loading}
            progressComponent={
              <SkeletonLoader loading={ledgerLists.uiState.loading} />
            }
            // selectableRows
            pagination
            paginationServer
            paginationTotalRows={ledgerLists.totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            noDataComponent={"No Data"}
          // conditionalRowStyles={conditionalRowStyles}
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

export default SecurityAPI;

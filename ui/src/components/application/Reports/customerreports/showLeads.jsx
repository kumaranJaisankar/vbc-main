import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import DataTable from "react-data-table-component";
import { billingaxios, default as axiosBaseURL, } from "../../../../axios";
// import DepositExport from "../billingreports/Export/deposit";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import { getLeadsReportTableColumn } from "./leadsReportsData";
import InvoiceExport from "../billingreports/Export/invoice";
import LeadsExport from "../billingreports/Export/leadsExport";
const Showleads = (props) => {
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

  const tableColumns = getLeadsReportTableColumn();

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

    // if (props.inputs.reporttype == 'DEPOSIT') {
    //   queryParams += `${queryParams ? "&" : ""}deposit`;
    // }

    if (props.customstartdate) {
      queryParams += `${queryParams ? "&" : ""}created=${props.customstartdate
        }`;
    }

    if (props.customenddate) {
      queryParams += `${queryParams ? "&" : ""}created_end=${props.customenddate}`;
    }

    // branch
    if (props.inputs && props.inputs.branch === "ALL") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.branch) {
      queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    }
    if (props.inputs && props.inputs.area === "ALL2") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.area) {
      queryParams += `${queryParams ? "&" : ""}area=${props.inputs.area}`;
    }
    if (props.inputs && props.inputs.zone === "ALL1") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.zone) {
      queryParams += `${queryParams ? "&" : ""}zone=${props.inputs.zone}`;
    }
    // if (props.inputs && props.inputs.branch) {
    //   queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    // }

    // franchuise

    if (props.inputs && props.inputs.franchiselistt === "ALL7") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.franchiselistt) {
      queryParams += `${queryParams ? "&" : ""}franchise=${props.inputs.franchiselistt
        }`;
    }
    if (props.inputs && props.inputs.actstatus === "ALL") {
      queryParams += ``;
    }
  else if (props.inputs && props.inputs.actstatus) {
    queryParams += `${queryParams ? "&" : ""}status=${props.inputs.actstatus}`;
  }
  if (props.inputs && props.inputs.assigned_to) {
    queryParams += `${queryParams ? "&" : ""}assigned_to=${props.inputs.assigned_to}`;
  }
  
    // if (props.inputs && props.inputs.franchiselistt) {
    //   queryParams += `${queryParams ? "&" : ""}franchise=${
    //     props.inputs.franchiselistt
    //   }`;
    // }

    return queryParams;
  };

  const fetchLedgerReports = () => {

    updateLedgerLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));

    const queryParams = getQueryParams();
    axiosBaseURL
      // .get(`payment/v2/list?${queryParams}`)
      .get(`radius/lead/reports?${queryParams}`)
      .then((response) => {
        props.setBillingReport(response?.data)
        const { count, counts, next, previous, page, results } =
          response?.data;
          if(response?.data?.results){
        updateLedgerLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: count,
        })) }
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
  //added css for revenue dataTable by Marieya on line 239
  return (
    <div>
      <Grid
        item
        md="12"
        style={{ position: "relative", bottom: "64px", textAlign: "end", marginTop: "-3%" }}
      >
        {/* <DepositExport
          ledgerLists={ledgerLists}
          updateLedgerLists={updateLedgerLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
          inputs={props.inputs}
        /> */}
        <LeadsExport
          billingLists={ledgerLists}
          updateBillingLists={updateLedgerLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
          billingReport={props.billingReport}
        />

      </Grid>

      <Grid item md="12" >

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

export default Showleads;

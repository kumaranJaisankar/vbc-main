import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import DataTable from "react-data-table-component";
import { getBillingReportTableColumn } from "./billingreportsdata";
import { billingaxios } from "../../../../axios";
// import DepositExport from "../billingreports/Export/deposit";
import InvoiceExport from "./Export/invoice";
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

  const tableColumns = getBillingReportTableColumn();

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
      queryParams += `${queryParams ? "&" : ""}start_date=${props.customstartdate
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
      queryParams += `${queryParams ? "&" : ""}franchise=${props.inputs.franchiselistt
        }`;
    }
    if (props.inputs && props.inputs.paymentmethod === "ALL3") {
      queryParams += ``;

    } else if (props.inputs && props.inputs.paymentmethod && props.inputs.pickup_type =="ONL") {
      queryParams += `${queryParams ? "&" : ""}online_payment_method=${props.inputs.paymentmethod
        }`;

    }else if (props.inputs && props.inputs.paymentmethod && props.inputs.pickup_type =="OFL") {
      queryParams += `${queryParams ? "&" : ""}offline_payment_method=${props.inputs.paymentmethod
        }`;
      }

    // collected by

    if (props.inputs && props.inputs.collectedby === "ALL4") {
      queryParams += ``;

    } else if (props.inputs && props.inputs.collectedby) {
      queryParams += `${queryParams ? "&" : ""}collected_by=${props.inputs.collectedby
        }`;

    }

    if (props.inputs && props.inputs.status === "ALL5") {
      queryParams += ``;

    } else if (props.inputs && props.inputs.status) {
      queryParams += `${queryParams ? "&" : ""}status=${props.inputs.status
        }`;

    }

 // payment mode added by Marieya on 25/10/22
  if (props.inputs && props.inputs.pickup_type === "ALL7") {
    queryParams += ``;

  } else if (props.inputs && props.inputs.pickup_type) {
    queryParams += `${queryParams ? "&" : ""}pickup_type=${props.inputs.pickup_type
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

    updateLedgerLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));

    const queryParams = getQueryParams();
    billingaxios
      // .get(`payment/v2/list?${queryParams}`)
      .get(`payment/enh/list?${queryParams}`)
      .then((response) => {
        props.setBillingReport(response.data)
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
        <InvoiceExport
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

export default Showledger;

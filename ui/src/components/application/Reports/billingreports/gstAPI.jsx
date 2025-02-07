import React, { useState, useEffect, useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import DataTable from "react-data-table-component";
import { getGstReportTableColumn } from "./gstreportsdata";
import { billingaxios } from "../../../../axios";
import GstExport from "../billingreports/Export/gstexport";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
const GstAPI = (props) => {
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

  const handleDownload = (row) => {
    const payload = {
      "file_path": row.file_path
    };
  
    billingaxios.post('payment/inv/download', payload)
    .then((response) => {
      const downloadUrl = response.data.download_url;
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'filename.pdf'); // Use the desired file name
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
  


  const handlePreview = (row) => {
    const payload = {
      "file_path": row.file_path
    };
  
    billingaxios.post('payment/inv/preview', payload)
    .then((response) => {
      const previewUrl = response.data.preview_url;
      window.open(previewUrl, '_blank');
    })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
 
  const tableColumns = getGstReportTableColumn({handleDownload,handlePreview});

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
    // payment/v2/list?limit=10&page=1&start_date=2023-03-03&end_date=2023-03-03&is_gst=true
    // /payment/enh/list
      .get(`payment/enh/list?${queryParams}&is_gst=True`)
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
        <GstExport
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

export default GstAPI;

import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import { getNetworkReportTableColumn } from "./data";
import { networkaxios } from "../../../../axios";
import { toast } from "react-toastify";

const ModalNetworkData = (props) => {
  const [networkLists, updateNetworkLists] = useState({ });
  const tableColumns = getNetworkReportTableColumn();

  useEffect(() => {
    fetchFranchiseReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    networkLists.currentPageNo,
    networkLists.currentItemsPerPage,
  ]);

 
  const fetchFranchiseReports = () => {

    networkaxios
      .get(`network/reports/utilization?device_type=Olt`)
      .then((response) => {
        updateNetworkLists(response.data)
        // const { counts, next, previous, page, results } = response.data;
        // updateNetworkLists((prevState) => ({
        //   ...prevState,
        //   currentPageNo: page,
        //   tabCounts: { ...counts },
        //   pageLoadData: [...results],
        //   prevURI: previous,
        //   nextURI: next,
        //   pageLoadDataForFilter: [...results],
        //   totalRows: counts,
        // }));
        // setInitialcustomerlist((prevState) => ({
        //   ...prevState,
        //   currentPageNo: page,
        //   tabCounts: { ...counts },
        //   pageLoadData: [...results],
        //   prevURI: previous,
        //   nextURI: next,
        //   pageLoadDataForFilter: [...results],
        //   totalRows: counts,
        // }));
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
      });
  };


  return (
    <div className="network_reports">
      {/* <Grid
        item
        md="12"
        
      > */}
      {/* <NetworkExport
          networkLists={networkLists}
          updateFranchiseLists={updateNetworkLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
        /> */}
      {/* </Grid> */}

      <Grid
        item
        md="12"
      >
        {false ? (
          <Skeleton
            count={11}
            height={30}
          />
        ) : (
          <DataTable
            columns={tableColumns}
            data={networkLists}
            noHeader
            clearSelectedRows={false}
            // progressPending={networkLists.uiState.loading}
            pagination
            // paginationTotalRows={networkLists.totalRows}
            // onChangeRowsPerPage={handlenetworkPerRowsChange}
            // onChangePage={handlenetworkPageChange}
            noDataComponent={"No Data"}
          />
        )}
      </Grid>
    </div>
  );
};

export default ModalNetworkData;

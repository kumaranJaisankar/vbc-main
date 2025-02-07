import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import { getNetworkReportTableColumn } from "./data";
import { adminaxios } from "../../../../axios";
import NetworkExport from "./networkExport";
import { toast } from "react-toastify";

const ModalNetworkData = (props) => {
  const [networkLists, updateNetworkLists] = useState({
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

  const getQueryParams = () => {
    const { currentPageNo, currentItemsPerPage } = networkLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (props.customstartdate) {
      queryParams += `${queryParams ? "&" : ""}created=${
        props.customstartdate
      }`;
    }

    if (props.customenddate) {
      queryParams += `${queryParams ? "&" : ""}created_end=${
        props.customenddate
      }`;
    }

    if (props.inputs && props.inputs.filterbranch) {
      queryParams += `${queryParams ? "&" : ""}branch=${
        props.inputs.filterbranch
      }`;
    }
    if (props.inputs && props.inputs.franchiselistt) {
      queryParams += `${queryParams ? "&" : ""}name=${
        props.inputs.franchiselistt
      }`;
    }

    return queryParams;
  };

  const fetchFranchiseReports = () => {
    const queryParams = getQueryParams();

    adminaxios
      .get(`accounts/reports/franchise?${queryParams}`)
      .then((response) => {
        const { count, counts, next, previous, page, results } = response.data;
        updateNetworkLists((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: counts,
        }));
        setInitialcustomerlist((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...results],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...results],
          totalRows: counts,
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

  //   rows per page count
  const handlenetworkPerRowsChange = (newPerPage, page) => {
    updateNetworkLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  //   page change next and pervious
  const handlenetworkPageChange = (page) => {
    updateNetworkLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  return (
    <div>
      <Grid
        item
        md="10"
        style={{
          position: "relative",
          bottom: "50px",
          top: "-65px",
          textAlign: "end",
          right: "-55px",
        }}
      >
        <NetworkExport
          networkLists={networkLists}
          updateFranchiseLists={updateNetworkLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
        />
      </Grid>

      <Grid
        item
        md="12"
        sx={{ display: "flex", flexFlow: "column-reverse", marginTop: "-50px" }}
      >
        {false ? (
          <Skeleton
            count={11}
            height={30}
            style={{ marginBottom: "10px", marginTop: "15px" }}
          />
        ) : (
          <DataTable
            columns={tableColumns}
            data={networkLists.pageLoadData || []}
            noHeader
            clearSelectedRows={false}
            progressPending={networkLists.uiState.loading}
            pagination
            paginationServer
            paginationTotalRows={networkLists.totalRows}
            onChangeRowsPerPage={handlenetworkPerRowsChange}
            onChangePage={handlenetworkPageChange}
            noDataComponent={"No Data"}
          />
        )}
      </Grid>
    </div>
  );
};

export default ModalNetworkData;

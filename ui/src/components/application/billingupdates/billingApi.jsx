import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { billingaxios } from "../../../axios";
import { toast } from "react-toastify";

import { BILLING } from "../../../utils/permissions";
import { Spinner } from "reactstrap"
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const BillingModalnewreports = (props) => {



  const [searchLoader, setSearchLoader] = useState(false)

  useEffect(() => {
    fetchBillingReports();
  }, [
    // props.customstartdate,
    // props.customenddate,
    // props.inputs,
    props.billingLists.currentPageNo,
    props.billingLists.currentItemsPerPage,
    props.billingLists.appliedServiceFilters,
    props.refresh,
  ]);




  //made changes with alingments by Marieya

  const fetchBillingReports = () => {
    setSearchLoader(true)
    props.updateBillingLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = props.getQueryParams();

    billingaxios
      .get(`payment/enh/list?${queryParams}`)
      .then((response) => {
        setSearchLoader(false)
        // props.setRefresh(0)
        const { count, counts, next, previous, page, results } = response.data;
        props.setFiltereddata(response.data)
        props.setBillingReport(response.data)
        props.updateBillingLists((prevState) => ({
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
        setSearchLoader(false)
        props.updateBillingLists((prevState) => ({
          ...prevState,
          currentPageNo: 1,
          currentItemsPerPage: 10,
          pageLoadData: [],
          pageLoadDataForFilter: [],
          prevURI: null,
          nextURI: null,
        }));
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
      })
      .finally(function () {
        props.updateBillingLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };


  useEffect(() => {
    props.updateBillingLists((prevState) => ({
      ...prevState,
      appliedServiceFilters: {
        ...prevState.appliedServiceFilters,
        customer_username: {
          ...prevState.appliedServiceFilters.customer_username,
          value: {
            ...prevState.appliedServiceFilters.customer_username.value,
            strVal: props.searchUser || "",
            label: props.searchUser,
          },
        },
      },
    }));
  }, [props.searchUser]);


  return (

    <div>

      <Grid>
        <div id="button-container">
          <button
            className="btn btn-primary openmodal"
            id=""
            type="button"
            onClick={() => {
              fetchBillingReports(props.inputs);
            }}
            disabled={searchLoader ? searchLoader : searchLoader}
          >
            {searchLoader ? <Spinner size="sm"></Spinner> : null} &nbsp;<b>Search</b>
          </button>
        </div>
      </Grid>
    </div>

  );
};



export default BillingModalnewreports;

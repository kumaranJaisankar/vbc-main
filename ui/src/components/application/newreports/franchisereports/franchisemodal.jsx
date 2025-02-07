import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import {
    getFranchiseReportTableColumn
} from "./franchisereportsdata";
import { adminaxios} from "../../../../axios";
import FranchiseExport from "./franchiseexport";
import {toast} from "react-toastify"
import { Col, Card } from "reactstrap";


const FranchiseModalnewreports = (props) => {
  const [franchiseLists, updateFranchiseLists] = useState({
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
  const tableColumns = getFranchiseReportTableColumn();

  useEffect(() => {
    fetchFranchiseReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    franchiseLists.currentPageNo,
    franchiseLists.currentItemsPerPage,
  ]);

  const getQueryParams = () => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedFilters,
      additionalFilters,
    } = franchiseLists;

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
      queryParams += `${queryParams ? "&" : ""}created_end=${props.customenddate}`;
    }


    // if (props.inputs && props.inputs.franchiselistt) {
    //   queryParams += `${queryParams ? "&" : ""}name=${
    //     props.inputs.franchiselistt
    //   }`;
    // }

// status



if(props.inputs && props.inputs.franchisestatuss === "ALL3"){
  queryParams += ``;

}else if(props.inputs && props.inputs.franchisestatuss) {
  queryParams += `${queryParams ? "&" : ""}status=${
    props.inputs.franchisestatuss
  }`;
 
} 


    // if (props.inputs && props.inputs.franchisestatuss) {
    //   queryParams += `${queryParams ? "&" : ""}status=${
    //     props.inputs.franchisestatuss
    //   }`;
    // }


// type

if(props.inputs && props.inputs.franchisetypee === "ALL2"){
  queryParams += ``;

}else if(props.inputs && props.inputs.franchisetypee) {
  queryParams += `${queryParams ? "&" : ""}type=${
    props.inputs.franchisetypee
  }`;
 
} 


    // if (props.inputs && props.inputs.franchisetypee) {
    //   queryParams += `${queryParams ? "&" : ""}type=${
    //     props.inputs.franchisetypee
    //   }`;
    // }


    // smsgateway


    if(props.inputs && props.inputs.franchisesmsgatewayy === "ALL4"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.franchisesmsgatewayy) {
      queryParams += `${queryParams ? "&" : ""}sms_gateway_type=${
        props.inputs.franchisesmsgatewayy
      }`;
     
    } 


    // if (props.inputs && props.inputs.franchisesmsgatewayy) {
    //   queryParams += `${queryParams ? "&" : ""}sms_gateway_type=${
    //     props.inputs.franchisesmsgatewayy
    //   }`;
    // }
    // if (props.inputs && props.inputs.filterbranch) {
    //   queryParams += `${queryParams ? "&" : ""}branch=${
    //     props.inputs.filterbranch
    //   }`;
    // }

// branch

if(props.inputs && props.inputs.filterbranch === "ALL"){
  queryParams += ``;

}else if(props.inputs && props.inputs.filterbranch) {
  queryParams += `${queryParams ? "&" : ""}branch=${
    props.inputs.filterbranch
  }`;
 
} 


// franchise


if(props.inputs && props.inputs.franchiselistt === "ALL1"){
  queryParams += ``;

}else if(props.inputs && props.inputs.franchiselistt) {
  queryParams += `${queryParams ? "&" : ""}name=${
    props.inputs.franchiselistt
  }`;
 
} 


    // if (props.inputs && props.inputs.franchiselistt) {
    //   queryParams += `${queryParams ? "&" : ""}name=${
    //     props.inputs.franchiselistt
    //   }`;
    // }
   

    return queryParams;
  };

  const fetchFranchiseReports = () => {
    const queryParams = getQueryParams();

adminaxios
    .get(`accounts/reports/franchise?${queryParams}`)
      .then((response) => {
        const { count, counts, next, previous, page, results } = response.data;
        updateFranchiseLists((prevState) => ({
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

  const handlePerRowsChange = (newPerPage,page) => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateFranchiseLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };

  return (
    <div>
       <Grid
        item
        md="12"
        style={{ position: "relative",  bottom: "50px",top:"-47px", textAlign: "end" }}  
      >
        <FranchiseExport
          franchiseLists={franchiseLists}
          updateFranchiseLists={updateFranchiseLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
        />
      </Grid>

      <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse",marginTop:"-50px"  }}>
      <Col md="12" className="department" style={{ marginTop: "56px" }}>
                <Card style={{ borderRadius: "0", boxShadow: "none" }}>
                  <Col xl="12" style={{ padding: "0" }}>
        {false ? (
          <Skeleton
            count={11}
            height={30}
            style={{ marginBottom: "10px", marginTop: "15px" }}
          />
        ) : (
          <DataTable
            columns={tableColumns}
            data={franchiseLists.pageLoadData || []}
            noHeader
            clearSelectedRows={false}
            progressPending={franchiseLists.uiState.loading}
            pagination
            paginationServer
            paginationTotalRows={franchiseLists.totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            noDataComponent={"No Data"}
            // conditionalRowStyles={conditionalRowStyles}
          />
        )}
        </Col>
        </Card>
        </Col>
      </Grid>
     
    </div>
  );
};

export default FranchiseModalnewreports;

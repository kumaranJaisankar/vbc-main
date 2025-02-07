import React, { useState, useEffect,useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import { getTicketReportTableColumn } from "./ticketreportsdata";
import { helpdeskaxios } from "../../../../axios";
import TicketExport from "./ticketexport";
import {toast} from "react-toastify"
import { Col, Card } from "reactstrap";
import Box from "@mui/material/Box";

const TicketModalnewreports = (props) => {
  const [ticketLists, updateTicketLists] = useState({
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
  const tableColumns = getTicketReportTableColumn();

  useEffect(() => {
    fetchTicketReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    ticketLists.currentPageNo,
    ticketLists.currentItemsPerPage
  ]);

  const getQueryParams = () => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedFilters,
      additionalFilters,
    } = ticketLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }


    // category
    // if (props.inputs && props.inputs.category) {
    //   queryParams += `${queryParams ? "&" : ""}category=${
    //     props.inputs.category
    //   }`;
    // }

    if(props.inputs && props.inputs.category === "ALL"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.category) {
      queryParams += `${queryParams ? "&" : ""}category=${
        props.inputs.category
      }`;
     
    } 


    // subcategory


    // if (props.inputs && props.inputs.subcategory) {
    //   queryParams += `${queryParams ? "&" : ""}subcategory=${
    //     props.inputs.subcategory
    //   }`;
    // }

    if(props.inputs && props.inputs.subcategory === "ALL1"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.subcategory) {
      queryParams += `${queryParams ? "&" : ""}subcategory=${
        props.inputs.subcategory
      }`;
     
    } 



    // priority

    // if (props.inputs && props.inputs.priority) {
    //   queryParams += `${queryParams ? "&" : ""}priority_sla=${
    //     props.inputs.priority
    //   }`;
    // }

    if(props.inputs && props.inputs.priority === "ALL2"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.priority) {
      queryParams += `${queryParams ? "&" : ""}priority=${
        props.inputs.priority
      }`;
     
    } 



// status
if(props.inputs && props.inputs.status === "ALL3"){
  queryParams += ``;

}else if(props.inputs && props.inputs.status) {
  queryParams += `${queryParams ? "&" : ""}status=${
    props.inputs.status
  }`;
 
} 


    // if (props.inputs && props.inputs.status) {
    //   queryParams += `${queryParams ? "&" : ""}status=${props.inputs.status}`;
    // }

// customer id's

if(props.inputs && props.inputs.customerid === "ALL4"){
  queryParams += ``;

}else if(props.inputs && props.inputs.customerid) {
  queryParams += `${queryParams ? "&" : ""}customerid=${
    props.inputs.customerid
  }`;
 
} 

    // if (props.inputs && props.inputs.customerid) {
    //     queryParams += `${queryParams ? "&" : ""}open_for=${props.inputs.customerid}`;
    //   }

    return queryParams;
  };

  const fetchTicketReports = () => {
    updateTicketLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();

    helpdeskaxios
      .get(`v2/list/ticket?${queryParams}`)
      .then((response) => {
        props.setTotalCount(response.data)
        const { count, counts, next, previous, page, results } = response.data;
        updateTicketLists((prevState) => ({
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
        updateTicketLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  const handlePerRowsChange = (newPerPage,page) => {
    updateTicketLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateTicketLists((prevState) => ({
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
        <TicketExport
          ticketLists={ticketLists}
          updateTicketLists={updateTicketLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
        />
      </Grid>
      <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse",marginTop:"-50px"  }} >
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
            data={ticketLists.pageLoadData || []}
            noHeader
            clearSelectedRows={false}
            progressPending={ticketLists.uiState?.loading}
            progressComponent={
              <SkeletonLoader loading={ticketLists.uiState.loading} />
            }
            pagination
            paginationServer
            paginationTotalRows={ticketLists.totalRows}
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

export default TicketModalnewreports;

import React, { useState, useEffect ,useMemo} from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import DataTable from "react-data-table-component";
import { getBillingReportTableColumn } from "./billingreportsdata";
import { billingaxios } from "../../../../axios";
import InvoiceExport from "./Export/invoice";
import { toast } from "react-toastify";
import { Col, Card } from "reactstrap";
import Box from "@mui/material/Box";

const BillingModalnewreports = (props) => {
  const [billingLists, updateBillingLists] = useState({
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
    fetchBillingReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    billingLists.currentPageNo,
    billingLists.currentItemsPerPage
    
  ]);

  const getQueryParams = () => {
    const {
      currentPageNo,
      currentItemsPerPage,
    } = billingLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (props.customstartdate) {
      queryParams += `${queryParams ? "&" : ""}start_date=${
        props.customstartdate
      }`;
    }

    if (props.customenddate) {
      queryParams += `${queryParams ? "&" : ""}end_date=${props.customenddate}`;
    }
    // if (props.inputs && props.inputs.branch) {
    //   queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    // }
    if (props.inputs && props.inputs.zone) {
      queryParams += `${queryParams ? "&" : ""}zone=${props.inputs.zone}`;
    }
   
    if (props.inputs && props.inputs.area) {
      queryParams += `${queryParams ? "&" : ""}area=${props.inputs.area}`;
    }


    // branch

    if(props.inputs && props.inputs.branch === "ALL"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.branch) {
      queryParams += `${queryParams ? "&" : ""}branch=${
        props.inputs.branch
      }`;
     
    } 


    // franchise

    

    if(props.inputs && props.inputs.franchiselistt === "ALL1"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.franchiselistt) {
      queryParams += `${queryParams ? "&" : ""}franchise=${
        props.inputs.franchiselistt
      }`;
     
    } 


    // if (props.inputs && props.inputs.franchiselistt) {
    //   queryParams += `${queryParams ? "&" : ""}franchise=${
    //     props.inputs.franchiselistt
    //   }`;
    // }


// payment_method

if(props.inputs && props.inputs.paymentmethod === "ALL3"){
  queryParams += ``;

}else if(props.inputs && props.inputs.paymentmethod) {
  queryParams += `${queryParams ? "&" : ""}payment_method=${
    props.inputs.paymentmethod
  }`;
 
} 

    // if (props.inputs && props.inputs.paymentmethod) {
    //   queryParams += `${queryParams ? "&" : ""}payment_method=${
    //     props.inputs.paymentmethod
    //   }`;
    // }

// status



if(props.inputs && props.inputs.status === "ALL5"){
  queryParams += ``;

}else if(props.inputs && props.inputs.status) {
  queryParams += `${queryParams ? "&" : ""}status=${
    props.inputs.status
  }`;
 
}

    // if (props.inputs && props.inputs.status) {
    //   queryParams += `${queryParams ? "&" : ""}status=${
    //     props.inputs.status
    //   }`;
    // }


    // collected by

    if(props.inputs && props.inputs.collectedby === "ALL4"){
      queryParams += ``;
    
    }else if(props.inputs && props.inputs.collectedby) {
      queryParams += `${queryParams ? "&" : ""}collected_by=${
        props.inputs.collectedby
      }`;
     
    } 

    
    // if (props.inputs && props.inputs.collectedby) {
    //   queryParams += `${queryParams ? "&" : ""}collected_by=${
    //     props.inputs.collectedby
    //   }`;
    // }


    return queryParams;
  };

  const fetchBillingReports = () => {
    updateBillingLists((prevState) => ({
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
        const { count, counts, next, previous, page, results } = response.data;
        updateBillingLists((prevState) => ({
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
        updateBillingLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  const handlePerRowsChange = (newPerPage,page) => {
    updateBillingLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,

    }));
  };

  const handlePageChange = (page) => {
    updateBillingLists((prevState) => ({
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
        <InvoiceExport
          billingLists={billingLists}
          updateBillingLists={updateBillingLists}
          tableColumns={tableColumns}
          showOnlyExportButton={true}
          getQueryParams={getQueryParams}
          billingReport={props.billingReport}
        />
      </Grid>

      <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse" ,marginTop:"-50px"}}>
      <Col md="12" className="department" style={{ marginTop: "56px" }}>
          <Card style={{ borderRadius: "0", boxShadow: "none" }}>
            <Col xl="12" style={{ padding: "0" }}>
          <DataTable
            columns={tableColumns}
            data={billingLists.pageLoadData || []}
            noHeader
            clearSelectedRows={false}
            progressPending={billingLists.uiState?.loading}
            progressComponent={
              <SkeletonLoader loading={billingLists.uiState.loading} />
            }
            pagination
            paginationServer
            paginationTotalRows={billingLists.totalRows}
            onChangeRowsPerPage={handlePerRowsChange}
            onChangePage={handlePageChange}
            noDataComponent={"No Data"}
            // conditionalRowStyles={conditionalRowStyles}
          />
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

export default BillingModalnewreports;

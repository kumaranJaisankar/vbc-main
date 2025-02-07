import React, { useState, useEffect,useMemo } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import {
  getCustomerReportTableColumn,
  getAppliedFiltersReportsObj,
} from "./reportsdata";
import { customeraxios } from "../../../../axios";
import CustomerExport from "./export/export";
import { toast } from "react-toastify";
import { Col, Card } from "reactstrap";
import Box from "@mui/material/Box";
import CustomerReports from "../../../utilitycomponents/CustomerReports"

const Modalnewreports = (props) => {
  console.log(props.branchdata.valueWithoutKey, "props.branchdata");
  const [activeTab, setActiveTab] = useState("all");
  const [customerLists, updateCustomerLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    appliedFilters: { ...getAppliedFiltersReportsObj() },
    currentTab: "all",
    tabCounts: {},
    totalRows: "",
  });
  const [initialcustomerlist, setInitialcustomerlist] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    // prevURI: previous,
    // nextURI: next,
    appliedFilters: { ...getAppliedFiltersReportsObj() },
    currentTab: "all",
    tabCounts: {},
    totalRows: "",
  });
  const tableColumns = getCustomerReportTableColumn();

  useEffect(() => {
    fetchCustomerReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    customerLists.currentPageNo,
    customerLists.currentItemsPerPage,
    customerLists.appliedFilters,
    activeTab,
  ]);

  const getConvertedAccountStatus = (status) => {
    switch (status) {
      case "Active":
        return "act";
      case "Expired":
        return "exp";
      case "Online":
        return "online";
      default:
        return "";
    }
  };
  const getQueryParams = (isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage ,appliedFilters} = customerLists;

    let queryParams = "";

    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }
    if (activeTab !== "all") {
      queryParams += `${queryParams ? "&" : ""}${
        activeTab === "online" || activeTab === "offline"
          ? "line_status"
          : "account_status"
      }=${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTab
      }`;
    }

    // if (props.inputs && props.inputs.branch) {
    //   queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    // }
    // if (props.inputs && props.inputs.zone) {
    //   queryParams += `${queryParams ? "&" : ""}zone=${props.inputs.zone}`;
    // }
    // if (props.inputs && props.inputs.area) {
    //   queryParams += `${queryParams ? "&" : ""}area=${props.inputs.area}`;
    // }

    // if(props.branchdata && props.branchdata){
    //   queryParams += `${queryParams ? "&" : ""}service_plan=${props.branchdata.valueWithoutKey}`;
    // }

//branch all new 
    // if (
    //   props.customstartdate &&
    //   props.inputs &&
    //   props.inputs.branch
    // ) {
    //   queryParams += `${queryParams ? "&" : ""}created=${
    //     props.customstartdate
    //   }`;
    // }
    // if (props.customenddate && props.inputs && props.inputs.branch) {
    //   queryParams += `${queryParams ? "&" : ""}created_end=${
    //     props.customenddate
    //   }`;
    // }else if (props.inputs && props.inputs.branch) {
    //     queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    //   }
    // branch all
    if (props.inputs && props.inputs.branch === "ALL") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.branch) {
      queryParams += `${queryParams ? "&" : ""}branch=${props.inputs.branch}`;
    }

    // zones
    if (props.inputs && props.inputs.zone === "ALL1") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.zone) {
      queryParams += `${queryParams ? "&" : ""}zone=${props.inputs.zone}`;
    }

    // area list

    if (props.inputs && props.inputs.area === "ALL2") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.area) {
      queryParams += `${queryParams ? "&" : ""}area=${props.inputs.area}`;
    }

    // query params for expiry date
    if (
      props.customstartdate &&
      props.inputs &&
      props.inputs.actstatus === "EXP"
    ) {
      queryParams += `${queryParams ? "&" : ""}expiry_date=${
        props.customstartdate
      }`;
    }else if (props.customstartdate) {
      queryParams += `${queryParams ? "&" : ""}created=${
        props.customstartdate
      }`;
    }
     

    if (
      props.customenddate &&
      props.inputs &&
      props.inputs.actstatus === "EXP"
    ) {
      queryParams += `${queryParams ? "&" : ""}expiry_date_end=${
        props.customenddate
      }`;
    }else if (props.customenddate) {
      queryParams += `${queryParams ? "&" : ""}created_end=${
        props.customenddate
      }`;
    }
  

    //end
    //query params for new connections
    // if (
    //   props.customstartdate &&
    //   props.inputs &&
    //   props.inputs.actstatus === " " || props.inputs.actstatus === "ACT" || props.inputs.branch  || props.inputs.franchiselistt || props.inputs.zone || props.inputs.area || props.inputs.paymentstatus
    // ) {
    //   queryParams += `${queryParams ? "&" : ""}created=${
    //     props.customstartdate
    //   }`;
    // }
    // if (props.customenddate && props.inputs && props.inputs.actstatus === " " || props.inputs.actstatus === "ACT" || props.inputs.branch || props.inputs.franchiselistt || props.inputs.zone || props.inputs.area || props.inputs.paymentstatus) {
    //   queryParams += `${queryParams ? "&" : ""}created_end=${
    //     props.customenddate
    //   }`;
    // }
    //end

    if (props.inputs && props.inputs.connstatus) {
      queryParams += `${queryParams ? "&" : ""}line_status=${
        props.inputs.connstatus
      }`;
    }

    // accoutn status
    if (props.inputs && props.inputs.actstatus === "ALL5") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.actstatus) {
      queryParams += `${queryParams ? "&" : ""}account_status=${
        props.inputs.actstatus
      }`;
    }

     // payment status
     if (props.inputs && props.inputs.paymentstatus === "ALL6") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.paymentstatus) {
      queryParams += `${queryParams ? "&" : ""}payment_status=${
        props.inputs.paymentstatus
      }`;
    }


     // payment status
     if (props.inputs && props.inputs.franchiselistt === "ALL7") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.franchiselistt) {
      queryParams += `${queryParams ? "&" : ""}franchise=${
        props.inputs.franchiselistt
      }`;
    }

    // if (props.inputs && props.inputs.actstatus) {
    //   queryParams += `${queryParams ? "&" : ""}account_status=${
    //     props.inputs.actstatus
    //   }`;
    // }

    // create dates

   
    
    
    // if (props.customstartdate) {
    //   queryParams += `${queryParams ? "&" : ""}created=${
    //     props.customstartdate
    //   }`;
    // }

    // if (props.customenddate) {
    //   queryParams += `${queryParams ? "&" : ""}created_end=${
    //     props.customenddate
    //   }`;
    // }

    return queryParams;
  };

  const fetchCustomerReports = () => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams();
    customeraxios
      .get(`customers/v2/list?${queryParams}`)
      .then((response) => {
        props.setCustomerList(response.data)
        const { count, counts, next, previous, page, results } = response.data;
        updateCustomerLists((prevState) => ({
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
        updateCustomerLists((prevState) => ({
          ...prevState,
          uiState: {
            loading: false,
          },
        }));
      });
  };

  const handlePerRowsChange = (newPerPage, page) => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
      currentItemsPerPage: newPerPage,
    }));
  };

  const handlePageChange = (page) => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
    }));
  };



  return (
    <div>
      <Grid
        item
        md="12"
        style={{
          position: "relative",
          bottom: "65px",
          top: "-47px",
          textAlign: "end",
        }}
      >
        <CustomerExport
          customerLists={customerLists}
          updateCustomerLists={updateCustomerLists}
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
        <div className="department" >
          <CustomerReports
          currentTab={activeTab}
          setActiveTab={setActiveTab}
          tabCounts={customerLists.tabCounts}
          />
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
                  className="cust-reports-list"
                  columns={tableColumns}
                  data={customerLists.pageLoadData || []}
                  noHeader
                  clearSelectedRows={false}
                  progressPending={customerLists.uiState?.loading}
                  progressComponent={
                    <SkeletonLoader loading={customerLists.uiState.loading} />
                  }
                  pagination
                  paginationServer
                  paginationTotalRows={customerLists.totalRows}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  noDataComponent={"No Data"}
                  // conditionalRowStyles={conditionalRowStyles}
                />
              )}
            </Col>
          </Card>
        </div>
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

export default Modalnewreports;

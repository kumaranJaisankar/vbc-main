import React, { useState, useEffect, useMemo } from "react";
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
import { CustomerReports } from "../../../utilitycomponents/CustomerReports";
import { Prev } from "react-bootstrap/esm/PageItem";

const Modalnewreports = (props) => {
  const [currentPg, setCurrentPg] = useState(1);
  const [activeTab, setActiveTab] = useState("exp");
  const [activeTabAct, setActiveTabAct] = useState("act");
  const [activeTabSpd, setActiveTabSpd] = useState("spd");
  const [activeTabAll, setActiveTabAll] = useState("all");
  const [activeTabAbtExp, setActiveTabAbtExp] = useState("act");

  const [customerLists, updateCustomerLists] = useState({
    uiState: { loading: false },
    currentPageNo: currentPg,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,
    appliedFilters: { ...getAppliedFiltersReportsObj() },
    currentTab: "",
    tabCounts: {},
    totalRows: "",
  });

  const [initialcustomerlist, setInitialcustomerlist] = useState({
    uiState: { loading: false },
    currentPageNo: currentPg,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    // prevURI: previous,
    // nextURI: next,
    appliedFilters: { ...getAppliedFiltersReportsObj() },
    currentTab: "",
    tabCounts: {},
    totalRows: "",
  });
  const tableColumns = getCustomerReportTableColumn();
  // count api call
  const [customerCount, setCustomeCount] = useState({});
  useEffect(() => {
    setCurrentPg(1);
    // updateCustomerLists((prevState) => ({
    //   ...prevState,
    //   currentPageNo: 1,
    // }));
    const queryParams = getQueryParams();
    customeraxios
      .get(
        `customers/v3/list/count?tabs=act,exp,spd,new_customers&${queryParams}`
      )
      .then((res) => {
        setCustomeCount(res?.data?.context, "countss");
        fetchCustomerReports(1);
      });
  }, [props.inputs, props.customstartdate, props.customenddate]);

  useEffect(() => {
    fetchCustomerReports(currentPg);
  }, [
    // props.customstartdate,
    // props.customenddate,
    // props.inputs,
    currentPg,
    customerLists.currentItemsPerPage,
    customerLists.appliedFilters,
    activeTab,
    activeTabAct,
    activeTabSpd,
    activeTabAll,
    activeTabAbtExp,
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
  const getQueryParams = (curPg, isPageLimit = true) => {
    const { currentPageNo, currentItemsPerPage, appliedFilters } =
      customerLists;

    let queryParams = "";

    if (currentItemsPerPage && isPageLimit) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (curPg && isPageLimit) {
      queryParams += `${queryParams ? "&" : ""}page=${curPg}`;
    }
    if (activeTab !== "exp") {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTab
      }`;
    } else if (activeTabAct !== "act") {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTabAct
      }`;
    } else if (activeTabSpd !== "spd") {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTabSpd
      }`;
    } else if (activeTabAll !== "all") {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTabAll
      }`;
    } else if (activeTabAbtExp !== "act") {
      queryParams += `${queryParams ? "&" : ""}${
        appliedFilters.created_at_status.value.strVal
          ? getConvertedAccountStatus(
              appliedFilters.created_at_status.value.strVal
            )
          : activeTabAbtExp
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
    // if(props.branchdata && props.branchdata){

    //   queryParams += `${queryParams ? "&" : ""}service_plan=${props.branchdata.valueWithoutKey}`;

    // }

    // zones
    // if (props.inputs && props.inputs.zone === "ALL1") {
    //   queryParams += ``;
    // } else if (props.inputs && props.inputs.zone && props.sendZone) {
    //   queryParams += `${queryParams ? "&" : ""}zone=${props.inputs.zone}`;
    // }
    if (props.inputs && props.inputs.zone === "ALL1") {
      queryParams += ``;
    } else if (props.ShowAreas && props.inputs && props.inputs.zone) {
      queryParams += `&zone=${props.zoneValue}`;
    } else if (props.inputs && props.inputs.zone && props.sendZone) {
      queryParams += `&zone=${props.inputs.zone}`;
    }

    // area list

    if (props.inputs && props.inputs.area === "ALL2") {
      queryParams += ``;
    } else if (props.inputs && props.inputs.area && props.sendArea) {
      queryParams += `${queryParams ? "&" : ""}area=${props.inputs.area}`;
    }

    // query params for expiry date
    if (
      (props.customstartdate &&
        props.inputs &&
        props.inputs.actstatus === "EXP") ||
      props.inputs.actstatus === "act"
    ) {
      queryParams += `${queryParams ? "&" : ""}expiry_date=${
        props.customstartdate
      }`;
    } else if (props.customstartdate) {
      queryParams += `${queryParams ? "&" : ""}created=${
        props.customstartdate
      }`;
    }

    if (
      (props.customenddate &&
        props.inputs &&
        props.inputs.actstatus === "EXP") ||
      props.inputs.actstatus === "act"
    ) {
      queryParams += `${queryParams ? "&" : ""}expiry_date_end=${
        props.customenddate
      }`;
    } else if (props.customenddate) {
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
    } else if (
      props.inputs &&
      props.inputs.franchiselistt &&
      props.sendFranchise
    ) {
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

  // list api call
  const fetchCustomerReports = (curPg) => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      uiState: {
        loading: true,
      },
    }));
    const queryParams = getQueryParams(curPg);
    customeraxios
      .get(`customers/v3/list/new?${queryParams}`)
      .then((response) => {
        props.setCustomerList(response.data);
        const { count, counts, next, previous, page, results } = response.data;
        let newresults = response?.data?.results.map((item) => ({
          id: item?.id,
          username: item?.user?.username,
          cleartext_password: item?.user?.cleartext_password,
          area: item?.area?.name,
          area_id: item?.area?.id,
          franchise: item?.area?.franchise?.name,
          branch: item?.area?.zone?.branch?.name,
          zone: item?.area?.zone?.name,
          package_name: item?.service_plan?.package_name,
          download: item?.service_plan?.download_speed,
          upload: item?.service_plan?.upload_speed,
          user: item?.user?.id,
          first_name: item?.first_name,
          last_name: item?.last_name,
          service_plan: item?.service_plan?.id,
          service_type: item?.service_type,
          register_mobile: item?.register_mobile,
          registered_email: item?.registered_email,
          account_status: item?.account_status,
          restrict_access: item?.restrict_access,
          payment_status: item?.payment_status,
          created: item?.created,
          account_type: item?.account_type,
          expiry_date: item?.expiry_date,
          plan_updated: item?.plan_updated,
          monthly_date: item?.monthly_date,
          last_invoice_id: item?.last_invoice_id,
          radius_info: item?.radius_info,
          user_advance_info: item?.user_advance_info,
          address: item?.address,
          network_info: item?.network_info,
          acctstoptime: item?.status,
          static_ip: item?.radius_info?.static_ip_bind,
          account_type: item?.account_type,
        }));
        updateCustomerLists((prevState) => ({
          ...prevState,
          currentPageNo: currentPg,
          tabCounts: { ...counts },
          pageLoadData: [...newresults],
          prevURI: null,
          nextURI: null,
          pageLoadDataForFilter: [...newresults],
          totalRows: count,
        }));
        setInitialcustomerlist((prevState) => ({
          ...prevState,
          currentPageNo: page,
          tabCounts: { ...counts },
          pageLoadData: [...newresults],
          prevURI: previous,
          nextURI: next,
          pageLoadDataForFilter: [...newresults],
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
  // useEffect(() => {

  // }, []);

  const handlePageChange = (page) => {
    setCurrentPg(page);
    // updateCustomerLists((prevState) => ({
    //   ...prevState,
    //   currentPageNo: page,
    // }));
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
        <div className="department">
          <CustomerReports
            currentTab={activeTab}
            currentTabAct={activeTabAct}
            currentTabAbtExp={activeTabAbtExp}
            currentTabSpd={activeTabSpd}
            currentTabAlll={activeTabAll}
            setActiveTabAll={setActiveTabAll}
            setActiveTab={setActiveTab}
            setActiveTabAct={setActiveTabAct}
            setActiveTabSpd={setActiveTabSpd}
            // tabCounts={customerLists.tabCounts}
            tabCounts={customerCount}
            accoutstatus={props?.inputs?.actstatus}
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
                  paginationServerOptions={{
                    persistSelectedOnPageChange: true,
                  }}
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
                  paginationDefaultPage={currentPg}
                  paginationResetDefaultPage={true}
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

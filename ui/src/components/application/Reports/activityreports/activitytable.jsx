import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { customeraxios } from "../../../../axios";
import { Row, Table, Col } from "reactstrap";

const Modalnewreports = (props) => {
  const [customerLists, updateCustomerLists] = useState({
    uiState: { loading: false },
    currentPageNo: 1,
    currentItemsPerPage: 10,
    pageLoadData: [],
    pageLoadDataForFilter: [],
    prevURI: null,
    nextURI: null,

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

    currentTab: "all",
    tabCounts: {},
    totalRows: "",
  });

  useEffect(() => {
    fetchCustomerReports();
  }, [
    props.customstartdate,
    props.customenddate,
    props.inputs,
    customerLists.currentPageNo,
  ]);

  const getQueryParams = () => {
    const {
      currentPageNo,
      currentItemsPerPage,
      appliedFilters,
      additionalFilters,
    } = customerLists;

    let queryParams = "";

    if (currentItemsPerPage) {
      queryParams += `limit=${currentItemsPerPage}`;
    }
    if (currentPageNo) {
      queryParams += `${queryParams ? "&" : ""}page=${currentPageNo}`;
    }

    if (props.inputs && props.inputs.filterbranch) {
      queryParams += `${queryParams ? "&" : ""}branch=${
        props.inputs.filterbranch
      }`;
    }
    if (props.inputs && props.inputs.franchiselistt) {
      queryParams += `${queryParams ? "&" : ""}franchise=${
        props.inputs.franchiselistt
      }`;
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

    if (props.inputs && props.inputs.connstatus) {
      queryParams += `${queryParams ? "&" : ""}line_status=${
        props.inputs.connstatus
      }`;
    }

    if (props.inputs && props.inputs.actstatus) {
      queryParams += `${queryParams ? "&" : ""}account_status=${
        props.inputs.actstatus
      }`;
    }

    return queryParams;
  };

  const fetchCustomerReports = () => {
    const queryParams = getQueryParams();
    customeraxios
      .get(`customers/v2/list?${queryParams}`)
      .then((response) => {
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
      .catch((error) => {
        alert("wrng data");
      });
  };

  const handlePerRowsChange = (page) => {
    updateCustomerLists((prevState) => ({
      ...prevState,
      currentPageNo: page,
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
        md="10"
        style={{ position: "relative", bottom: "50px", textAlign: "end" }}
      ></Grid>
      <Grid item md="12" sx={{ display: "flex", flexFlow: "column-reverse" }}>
        {/* <Row style={{marginTop:"0px"}}>
            <Col style={{marginLeft:"22px"}}>

          
            </Col>
        </Row> */}
        <Row style={{ marginBottom: "20px" }}>
          <Col style={{ marginLeft: "282px" }}>
            <Table
              bordered={true}
              className="table table-bordered"
              style={{ width: "max-content" }}
            >
              <thead>
                <tr>
                  <th></th>
                  <th scope="col">{"New Connections"}</th>
                  <th scope="col">{"Expiry"}</th>
                  <th scope="col">{"Renewals"}</th>
                  <th scope="col">{"Payment"}</th>
                  <th scope="col">{"Online"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Branch</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Franchise</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default Modalnewreports;



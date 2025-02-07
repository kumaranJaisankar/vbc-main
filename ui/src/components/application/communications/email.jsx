import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "reactstrap";
import { campaignaxios } from "../../../axios";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
const Tab1 = (props) => {
  useEffect(() => {
    props.setLoading(true);
    campaignaxios.get(`notifications/email`).then((response) => {
      props.setNetworkdata(response.data);
      props.setLoading(false);
    });
  }, []);
  const columns = [
    {
      name: <b className="Table_columns">{"Email Template Name"}</b>,

      // selector: "users[0].username",
      sortable: false,
      cell: (row) => <span>{row.subject}</span>,
    },
    {
      name: <b className="Table_columns">{"Content for Email"}</b>,

      // selector: "users[0].username",
      sortable: false,
      cell: (row) => <span>{row.description}</span>,
    },
  ];
  return (
    // Added new component by Sudhir
    <>
      <Row>
        <Col md="12" className="department">
          <Card style={{ borderRadius: "0", boxShadow: "none" }}>
            <Col xl="12" style={{ padding: "0" }}>
              <nav aria-label="Page navigation example">
                {props.loading ? (
                  <Skeleton
                    count={7}
                    height={30}
                    style={{ marginBottom: "10px", marginTop: "15px" }}
                  />
                ) : (
                  <div className="data-table-wrapper">
                    <DataTable
                      columns={columns}
                      data={props.networkdata}
                      noHeader
                      // onSelectedRowsChange={({ selectedRows }) => (
                      //   handleSelectedRows(selectedRows),
                      //   deleteRows(selectedRows)
                      // )}
                      pagination
                      noDataComponent={"No Data"}
                    />
                  </div>
                )}
              </nav>
            </Col>
            <br />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Tab1;

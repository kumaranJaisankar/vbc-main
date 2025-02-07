import React, { Fragment, useState, useRef, useEffect } from "react";
import { Search } from "react-feather";
import { adminaxiosFranchiseSwitch } from "../../axios";
import { toast } from "react-toastify";

import { Button, Table, Input, Form, Col, Row, Label, FormGroup, Spinner } from "reactstrap";

import { classes } from "../../data/layouts";
import FrachiseMultiselect from "./franchisemulti"
const OtherFracnhiseModal = (props) => {
  const [loadingIds, setLoadingIds] = useState([]); // State variable to track loading IDs
  const submit = (e, id) => {
    setLoadingIds((prevLoadingIds) => [...prevLoadingIds, id]); // Add ID to loadingIds array
    e.preventDefault();

    let data = {};
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    adminaxiosFranchiseSwitch
      .post(`/accounts/franchise/${id}/user/login`, data, config)
      .then((response) => {
        localStorage.removeItem("Dashboard");
        localStorage.removeItem("DashboardData");
        localStorage.removeItem('CustomerActiveCard');
        localStorage.removeItem('NewCustomerData');
        localStorage.removeItem('HeaderData');
        localStorage.removeItem('PaymentData');
        localStorage.removeItem('LeadData');
        localStorage.removeItem('NetworkData');
        toast.success("Logging in", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.franchiseSwitchModal();
       
        localStorage.setItem("token", JSON.stringify(response.data));
        //  document.getElementById("hiddenBtn").click();

        const defaultLayoutObj = classes.find(
          (item) => Object.values(item).pop(1) === "compact-wrapper"
        ); //here they are gettting thee layout

        const layout =
          localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();

        window.location.href = `${process.env.PUBLIC_URL}/app/dashboard/${layout}`;
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      })
      .finally(() => {
        setLoadingIds((prevLoadingIds) => prevLoadingIds.filter((loadingId) => loadingId !== id)); // Remove ID from loadingIds array
      });
  };




 
  //filter
  const handlesearchtable = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = props.tabledata.filter((data) => {
      console.log(data);
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    props.setAlldata(result);
  };

  const searchInputField = useRef(null);

  return (
    <Fragment>
      <Row style={{ marginTop: "38px" }}>
        <Col sm="6" style={{ marginTop: "-45px" }}>
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Branch </Label>
              <FrachiseMultiselect
                data={props?.branchList}
                setValues={props?.setFormData}
                franchisedata1={props.franchisedata1}
                datasubmit={props.datasubmit}
              />
            </div>
          </FormGroup>
        </Col>
        <Col md="6">
          <Form>
            <div
              className="search_iconbox"
              style={{
                borderRadius: "3px",
                width: "29rem",
              }}
            >
              <Input
                className="form-control"
                type="text"
                placeholder="Search With name"
                onChange={(event) => handlesearchtable(event)}
                ref={searchInputField}
                style={{
                  // marginTop:"40px",
                  // width: "17rem",
                  border: "none",
                  backgroundColor: "white",
                }}
              />

              <Search
                className="search-icon"
                style={{
                  border: "none",
                  position: "absolute",
                  right: "1.5rem",
                  color: "#3B3B3B",
                }}
              />
            </div>
          </Form>
        </Col>
      </Row>
      <br />
      <br />
      {props?.alldata && (
        <tr>
          <td>
            <Button
              id="Add_money"
              color="btn btn-primary"
              disabled={props.loaderSpinneer ? props.loaderSpinneer : props.loaderSpinneer}
              onClick={props.loginbackasadmin}
              type="submit"
              name="submit"
              style={{ width: "auto" }}
            >
            {props.loaderSpinneer ?  <Spinner size="sm"> </Spinner> :null} &nbsp;
              Login As Admin
            </Button>
          </td>
        </tr>
      )}
      <br />
      <Table bordered={true} className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">{""}</th>
            <th scope="col">{"ID"}</th>
            <th scope="col">{"Name"}</th>
            <th scope="col">{"Username"}</th>
            <th style={{ whiteSpace: "nowrap" }} scope="col">
              {"Wallet Amount"}
            </th>
            <th style={{ whiteSpace: "nowrap" }} scope="col">
              {"Franchise Type"}
            </th>
          </tr>
        </thead>
        <tbody>

          {props.alldata.map((i) => {
        const isLoading = loadingIds.includes(i.id); // Check if the current ID is in the loadingIds array
            
            return (
              <tr key={i.id}>
                <td>
                  {" "}
                  <Button
                    id="Add_money"
                    color="btn btn-primary"
                    disabled={isLoading}
                    onClick={(e) => {
                      submit(e, i.id);
                    }}
                    type="submit"
                    name="submit"
                  >
                  {isLoading ? <Spinner size="sm" /> : null} &nbsp;
                   Login As
                  </Button>
                </td>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.owner}</td>
                {/* <td>{i.branch && i.branch.owner && i.branch.owner.username}</td> */}
                <td>{"₹" + parseFloat(i.wallet_amount).toFixed(2)}</td>
                <td>{i.type && i.type.name}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Fragment>
  );
};
export default OtherFracnhiseModal;

import React, { Fragment, useState, useRef } from "react";
import { Search, } from "react-feather";
import { useHistory } from "react-router-dom";
import { adminaxios } from "../../axios";
import { toast } from "react-toastify";
import { Button, Table, Input, Form, Col, Row, FormGroup, Label, Spinner} from "reactstrap";
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { classes } from "../../data/layouts";
import Multiselect from "./multiselect"

const FranchiseDetailsTable = (props) => {
  const history = useHistory();
  // const [loading, setLoading] = useState(false);
  const [loadingIds, setLoadingIds] = useState([]); // State variable to track loading IDs

  const submit = (e, id) => {
    setLoadingIds((prevLoadingIds) => [...prevLoadingIds, id]); // Add ID to loadingIds array
    // props.setLoaderSpinner(true);
    // setLoading(true);
    // alert('hi')
    e.preventDefault();

    let data = {};
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    adminaxios
      .post(`/accounts/franchise/${id}/user/login`, data, config)
      .then((response) => {
        toast.success("Logging in", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        props.Verticalcentermodaltoggle();
        localStorage.removeItem("Dashboard");
        localStorage.removeItem("DashboardData");
        localStorage.removeItem('CustomerActiveCard');
        localStorage.removeItem('NewCustomerData');
        localStorage.removeItem('HeaderData');
        localStorage.removeItem('PaymentData');
        localStorage.removeItem('LeadData');
        localStorage.removeItem('NetworkData');
        const superadmintoken = localStorage.getItem("token");
        //backup for token
        localStorage.setItem("backup", superadmintoken);
        //end
        // localStorage.removeItem('token');
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
      if (data.name.toLowerCase().search(value) != -1) return data;
    });
    props.setAlldata(result);
  };

  const searchInputField = useRef(null);
  const loginbackasadmin1 = () => {
    var tokenbackup = localStorage.getItem("backup");
    localStorage.setItem("token", tokenbackup);
    localStorage.removeItem("backup");
    localStorage.setItem("popup", true)

    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === "compact-wrapper"
    );
    const layout =
      localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();


    window.location.href = `${process.env.PUBLIC_URL}/app/dashboard/${layout}`;

    toast.success("Logging in as admin", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 1000,
    });
  }


  return (
    <Fragment>
      <Row style={{ marginTop: "38px" }}>
        <Col sm="6" style={{ marginTop: "-45px" }}>
          <FormGroup>
            <div className="input_wrap">
              <Label className="kyc_label">Branch </Label>
              <Multiselect
                data={props?.branchList}
                setValues={props?.setFormData}
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
              {/* Sailaja Changed line no 110 on 12th July */}
              <Input
                className="form-control"
                type="text"
                placeholder="Search With Name"
                onChange={(event) => handlesearchtable(event)}
                ref={searchInputField}
                style={{
                  // marginTop:"40px",
                  // width: "17rem",
                  border: "none",
                  backgroundColor: "white",
                }}
              />
              {/* Sailaja added line no 126 &127 Reference custID 05 */}
              <Search
                className="search-icon"
                style={{
                  border: "none",
                  position: "absolute",
                  right: "1.5rem",
                  color: "##80808",
                  width: "6%",
                }}
              />
            </div>
          </Form>
        </Col>
      </Row>
      <br />
      <br />
      {props.alldata.length === 0 ? <Box sx={{ width: 900 }}>
        <Skeleton />
        <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} /> <Skeleton animation="wave" height={30} />
        <Skeleton animation={false} />
      </Box>
        : <Table
          bordered={true}
          className="table table-bordered"
        >
          <thead>
            <tr>
              <th scope="col">{""}</th>
              <th scope="col">{"ID"}</th>
              <th scope="col">{"Name"}</th>
              <th scope="col">{"Username"}</th>
              <th style={{ whiteSpace: "nowrap" }} scope="col">{"Wallet Amount"}</th>
              <th style={{ whiteSpace: "nowrap" }} scope="col">{"Franchise Type"}</th>
              {/* Sailaja Changed line no 148,149 on 12th July */}
            </tr>
          </thead>
          <tbody>
            {/* {localStorage.getItem("popup") &&
              <tr>
                <td><Button
                  id="Add_money"
                  color="btn btn-primary"
                  onClick={loginbackasadmin1}
                  type="submit"
                  name="submit"
                  style={{ width: "auto" }}
                >
                  Login As Admin
                </Button></td>
              </tr>
            } */}
            {props.alldata.map((i) => {
            const isLoading = loadingIds.includes(i.id); // Check if the current ID is in the loadingIds array

              return (
                <tr  key={i.id}>
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
      }
    </Fragment>
  );
};
export default FranchiseDetailsTable;

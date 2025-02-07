import React, { Fragment, useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  FormGroup,
  Button,
  CardHeader,
  Modal,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Table,
} from "reactstrap";
import { CreateNewProfile, Okay } from "../../../constant";
import {default as axiosBaseURL } from "../../../axios";
import {  PlusCircle } from "react-feather";
import { Link } from "react-router-dom";
const ProfileList = () => {
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const Verticalcentermodaltoggle = () => setVerticalcenter(!Verticalcenter);

  const [isChecked, setIsChecked] = useState([]);
  const [failed, setFailed] = useState([]);
  const [profilesList, setProfilesList] = useState([]);

  useEffect(() => {
    axiosBaseURL.get("/radius/group/display")
      .then((response) => {
      
      setProfilesList(response.data)
      })

  }, []);

  // useEffect(() => {
  //   var token = JSON.parse(localStorage.getItem("token"));
  //   console.log(token);
  //   var head = { Authorization : "Bearer " + token.access };
  //   fetch("https://4d668c7d1e99.ngrok.io/radius/group/display", { headers: head })
  //     .then((response) => response.json())
  //     .then((json) => setProfilesList(json));
  // }, []);

  // const onDelete = (groupname) => {
  //   console.log(groupname);
  //   fetch("https://4d668c7d1e99.ngrok.io/radius/group/delete/" + groupname, {
  //     method: "POST",
  //   })
  //     .then((response) => response.json())
  //     .then((json) => {
  //       if (json) {
  //         let temp = profilesList;
  //         temp = temp.filter((i) => i.groupname !== groupname);
  //         console.log(temp);
  //         setProfilesList(temp);
  //       } else {
  //         setVerticalcenter(true);
  //         // alert("Please remove all dependencies ");
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  let modal = (
    <Modal isOpen={Verticalcenter} toggle={Verticalcentermodaltoggle} centered>
      <ModalBody>
        <p style={{ textAlign: "center" }}>
          <b>{failed.toString() + " this profile is assigned to user ."}</b>
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={Verticalcentermodaltoggle}>
          {Okay}
        </Button>
      </ModalFooter>
    </Modal>
  );

  const onDelete = () => {
    axiosBaseURL.post("/radius/group/delete/multiple", {
      
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ groupname: isChecked }),
    })
      .then((response) => response.json())
      .then((data) => {
        var difference = [];
        if (data.length > 0) {
          difference = [...isChecked].filter((x) => data.indexOf(x) === -1);
          //   setProfilesList((prevState) =>
          //   prevState.filter((el) => difference.indexOf(el.groupname) === -1)
          // );
          setFailed([...data]);
        } else {
          difference = [...isChecked];
        }

        setProfilesList((prevState) =>
          prevState.filter((el) => difference.indexOf(el.groupname) === -1)
        );

        setIsChecked([]);
        if (data.length > 0) {
          // alert(data.toString()+" not deleted ")
          setVerticalcenter(true);
        }
      });
  };

  const handleSingleCheck = (e) => {
    if (e.target.checked) {
      setIsChecked((prevState) => [...prevState, e.target.name]);
    } else {
      setIsChecked((prevState) =>
        prevState.filter((el) => el != e.target.name)
      );
    }
    console.log(isChecked);
  };

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col md="12" className="project-list">
              <Card>
                <CardHeader style={{ padding: "20px", borderRadius: "10px" }}>
                  <div className="header-top">
                    <h5 className="m-0">Profile List</h5>
                    <div className="card-header-right-icon">
                      <i
                        className="icofont icofont-ui-delete"
                        style={{
                          color: "red",
                          fontSize: "21px",
                          cursor: "pointer",
                        }}
                        onClick={() => onDelete()}
                      ></i>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Row>
                <div className="text-right">
                  <FormGroup className="mb-0 mr-0"></FormGroup>
                  <Link
                    className="btn btn-primary"
                    style={{ color: "white" }}
                    to={`${process.env.PUBLIC_URL}/app/project/userprofile/${process.env.REACT_APP_API_URL_Layout_Name}`}
                  >
                    {" "}
                    <PlusCircle />
                    {CreateNewProfile}
                  </Link>
                </div>
              </Row>
            </Col>

            {/* end */}

            {/* 
            <Col md="12">
              <Card>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th></th>
                        <th>Group Name</th>
                        <th>Attribute</th>
                        <th>Operator</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profilesList.map((item, i) => (
                        <tr key={i}>
                          <td>
                            <Label className="d-block" for="chk-ani1">
                              <Input
                                className="checkbox_animated"
                                id="chk-ani1"
                                type="checkbox"
                                name={item.groupname}
                                checked={
                                  isChecked.indexOf(item.groupname) != -1
                                    ? true
                                    : false
                                }
                                onChange={handleSingleCheck}
                              />
                            </Label>
                          </td>
                          <td>{item.groupname}</td>
                          <td>{item.attribute}</td>
                          <td>{item.op}</td>
                          <td>{item.value}</td>
                          <td className="case-record">
                            {/* <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => onDelete(item.groupname)}
                            >
                              Delete
                            </button> */}
            {/* </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Col>  */}

            <Col sm="12">
              <Card>
                <Row className="card-block">
                  <Col sm="12" lg="12" xl="12">
                    <div
                      className="table-responsive"
                      style={{ borderRadius: "10px" }}
                    >
                      <Table>
                        <thead className="table-primary">
                          <tr>
                            <th></th>
                            <th>Group Name</th>
                            <th>Attribute</th>
                            <th>Operator</th>
                            {/* <th>Value</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {profilesList.map((item, i) => (
                            <tr key={i}>
                              <td>
                                <Label className="d-block" for="chk-ani1">
                                  <Input
                                    className="checkbox_animated"
                                    id="chk-ani1"
                                    type="checkbox"
                                  />
                                </Label>
                              </td>
                              {/* <td>{item.id}</td> */}
                              <td>{item.groupname}</td>
                              <td>{item.attribute}</td>
                              <td>{item.op}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        {modal}
      </Container>
    </Fragment>
  );
};

export default ProfileList;

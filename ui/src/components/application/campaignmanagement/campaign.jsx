import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import {
  Container,
  Row,
  Col,
  CardBody,
  CardHeader,
  Card,
  TabPane,
  TabContent,
  NavItem,
  NavLink,
  Nav,
  Button,
  ModalFooter,
  ModalHeader,
  Modal,
  FormGroup,
  Form,
  Label,
  Input,
} from "reactstrap";
import { Search, ModalTitle, CopyText, Cancel } from "../../../constant";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { BasicTabs } from "../../../constant";
import AddBranch from "../administration/addbranch";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import { classes } from "../../../data/layouts";
import { CopyToClipboard } from "react-copy-to-clipboard";
import SmsFields from "./smsfields";
import EmailFields from "./emailfields";
import CKEditor from "react-ckeditor-component";
import DataTable from "react-data-table-component";
import { campaignaxios } from "../../../axios";


const Campaign = (props, initialValues) => {
  const [modal, setModal] = useState();
  const [lead, setLead] = useState([]);
  const [activeTab1, setActiveTab1] = useState("1");
  const [BasicTab, setBasicTab] = useState("1");
  const [rightSidebar, setRightSidebar] = useState(true);
  const [userList, setUserlist] = useState([]);
  const [errors, setErrors] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [searchedUsers, setSearchedUsers] = useState();

  const [formData, setFormData] = useState({
    users: [],
    mode: "EMAIL",
    body: "",
    subject: "",
  });

  let history = useHistory();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const dispatch = useDispatch();
  //modal pop up
  const toggle = () => {
    setModal(!modal);
  };

  //handlechangeevent

  const handleInputChange = (event) => {
    if (event.name === "change") {
      console.log("onChange fired with event info: ", event);
      var newContent = event.editor.getData();
      setFormData((preState) => ({
        ...preState,
        ["body"]: newContent,
      }));
    } else {
      event.persist();
      setInputs((inputs) => ({
        ...inputs,
        [event.target.name]: event.target.value,
      }));

      const target = event.target;
      var value = target.value;
      const name = target.name;
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };
  //end

  //onblur event

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  //end
  //close side panel
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };
  //open side panel on click of new button
  const openCustomizer = (type, id) => {
    console.log(id);
    if (id) {
      setLead(id);
    }
    setActiveTab1(type);
    setRightSidebar(!rightSidebar);
    if (rightSidebar) {
      document.querySelector(".customizer-contain").classList.add("open");

      // document.querySelector(".customizer-links").classList.add('open');
    }
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  //on submit sending data throuhj api
  // const submit = () => {
  //   console.log(formData);
  // };
  // const userList=[
  //   { "email": "aaa@bbb.com", "mobile_number": "+919988778899", "username": "Kalyan" },
  //   { "email": "bbb@bbb.com", "mobile_number": "+919955115599", "username": "Sanjay" },
  //   { "email": "ccc@bbb.com", "mobile_number": "+919966336699", "username": "Vinay" },
  //   { "email": "ddd@bbb.com", "mobile_number": "+918855225588", "username": "Hanmanth" },
  //   { "email": "eee@bbb.com", "mobile_number": "+917788998877", "username": "Jivan" }
  // ]
  const columns = [
    {
      name: "Registered email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Registered Mob",
      selector: "mobile_number",
      sortable: true,
    },
    {
      name: "Username",
      selector: "username",
      sortable: true,
    },
  ];
  // form submit
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const data = { ...formData };
    data.users = searchedUsers.map((user) => user.email);
    //
    campaignaxios
      .post("notify/users", data, config)
      .then((response) => {
        console.log(response.data);
        // props.onUpdate(response.data);
        // props.setUserlist(response.data);
        // resetformmanually();
        toast.success("Email sent successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
        console.error("Something went wrong!", error);
      });
  };

  //form ref
  const form = useRef(null);

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col sm="12">
              <Card>
                <CardHeader>
                  <h5>Campaign</h5>
                </CardHeader>
                <CardBody>
                  <Nav tabs>
                    <NavItem>
                      <NavLink
                        href="#javascript"
                        className={BasicTab === "1" ? "active" : ""}
                        onClick={() => {
                          closeCustomizer();
                          setBasicTab("1");
                        }}
                        // onClick={closeCustomizer}
                      >
                        SMS
                      </NavLink>
                    </NavItem>

                    <NavItem>
                      <NavLink
                        href="#javascript"
                        className={BasicTab === "3" ? "active" : ""}
                        onClick={() => {
                          closeCustomizer();
                          setBasicTab("3");
                        }}
                        // onClick={() => setBasicTab("3")}
                        // onClick={closeCustomizer}
                      >
                        Email
                      </NavLink>
                    </NavItem>
                  </Nav>
                  {/* message template */}
                  <TabContent activeTab={BasicTab}>
                    <TabPane className="fade show" tabId="1">
                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control"
                                type="text"
                                name="name"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                              />
                              <Label className="placeholder_styling">
                                Campaign Name *
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>
                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control not-empty"
                                type="datetime-local"
                                id="meeting-time"
                                name="response_time"
                                // name="assigned_date"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                                // value={inputs.first_name}
                                maxLength="15"
                              />
                              <Label
                                for="meeting-time"
                                className="placeholder_styling"
                              >
                                Start Date
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>

                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control not-empty"
                                type="datetime-local"
                                id="meeting-time"
                                name="response_time"
                                // name="assigned_date"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                                // value={inputs.first_name}
                                maxLength="15"
                              />
                              <Label
                                for="meeting-time"
                                className="placeholder_styling"
                              >
                                End Date
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>
                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                type="select"
                                name=""
                                className="form-control digits"
                                // onChange={(event) => {
                                //   handleInputChange(event);
                                // }}
                                // onBlur={checkEmptyValue}
                              >
                                <option
                                  value=""
                                  style={{ display: "none" }}
                                ></option>

                                <option value="prepaid">Daily</option>
                                <option value="postpaid">Weekly</option>
                                <option value="postpaid">Monthly</option>
                              </Input>
                              <Label className="placeholder_styling">
                                Frequency
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>

                      <p className="mb-0 m-t-30">
                        <Button
                          color="btn btn-primary"
                          className="mr-3"
                          type="submit"
                          onClick={() => openCustomizer("2")}
                        >
                          Select Recepient
                        </Button>
                      </p>
                      <br />
                      {/* table */}
                      <Col md="12" style={{ marginTop: "2%" }}>
                        <Card
                          style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
                        >
                          <Col xl="12">
                            <nav aria-label="Page navigation example">
                              {props.loading ? (
                                <Skeleton
                                  count={11}
                                  height={30}
                                  style={{
                                    marginBottom: "10px",
                                    marginTop: "15px",
                                  }}
                                />
                              ) : (
                                <div>
                                  {/* <DataTableExtensions
                          {...exportData}
                          print={false}
                          filter={false}
                          export={false}
                          filterHidden={false}
                          exportHeaders={true}
                          // defaultSortFiled={true}
                        > */}
                                  <DataTable
                                    className="sms"
                                    columns={columns}
                                    data={userList}
                                    noHeader
                                    // striped={true}
                                    // center={true}
                                    clearSelectedRows={true}
                                    selectableRows
                                    onSelectedRowsChange={({ selectedRows }) =>
                                      console.log(selectedRows)
                                    }
                                    // clearSelectedRows={clearSelectedRows}
                                    pagination
                                    noDataComponent={"No Data"}
                                    // clearSelectedRows={clearSelection}
                                  />
                                  {/* </DataTableExtensions> */}
                                </div>
                              )}
                            </nav>
                          </Col>
                          <br />
                        </Card>
                      </Col>

                      <Row>
                        <Col sm="3">
                          <h6>Total Users Found:</h6>
                        </Col>
                        {/* <Col sm="3">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control"
                                type="text"
                                name="mobile"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                              />
                              <Label className="placeholder_styling">
                                Register Mob No.
                              </Label>
                            </div>
                          </FormGroup>
                        </Col> */}
                      </Row>
                      <Row>
                        <Col sm="12">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                type="textarea"
                                className="form-control"
                                rows="3"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                              />
                              <Label className="placeholder_styling">
                                Message
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col>
                          <Button
                            color="btn btn-primary"
                            type="submit"
                            className="mr-3"
                            // onClick={resetInputField}
                          >
                            Submit
                          </Button>
                        </Col>
                      </Row>
                    </TabPane>

                    <TabPane tabId="3">
                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control"
                                type="text"
                                name="name"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                              />
                              <Label className="placeholder_styling">
                                Campaign Name *
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>

                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control not-empty"
                                type="datetime-local"
                                id="meeting-time"
                                name="response_time"
                                // name="assigned_date"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                                // value={inputs.first_name}
                                maxLength="15"
                              />
                              <Label
                                for="meeting-time"
                                className="placeholder_styling"
                              >
                                Start Date
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>

                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                className="form-control not-empty"
                                type="datetime-local"
                                id="meeting-time"
                                name="response_time"
                                // name="assigned_date"
                                // onChange={handleInputChange}
                                // onBlur={checkEmptyValue}
                                // value={inputs.first_name}
                                maxLength="15"
                              />
                              <Label
                                for="meeting-time"
                                className="placeholder_styling"
                              >
                                End Date
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>
                      <p className="mb-0 m-t-30">
                        <Col sm="4">
                          <FormGroup>
                            <div className="input_wrap">
                              <Input
                                type="select"
                                name=""
                                className="form-control digits"
                                // onChange={(event) => {
                                //   handleInputChange(event);
                                // }}
                                // onBlur={checkEmptyValue}
                              >
                                <option
                                  value=""
                                  style={{ display: "none" }}
                                ></option>

                                <option value="prepaid">Daily</option>
                                <option value="postpaid">Weekly</option>
                                <option value="postpaid">Monthly</option>
                              </Input>
                              <Label className="placeholder_styling">
                                Frequency
                              </Label>
                            </div>
                          </FormGroup>
                        </Col>
                      </p>
                      <br />
                      <p className="mb-0 m-t-30">
                        <Button
                          color="btn btn-primary"
                          className="mr-3"
                          type="submit"
                          onClick={() => openCustomizer("3")}
                        >
                          Select Recepient
                        </Button>
                      </p>
                      <Col md="12" style={{ marginTop: "2%" }}>
                        <Card
                          style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}
                        >
                          <Col xl="12">
                            <nav aria-label="Page navigation example">
                              {props.loading ? (
                                <Skeleton
                                  count={11}
                                  height={30}
                                  style={{
                                    marginBottom: "10px",
                                    marginTop: "15px",
                                  }}
                                />
                              ) : (
                                <div>
                                  {/* <DataTableExtensions
                          {...exportData}
                          print={false}
                          filter={false}
                          export={false}
                          filterHidden={false}
                          exportHeaders={true}
                          // defaultSortFiled={true}
                        > */}
                                  <DataTable
                                    className="sms"
                                    columns={columns}
                                    data={userList}
                                    noHeader
                                    // striped={true}
                                    // center={true}
                                    clearSelectedRows={true}
                                    selectableRows
                                    onSelectedRowsChange={({
                                      selectedRows,
                                    }) => {
                                      console.log(selectedRows);
                                      setSearchedUsers(selectedRows);
                                    }}
                                    // clearSelectedRows={clearSelectedRows}
                                    pagination
                                    noDataComponent={"No Data"}
                                    // clearSelectedRows={clearSelection}
                                  />
                                  {/* </DataTableExtensions> */}
                                </div>
                              )}
                            </nav>
                          </Col>
                          <br />
                        </Card>
                      </Col>
                      <br />
                      {/* email template */}
                      <div className="email-wrapper">
                        <Form className="theme-form">
                          <FormGroup>
                            <Label>Subject</Label>

                            <div className="input_wrap">
                              <Input
                                className="form-control"
                                type="text"
                                name="subject"
                                onChange={handleInputChange}
                                onBlur={checkEmptyValue}
                              />
                            </div>
                          </FormGroup>
                          <FormGroup className="mb-0">
                            <Label className="text-muted">Messages</Label>
                            <CKEditor
                              activeclassName="p10"
                              name="body"
                              onChange={handleInputChange}
                              type="text"
                              content={formData && formData.body}
                              events={{
                                afterPaste: handleInputChange,
                                change: handleInputChange,
                              }}
                            />
                          </FormGroup>
                        </Form>
                      </div>
                      <br />
                      <Row>
                        <Form onSubmit={submit} id="myForm" ref={form}>
                          <Col>
                            <Button
                              color="btn btn-primary"
                              type="submit"
                              className="mr-3"
                            >
                              Submit
                            </Button>
                          </Col>
                        </Form>
                      </Row>
                    </TabPane>
                  </TabContent>
                </CardBody>
              </Card>
              <br />
            </Col>
            {/* code */}
            <Row>
              <Col md="12">
                <div className="customizer-contain">
                  <div className="tab-content" id="c-pills-tabContent">
                    <div
                      className="customizer-header"
                      style={{ padding: "0px", border: "none" }}
                    >
                      <i className="icon-close" onClick={closeCustomizer}></i>

                      <Modal
                        isOpen={modal}
                        toggle={toggle}
                        className="modal-body"
                        centered={true}
                      >
                        <ModalHeader toggle={toggle}>{ModalTitle}</ModalHeader>
                        <ModalFooter>
                          <CopyToClipboard text={JSON.stringify(configDB)}>
                            <Button
                              color="primary"
                              className="notification"
                              onClick={() =>
                                toast.success("Code Copied to clipboard !", {
                                  position: toast.POSITION.BOTTOM_RIGHT,
                                })
                              }
                            >
                              {CopyText}
                            </Button>
                          </CopyToClipboard>
                          <Button color="secondary" onClick={toggle}>
                            {Cancel}
                          </Button>
                        </ModalFooter>
                      </Modal>
                    </div>
                    <div className=" customizer-body custom-scrollbar">
                      <TabContent activeTab={activeTab1}>
                        <TabPane tabId="2">
                          <h6 style={{ textAlign: "center" }}>Send SMS</h6>
                          <ul
                            className="layout-grid layout-types"
                            style={{ border: "none" }}
                          >
                            <li
                              data-attr="compact-sidebar"
                              onClick={(e) => handlePageLayputs(classes[0])}
                            >
                              <div className="layout-img">
                                <SmsFields
                                  setUserlist={setUserlist}
                                  dataClose={closeCustomizer}
                                  // onUpdate={(data) => update(data)}
                                  rightSidebar={rightSidebar}
                                />
                              </div>
                            </li>
                          </ul>
                        </TabPane>
                        <TabPane tabId="3">
                          <h6 style={{ textAlign: "center" }}>Send Email</h6>
                          <EmailFields
                            setUserlist={setUserlist}
                            lead={lead}
                            // onUpdate={(data) => detailsUpdate(data)}
                            rightSidebar={rightSidebar}
                            dataClose={closeCustomizer}
                          />
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default Campaign;

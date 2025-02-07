import React, {
  Fragment,
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CardHeader,
  Table,
  Card,
} from "reactstrap";
import Skeleton from "react-loading-skeleton";
import DataTable from "react-data-table-component";
import useFormValidation from "../../customhooks/FormValidation";
import { useHistory } from "react-router-dom";
import { classes } from "../../../data/layouts";

import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { staffaxios } from "../../../axios";
import { BasciInformation, Add, Cancel, InputSizing } from "../../../constant";
import { toast } from "react-toastify";
import { ADD_SIDEBAR_TYPES } from "../../../redux/actionTypes";
import Addvisit from "./addvisit";

const Visit = (props, initialValues) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFiltereddata] = useState(data);
  const [isfieldsvisible, setIsfieldsvisible] = useState(false);
  const [buttonhide, setButtonhide] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [lead, setLead] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const configDB = useSelector((content) => content.Customizer.customizer);

  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  const [filter, setFilter] = useState({
    first_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });

  const handleInputChange = (event) => {
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
  };

  const resetformmanually = () => {
    setFormData({
      name: "",
      email: "",
      mobile: "",
      landline: "",
      street: "",
    });
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  //validdations

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => {
    setIsfieldsvisible(true);
    setButtonhide(false);
  };
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };

  const form = useRef(null);

  //validation
  const requiredFields = [];
  const { validate, Error } = useFormValidation(requiredFields);

  // table columns
  const columns = [
    {
      name: "ID",
      selector: "id",
      cell: (row) => <p>V00{row.id}</p>,
      sortable: true,
    },

    {
      name: "Contacted person",
      selector: "contacted_person",
      sortable: true,
    },
    {
      name: "Category",
      selector: "category",
      sortable: true,
    },
    {
      name: "Check in",
      selector: "check_in",
      sortable: true,
    },
    {
      name: "Check out",
      selector: "check_out",
      sortable: true,
    },
    {
      name: "Notes",
      selector: "notes",
      sortable: true,
    },
  ];

  let history = useHistory();

  const dispatch = useDispatch();

  let DefaultLayout = {};

  function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize(window.innerWidth);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  }

  useEffect(() => {
    setLoading(true);
    const defaultLayoutObj = classes.find(
      (item) => Object.values(item).pop(1) === sidebar_type
    );
    const modifyURL =
      process.env.PUBLIC_URL +
      "/dashboard/default/" +
      Object.keys(defaultLayoutObj).pop();
    const id =
      window.location.pathname === "/"
        ? history.push(modifyURL)
        : window.location.pathname.split("/").pop();
    // fetch object by getting URL
    const layoutobj = classes.find((item) => Object.keys(item).pop() === id);
    const layout = id ? layoutobj : defaultLayoutObj;
    DefaultLayout = defaultLayoutObj;
    handlePageLayputs(layout);
    axios
      // staffaxios
      .get(`http://fbba-223-184-2-115.ngrok.io/tmv/create/list`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        console.log(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  }, [refresh]);

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  const update = (newRecord) => {
    setData([...data, newRecord]);

    setFiltereddata((prevFilteredData) => [newRecord, ...prevFilteredData]);
    setLoading(true);
    console.log(newRecord);
    // staffaxios
    axios
      .get(`http://fbba-223-184-2-115.ngrok.io/tmv/create/list`)
      // .then((res) => setData(res.data))
      .then((res) => {
        setData(res.data);
        setFiltereddata(res.data);
        setLoading(false);
        setRefresh(0);
      });
  };

  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="date"
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        From
                      </Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="date"
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        To
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <button class="btn btn-primary">
                    <i
                      className="icon-share"
                      style={{
                        color: "white",
                        fontSize: "22px",
                        cursor: "pointer",
                      }}
                    ></i>
                    &nbsp;&nbsp;Export
                  </button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col sm="12">
                  <p>
                    Note<span style={{ color: "red" }}>*</span>:From date should
                    always be less than to data
                  </p>
                </Col>
              </Row>
              <Row>
                <Col md="12" style={{ marginTop: "2%" }}>
                  <Card style={{ border: "1px solid rgba(0, 0, 0, 0.1)" }}>
                    <Col xl="12">
                      <nav aria-label="Page navigation example">
                        {loading ? (
                          <Skeleton
                            count={11}
                            height={30}
                            style={{ marginBottom: "10px", marginTop: "15px" }}
                          />
                        ) : (
                          <div>
                            <DataTable
                              columns={columns}
                              data={filteredData}
                              noHeader
                              selectableRows
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
              {isfieldsvisible ? (
                <div>
                  <Row>
                    <Addvisit
                      onUpdate={(data) => update(data)}
                      lead={props.lead}
                    />
                  </Row>
                </div>
              ) : null}

              {buttonhide ? (
                <Row>
                  <Col sm="4">
                    <Button
                      color="btn btn-primary"
                      // type="submit"
                      // className="mr-3"
                      onClick={resetInputField}
                    >
                      Add Visit
                    </Button>
                  </Col>
                </Row>
              ) : null}

              <br />
              <br />
              <br />
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Visit;

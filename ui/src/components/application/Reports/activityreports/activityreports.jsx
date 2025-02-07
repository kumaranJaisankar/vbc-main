import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import {
  Container,
  Row,
  Col,
  Input,
  FormGroup,
  Label,
} from "reactstrap";
import { adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { ADD_SIDEBAR_TYPES } from "../../../../redux/actionTypes";

var storageToken = localStorage.getItem("token");
var tokenAccess = "";
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
  var tokenAccess = token?.access;
}

const ActivityReports = (props, initialValues) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //state for customer
  const [customer, setCustomer] = useState();
  //state for franchise
  const [franchise, setFranchise] = useState();
  //end
  //state for billig
  const [billing, setBilling] = useState();
  //end
  //state for ticket
  const [ticket, setTicket] = useState();
  //end

  const [inputs, setInputs] = useState(initialValues);
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  const [branchfilter, setBranchfilter] = useState([]);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);
  //state for search

  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.filterbranch !== undefined ||
      inputs.franchiselistt !== undefined
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.customstartdate, props.customenddate, inputs]);

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

  const toggle = () => {
    props.setOnsearch((prevState)=>{
return !prevState
    });
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  const handlePageLayputs = (type) => {
    let key = Object.keys(type).pop();
    let val = Object.values(type).pop();
    document.querySelector(".page-wrapper").className = "page-wrapper " + val;
    dispatch({ type: ADD_SIDEBAR_TYPES, payload: { type: val } });
    localStorage.setItem("layout", key);
    history.push(key);
  };

  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");
  });

 
  //handle change event
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    let val = event.target.value;

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "filterbranch") {
      getlistoffranchises(val);
    }
  };

  useEffect(() => {
    adminaxios
      .get(`franchise/branches`)
      .then((res) => {
        let { branches } = res.data;
        setBranchfilter([...branches]);
      })
      .catch((err) =>
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        })
      );
  }, []);
  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        console.log(response.data);
        setOnfilterbranch(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };
  //end

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const box = useRef(null);

  return (
    <Fragment>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row >
            <div style={{ display: "flex", marginRight: "108px" }}>
              <Col sm="8">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="filterbranch"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.filterbranch}
                    >
                      <option style={{ display: "none" }}></option>

                      {branchfilter.map((branchfiltreronfranchise) => (
                        <option
                          key={branchfiltreronfranchise.id}
                          value={branchfiltreronfranchise.id}
                        >
                          {branchfiltreronfranchise.branch}
                        </option>
                      ))}
                    </Input>

                    <Label className="placeholder_styling">Branch</Label>
                  </div>
                </FormGroup>
              </Col>

              <Col sm="8">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="franchiselistt"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={inputs && inputs.franchiselistt}
                    >
                      <option style={{ display: "none" }}></option>

                      {onfilterbranch.map((reportonfranchise) => (
                        <option
                          key={reportonfranchise.id}
                          value={reportonfranchise.id}
                        >
                          {reportonfranchise.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="placeholder_styling">Franchise</Label>
                  </div>
                </FormGroup>
              </Col>
            </div>
          </Row>
          

          <Row style={{ marginLeft: "244%" }}>
            <Col sm="6"></Col>
            <Col sm="6">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "medium",
                  height: "37px",
                  marginTop: "-127px",
                  marginLeft: "80px",
                }}
                className="btn btn-primary openmodal"
                type="submit"
                onClick={toggle}
                disabled={searchbuttondisable}
              >
                <span style={{ marginLeft: "-10px" }} className="openmodal">
                  &nbsp;&nbsp; Search
                </span>
              </button>
            </Col>
          </Row>

          {/* <Row>
            <Col md="12">
              <div
                className="customizer-contain"
                ref={box}
                style={{
                  borderTopLeftRadius: "20px",
                  borderBottomLeftRadius: "20px",
                }}
              >
                <div className="tab-content" id="c-pills-tabContent">
                  <div
                    className="customizer-header"
                    style={{
                      border: "none",
                      borderTopLeftRadius: "20px",
                    }}
                  >
                    <br />
                    <i
                      className="icon-close"
                      onClick={() => closeCustomizer(true)}
                    ></i>
                    <br />

                   
                 
               
                  </div>
                </div>
              </div>
            </Col>
          </Row> */}

          {/* end */}
          {/* <Row>
            <Col>
              {onsearch ? (
                <div>
                  <ActivityTable
                    customstartdate={props.customstartdate}
                    customenddate={props.customenddate}
                    inputs={inputs}
                  />
                </div>
              ) : (
                ""
              )}
            </Col>
          </Row> */}
        </div>
      </Container>
      <Container>
        
      </Container>
    </Fragment>
  );
};

export default ActivityReports;


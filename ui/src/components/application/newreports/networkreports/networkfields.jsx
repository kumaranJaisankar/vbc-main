import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Input,
  FormGroup,
  ModalBody,
  Label,
} from "reactstrap";
import { adminaxios } from "../../../../axios";
import { toast } from "react-toastify";
import ModalNetworkData from "./modalNetworkdata";

const NetworkFields = (props) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const [modal, setModal] = useState();

  const [inputs, setInputs] = useState({});

  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  //state for filter branch
  const [branchfilter, setBranchfilter] = useState([]);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);

  // padding dates filters

  useEffect(() => {
    if (
      props.customstartdate !== undefined ||
      props.customenddate !== undefined ||
      inputs.franchiselistt !== undefined ||
      inputs.filterbranch !== undefined
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.customstartdate, props.customenddate, inputs]);

// modal onclick open

  const toggle = () => {
    setModal(!modal);
  };

  // close function
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };

  //end

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

  // coming up labels

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const box = useRef(null);

  //list of franchise branches

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

  return (
    <>
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col sm="2">
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

                  <Label className="placeholder_styling">NAS</Label>
                </div>
              </FormGroup>
            </Col>

            <Col sm="2">
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

                  <Label className="placeholder_styling">OLT</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col sm="6"></Col>
            <Col sm="6">
              <button
                style={{
                  whiteSpace: "nowrap",
                  fontSize: "medium",
                  height: "37px",
                  float: "right",
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

          <Row>
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
                    <Modal
                      isOpen={modal}
                      toggle={toggle}
                      className="modal-body"
                      centered={true}
                      size="lg"
                      style={{ maxWidth: "78%" }}
                    >
                      <Row style={{ marginTop: "18px", marginLeft: "-99px" }}>
                        <Col sm="1"></Col>
                        <Col sm="9">
                          <h5 style={{ marginTop: "9px", fontSize: "23px" }}>
                            Network Reports
                          </h5>
                        </Col>

                        <Col sm="2" style={{ paddingLeft: "70px" }}>
                          <Button onClick={toggle}>Close</Button>
                        </Col>
                      </Row>

                      <ModalBody>
                        <ModalNetworkData
                          customstartdate={props.customstartdate}
                          customenddate={props.customenddate}
                          inputs={inputs}
                        />
                      </ModalBody>
                    </Modal>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* end */}
        </div>
      </Container>
    </>
  );
};

export default NetworkFields;

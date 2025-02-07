import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner
} from "reactstrap";
import { servicesaxios } from "../../../../axios";
// import { toast } from "react-toastify";
import useFormValidation from "../../../customhooks/FormValidation";
import ErrorModal from "../../../common/ErrorModal";

const AddNewOffer = (props, initialValues) => {
  const [validList, setValidList] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [offerLists, setOfferLists] = useState({
    unit_type: "mon",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [disable, setDisable] = useState(false);

  const handleOfferChange = (event) => {
    // event.preventDefault();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
  
    setOfferLists((preState) => ({
      ...preState,
      [name]: value.charAt(0).toUpperCase() +  value.slice(1),
    }));
  };

  const resetformmanually = () => {
    setOfferLists({
      name: "",
    });
  //Sailaja modified clear_form_data on 26th July
    document.getElementById("resetid").click();
    document.getElementById("myForm").reset();

  };

  const submit = (e) => {
    e.preventDefault();
    let dataNew = {...inputs}
    dataNew.offer_name=dataNew.name;
    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let validfortimeunit = validList.find(
      (d) => d.id == offerLists.valid_for_time_unit
    );
    const data = {
      ...offerLists,
      time_unit: parseInt(offerLists.time_unit),
      valid_for_time_unit: validfortimeunit.time_unit,
      valid_for_time_unit_type: validfortimeunit.unit_type,
    };
    setDisable(true)
    servicesaxios
      .post("/plans/offer/create", data, config)
      .then((response) => {
        setDisable(false)
        console.log(response.data);
        // toast.success("Offer was added successfully", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
        setShowModal(true);
        setModalMessage("Offer was added successfully");
        props.onUpdate(response.data);
        resetformmanually();
      })
      .catch(function (error) {
        setDisable(false)
        const errorString = JSON.stringify(error);
        const is500Error = errorString.includes("500");
        const is404Error = errorString.includes("404");
      
        let errorMessage;
      
        if (error.response && error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (is500Error) {
          errorMessage = "Something went wrong";
        } else if (is404Error) {
          errorMessage = "API mismatch";
        } else {
          errorMessage = "Something went wrong";
        }
        // Modified by Marieya
        // Instead of showing a toast, we'll set the modal message and show the modal
        setModalMessage(errorMessage);
        setShowModal(true);
      });      
      // .catch(function (error) {
      //   setDisable(false)
      //   const errorString = JSON.stringify(error);
      //   const is500Error = errorString.includes("500");
      //   const is404Error = errorString.includes("404");
      //   if (error.response && error.response.data.detail) {
      //     toast.error(error.response && error.response.data.detail, {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   } else if (is500Error) {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   } else if (is404Error) {
      //     toast.error("API mismatch", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   } else {
      //     toast.error("Something went wrong", {
      //       position: toast.POSITION.TOP_RIGHT,
      //       autoClose: 1000,
      //     });
      //   }
      // });
    
  };
  }

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => {};
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


  useEffect(() => {
    servicesaxios
      .get(`/plans/validities`)
      .then((res) => {
        let newresponsedata = [...res.data].map((d, i) => {
          return {
            ...d,
            id: i,
          };
        });
        setValidList([...newresponsedata]);
      })
      .catch((error) => {
        console.log(error, "validList");
      });
  }, []);

  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
      setOfferLists({});
    }
    
  }, [props.rightSidebar]);

  const requiredFields=["offer_name","time_unit","valid_for_time_unit"]
  const { validate, Error } = useFormValidation(requiredFields);
  return (
    <Fragment>
      <br />
      <Container fluid={true} style={{marginTop:"-13px"}}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                {/* <h6 style={{ paddingLeft: "20px" }}>Personal Info</h6> */}
              </Row>
              <Row style={{marginTop:"2%"}}>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        Offer Name *
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onBlur={checkEmptyValue}
                        onChange={handleOfferChange}
                        style={{ textTransform: "capitalize" }}
                      />
                     
                      <span className="errortext">{errors.offer_name}</span>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        Offer Period *
                      </Label>
                      <Input
                        className="form-control"
                        type="number"
                        name="time_unit"
                        onBlur={checkEmptyValue}
                        onChange={handleOfferChange}
                        min="0"
                      />
                   {/* Sailaja Removed Offer period hard coded validations on 13th March 2023 */}
                      <span className="errortext">{errors.time_unit }</span>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Unit Type</Label>

                      <Input
                        className="form-control not-empty"
                        type="text"
                        name="unit_type"
                        onBlur={checkEmptyValue}
                        value="months"
                        onChange={handleOfferChange}
                        style={{ textTransform: "capitalize" }}
                        disabled={true}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Valid For *</Label>

                      <Input
                        type="select"
                        name="valid_for_time_unit"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        onChange={handleOfferChange}
                      >
                        <option style={{ display: "none" }}></option>
                        {validList.map((valid) => (
                          <option value={valid.id}>
                            {valid.time_unit + " " + valid.duration}
                          </option>
                        ))}
                      </Input>
                      <span className="errortext">{errors.valid_for_time_unit && "Selection is required"}</span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <br />
              {/* <br /> */}

              <Row style={{marginTop:"-2%"}}>
          <span className="sidepanel_border" style={{position:"relative"}}></span>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      disabled={disable}
                    >
          {disable ? <Spinner size="sm"> </Spinner> : null}
                      {"Add"}
                    </Button>
                    <Button type="reset" color="btn btn-primary" id="resetid">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <ErrorModal
          isOpen={showModal}
          toggle={() => setShowModal(false)}
          message={modalMessage}
          action={() => setShowModal(false)}
        />
      </Container>
    </Fragment>
  );
};

export default AddNewOffer;

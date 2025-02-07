import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { networkaxios } from "../../../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../../../constant";
import isEmpty from "lodash/isEmpty";
import useFormValidation from "../../../../customhooks/FormValidation";
import pick from "lodash/pick";
import AddressComponent from "../../../../common/AddressComponent";
import ErrorModal from "../../../../common/ErrorModal";

const AddDistribution = (props, initialValues) => {
  const [formData, setFormData] = useState({
    // hardware_category: "",
    // hardware_name: "",
    // make: "",
    // model: "",
    // specification: "",
    device_type:"pdp",
    house_no: "",
    street: "",
    city: "",
    district: "",
    pincode: "",
    state: "",
    country: "",
    notes: "",
    googleAddress: "",
  });

  console.log(formData,"hihihih")
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  //
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [resetStatus, setResetStatus] = useState(false);
  //to disable button
  const [disable, setDisable] = useState(false);
  const handleInputChange = (event) => {
    event.persist();
    setResetStatus(false);
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }

    let val = event.target.value;

    //end
console.log(formData,"123")
    if (name == "no_of_ports") {
      validatePortAndCapacity(name, value);
    }
  };

  const validatePortAndCapacity = (name, value) => {
    if (value !== "" && value == 0) {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: `${name} should not be 0`,
        };
      });
    } else {
      setErrors((prevState) => {
        return {
          ...prevState,
          [name]: "",
        };
      });
    }
  };

  //

  //search api
  // const parentnas = (val) => {
  //   networkaxios
  //     .get(`network/search/${val}`)
  //     // .get(`network/nas/filter?serial_no=${val}`)
  //     .then((res) => {

  //       setParent(res.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //     });
  // };
  //end

  //end of nas populate//

  //end of nas populate

  //
  //end
  // useEffect(() => {
  //   networkaxios
  //     .get("network/oltport/${val}/filter")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setGetPort([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end
  //olt autopopulate
  // useEffect(() => {
  //
  //
  //   networkaxios
  //     .get("network/olt/filter")
  //     .then((res) => {
  //       console.log(res);
  //       // let { branch_name } = res.data;
  //       setOLtFilter([...res.data]);
  //     })
  //     .catch((error) => console.log(error));
  // }, []);
  //end of olt autopopulate
  const resetformmanually = () => {
    setFormData({
      name: "",
      no_of_ports: "",
      googleAddress: "",
      house_no: "",
      street: "",
      city: "",
      district: "",
      pincode: "",
      state: "",
      country: "",
      latitude: null,
      longitude: null,
      number :"",
      serial_no: "",
    });
    
    console.log(formData,"formData")
    document.getElementById("resetid").click();
    setErrors({});
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
      setFormData("");
    }
  }, [props.rightSidebar]);
  // const ltype = () => {
  //   var config = {
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   };
  //   axios.post("http://localhost:8000/network/nas/create", formData, config)
  //     .then((response) => {
  //       console.log(response.data);
  //       props.onUpdate(response.data);
  //       // toast.success("Branch was added successfully", { position: toast.POSITION.TOP_RIGHT })
  //       resetformmanually();
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //       // this.setState({ errorMessage: error });
  //     });
  // };

  const submitHandle = (e) => {
    e.preventDefault();
    e = e.target.name;

    const data = pick(formData, [
      "name",
      "no_of_ports",
      "house_no",
      "street",
      "landmark",
      "city",
      "district",
      "pincode",
      "state",
      "country",
      "serial_no",
      "latitude",
      "longitude",
    ]);

    data.available_ports = parseInt(formData.no_of_ports);
    data.no_of_ports = parseInt(formData.no_of_ports);
    data.zone = props.inputs.zone;
    data.area = props.inputs.area;

    // if (props.parent[props.parent.length - 1].category == "Olt") {
    //   data.is_parent_oltport = true;
    //   data.parent_oltport = props.parentDpNodeSelected.id;
    // } else if (props.parent[props.parent.length - 1].category == "ParentDp") {
    //   data.is_parent_oltport = false;
    //   data.parent_dpport = props.parentDpNodeSelected.id;
    // }
// console.log(props.selectedConnectType ,"props.selectedConnectType")
console.log(props.getparentoltId,"getparentoltId_new")
console.log(props.getparentdpsId
  ,"getparentoltId_new123")

     if (props.selectedConnectType == "OLT") {
      data.is_parent_oltport = true;
      // data.parent_dpport= null;
      data.parent_oltport = props.getparentoltId;
    } else{
      data.is_parent_oltport = false;
      // data.parent_oltport = null;
      data.parent_dpport = props.getparentdpsId;
    }
    var config = {
      headers: {  
        "Content-Type": "application/json",
      },
    };
    delete data.googleAddress;
    let dataNew = { ...data };
    dataNew.nas_name = data.name;

    const validationErrors = validate(dataNew);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    data.serial_no = { name: formData.serial_no  };
    data.house_no = !isEmpty(formData.house_no) ? formData.house_no : "N/A";
    data.franchise =
      JSON.parse(localStorage.getItem("token")) &&
      JSON.parse(localStorage.getItem("token")).franchise &&
      JSON.parse(localStorage.getItem("token")).franchise.id;
    console.log(data, "datadata");
    if (noErrors && props.getparentoltValue == false || props.getparentdpflag == false) {
      setDisable(true);
      networkaxios
        .post(
          `network/${props?.parentOltPorts === "parentdp" ? "parentdp" :"childdp"}/create`,
          data,
          config
        )

        // .post(`network/${props.selectedDpRadioBtn}/create`, data, config)
        .then((response) => {
          setDisable(false);
          // props.onUpdate(response.data);
          toast.success("DP was added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          props.dataClose();
          props.Refreshhandler();
          resetformmanually();
          props.Accordion1();
          props.setParentDpNodeSelected({});
          props.setShowAddDistribution(false);
        })
        // .catch(function (error) {
        //   setDisable(false);
        //   toast.error("Something went wrong", {
        //     position: toast.POSITION.TOP_RIGHT,
        //     autoClose: 1000,
        //   });
        //   if (error.response && error.response.data) {
        //     setErrors(error.response.data);
        //   }
        //   // this.setState({ errorMessage: error });
        // });
        .catch(function (error) {
          setDisable(false);
        
          let errorMessage = "";
        
          // Check if there's a response with error data
          if (error.response && error.response.data) {
            setErrors(error.response.data);
        
            // Check for specific error fields/messages
            if (error.response.data.detail) {
                errorMessage = error.response.data.detail;
            } 
            else if (error.response.data["serial_no"] && error.response.data["serial_no"].length > 0) {
                errorMessage = error.response.data["serial_no"][0];
            }
            else if (error.response.data["name"] && error.response.data["name"].length > 0) {
                errorMessage = error.response.data["name"][0];
            }
            else if (error.response.status === 500) {
                errorMessage = "Internal server error. Something went wrong.";
            }
            else {
                errorMessage = "An error occurred";
            }
          } 
          else {
            // General error handling if there's no specific response data
            errorMessage = "Something went wrong";
          }
        
          // Set the error message to be displayed in the modal and open the modal
          setModalMessage(errorMessage);  // Assuming you have a state updater called setModalMessage
          setShowModal(true); // Assuming you have a state updater called setShowModal
        });        
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetForm = function () {
    setResetStatus(true);

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

  const requiredFields = [
    "landmark",
    "house_no",
    "street",
    "city",
    "pincode",
    "district",
    "state",
    "country",
    "nas_name",
    "no_of_ports",
    "serial_no",
    "latitude",
    "longitude",
  ];
  const { validate } = useFormValidation(requiredFields);

  //submit

  //end
  return (
    <Fragment>
      {/* <br /> */}
      {/* <Container fluid={true}> */}
      <div className="email-wrap bookmark-wrap">
        <Form
          className="theme-form mega-form"
          //onSubmit={(e)=>submitHandle(e)}
          id="myForm"
          onReset={resetForm}
          ref={form}
        >
          <Row>
            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Name *</Label>
                  <Input
                    type="text"
                    name="name"
                    id="afterfocus"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.name}
                    className={`form-control digits ${formData && formData.name ? "not-empty" : ""
                  }`}
                  ></Input>
                </div>
                <span className="errortext">{errors.nas_name}</span>
              </FormGroup>
            </Col>

            

            <Col sm="3">
              <FormGroup>
                <div className="input_wrap" >
                  <Label className="kyc_label"> Number Of Ports *</Label>
                  <Input
                    style={{ color: "#495057" }}
                    className="form-control"
                    type="number"
                    name="no_of_ports"
                    id="afterfocus"
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                    value={formData && formData.no_of_ports}
                    min="1"
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.key === "E" ||
                        evt.key === "." ||
                        evt.key === "-") &&
                      evt.preventDefault()
                    }
                  />
                </div>
                <span className="errortext">{errors.no_of_ports}</span>
              </FormGroup>
            </Col>

            <Col sm="3">
              <FormGroup>
                <div className="input_wrap">
                  <Label className="kyc_label">Serial Number *</Label>
                  <Input
                    style={{ color: "#495057" }}
                    className="form-control"
                    type="text"
                    name="serial_no"
                    id="afterfocus"
                    value={formData && formData.serial_no}
                    onChange={handleInputChange}
                    onBlur={checkEmptyValue}
                  />
                </div>
                <span className="errortext">{errors.serial_no}</span>
              </FormGroup>
            </Col>
          </Row>
          {props.accordionActiveKey == "2" && (
            <AddressComponent
              handleInputChange={handleInputChange}
              checkEmptyValue={checkEmptyValue}
              errors={errors}
              setFormData={setFormData}
              formData={formData}
              setInputs={setInputs}
              resetStatus={resetStatus}
              setResetStatus={setResetStatus}
              setIsDirtyFun={props.setIsDirtyFun}
              resetformmanually={resetformmanually}
            />
          )}

          <Row>
            <Col sm="2">
              <FormGroup className="mb-0">
                <Button
                  id="create_button"
                  color="btn btn-primary"
                  type="button"
                  className="mr-3"
                  onClick={submitHandle}
                  style={{ textAlign: "center !important" }}
                  disabled={disable}
                >
                  {disable ? <Spinner size="sm"> </Spinner> : null}
                  {Add}
                </Button>
              </FormGroup>
            </Col>
            <Col sm="2">
              <FormGroup className="mb-0">
                <Button
                  type="reset"
                  color="btn btn-primary"
                  id="resetid"
                  class="center1"
                  onClick={resetformmanually}
                  style={{ width: "auto" }}
                >
                  Reset
                </Button>
              </FormGroup>
            </Col>
          </Row>
          <ErrorModal
        isOpen={showModal}
        toggle={() => setShowModal(false)}
        message={modalMessage}
        action={() => setShowModal(false)}
      />
        </Form>
      </div>
      {/* </Container> */}
    </Fragment>
  );
};

export default AddDistribution;

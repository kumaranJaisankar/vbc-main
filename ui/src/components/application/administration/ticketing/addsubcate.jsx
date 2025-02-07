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
  Spinner,
} from "reactstrap";
import { helpdeskaxios } from "../../../../axios";
import {
  Add,
} from "../../../../constant";
import useFormValidation from "../../../customhooks/FormValidation";
// import { toast } from 'react-toastify';
// Sailaja imported common component Sorting on 24th March 2023
import { Sorting } from "../../../common/Sorting";
import ErrorModal from "../../../common/ErrorModal";

const AddSubCategory = (props, initialValues) => {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [selectCategory, setSelectCategory] = useState([]);
  const [loaderSpinneer, setLoaderSpinner] = useState(false)
  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (target.name === "roles" || target.name === "permissions") {
      value = [target.value];
    }

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value.charAt(0).toUpperCase() + value.slice(1),
      }));
    }
  };



  const subcate = () => {
    setLoaderSpinner(true);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    helpdeskaxios
      .post("create/ticket/subcategory", formData, config)
      .then((response) => {
        props.onUpdate(response.data);
        setModalMessage("Ticket subcategory was added successfully");
        setShowModal(true);
        // Modified by Marieya
        // toast.success("Ticket subcategory was added successfully", { position: toast.POSITION.TOP_RIGHT })
        resetformmanually();
        setLoaderSpinner(false);
      })
      .catch(function (error) {
      setLoaderSpinner(false);
      setShowModal(true);
      setModalMessage("Something went wrong");
        // toast.error("Something went wrong", {
        //   position: toast.POSITION.TOP_RIGHT,
        //   autoClose: 1000
        // });
        console.error("Something went wrong", error);
      });
  };


  const resetformmanually = () => {
    setFormData({
      name: '',

    })
    //Sailaja modified clear_form_data on 26th July
    document.getElementById('resetid').click()
    document.getElementById('myForm').reset()

  }



  const submit = (e) => {
    e.preventDefault();
    let newinputsData = { ...inputs }
    newinputsData.sub_category_name = newinputsData.name
    const validationErrors = validate(newinputsData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      subcate();
    } else {
      console.log("errors try again", validationErrors);
    }
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually()
      setErrors({})
    }
  }, [props.rightSidebar])

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => { };
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({})

  };

  const form = useRef(null);


  useEffect(() => {
    helpdeskaxios
      .get(`list/category`)
      .then((res) => {        
    // Sailaja sorting the Admin/ Sub Category(Add Panel)-> Category Dropdown data as alphabetical order on 24th March 2023  
      setSelectCategory(Sorting([...res?.data],'category'));       
      })
      .catch((error) => console.log(error));
  }, []);
  //validation
  const requiredFields = ["sub_category_name","ticket_category"];
  const { validate, Error } = useFormValidation(requiredFields);
 return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Sub Category *</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                    </div>
                    <span className="errortext">{errors.sub_category_name}</span>

                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Label className="kyc_label">Category *</Label>
                      <Input
                        type="select"
                        name="ticket_category"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{display:"none"}}></option>
                        {selectCategory.map((addingusers) => (
                          <option key={addingusers.id} value={addingusers.id}>
                            {addingusers.category}                            
                            {console.log(addingusers.category, "categoryList")}
                          </option>
                        ))}
                      </Input>
                    </div>
                    <span className="errortext">{errors.ticket_category && "Selection is required"}</span>
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <br />
              <br />

              <Row style={{ marginTop: "-91px" }}>
                <span className="sidepanel_border" style={{ position: "relative" }}></span>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
                    >
                      {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null}&nbsp;
                      {Add}
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

export default AddSubCategory;

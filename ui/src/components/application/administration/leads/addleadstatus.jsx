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
} from "reactstrap";
import {default as axiosBaseURL } from "../../../../axios";
import { toast } from 'react-toastify';
import { Add } from "../../../../constant";

const AddLeadStatus = (props, initialValues) => {
  const [formData, setFormData] = useState({
   
    category:"",
    subject:""
  });
  const [inputs, setInputs] = useState(initialValues);
  const [image, setimage] = useState({ pictures: [] });

  const [permissions, setPermissions] = useState([]);

  
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
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    axiosBaseURL
      .get("/accounts/register/options")
      .then((res) => {
        let {
          permissions,
          branches,
          // assigned_by,
          // category,
          // assigned_to,
          // priority_sla,
          // notification,
          // status,
          // activity,
          // escalate
        } = res.data;
        setPermissions([...permissions]);
      })
      .catch((error) => console.log(error));
  }, []);

  const submit = (e) => {
    e.preventDefault();
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    axiosBaseURL
      .post(
        "/radius/status/create",
        formData,
        config
      )
      .then((response) => {
        props.onUpdate(response.data);
        // toast.success("Branch was added successfully", { position: toast.POSITION.TOP_RIGHT })
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
        console.error("Something went wrong!", error);
      });
  };

  var expandeds2 = false;
  let branchCheckboxes= (e) => {
    e.stopPropagation();
    var checkboxes = document.getElementById("selectbranch");
    function a(e) {
      if (!checkboxes.contains(e.target)) {
        hideCheckboxes();
      }
    }
    function b(e) {
      if (!checkboxes.contains(e.target)) {
        e.preventDefault();
        hideCheckboxes();
      }
    }
    function showCheckboxes() {
      document.body.addEventListener("focusin", a);
      document.body.addEventListener("click", b);
      checkboxes.style.display = "block";
      expandeds2 = true;
    }
    function hideCheckboxes() {
      document.body.removeEventListener("focusin", a);
      document.body.removeEventListener("click", b);
      checkboxes.style.display = "none";
      expandeds2 = false;
    }

    if (!expandeds2) {
      showCheckboxes();
    } else {
      hideCheckboxes();
    }
  };


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
  };

  const form = useRef(null);

  const onDrop = (pictureFiles, pictureDataURLs) => {
    setimage({
      ...image,
      pictureFiles,
    });
  };

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                {/* <h6 style={{ paddingLeft: "20px" }}>Personal Info</h6> */}
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Add Status</Label>
                    </div>
                  </FormGroup>
                </Col>

                 

                         
              </Row>
             


              <br /><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
              <br />
              <br />
              <br />
              <br />
              <br />
              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                    >
                      {Add}
                    </Button>
                    <Button type="reset" color="btn btn-primary">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddLeadStatus;




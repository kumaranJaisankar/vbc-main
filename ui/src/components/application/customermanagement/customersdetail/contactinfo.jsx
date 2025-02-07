import React, { useState, useRef, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { customeraxios } from "../../../../axios";
import { toast } from "react-toastify";
import pick from "lodash/pick";
import { isEmpty } from "lodash";
import {
  Add,
} from "../../../../constant";
import Button from "@mui/material/Button";
const AdvanceInfo = (props, initialValues) => {
  const [customData, setCustomData] = useState({

  });
  const [inputs, setInputs] = useState(initialValues);
  const [getcustomdata, setGetcustomdata] = useState()

  useEffect(() => {
    if (props.lead) {
      const obj = pick(props.lead, ['extension_no', 'intercom_no', 'stb_mac', 'stb_serial_no'])
      if (isEmpty(obj)) {
        setCustomData({})
      }
      else {

        setCustomData(obj)
      }
    }
  }, [props.lead])

  const handleCustomChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;


    if (target.type === "checkbox") {
      if (target.checked) {
        customData.hobbies[value] = value;
      } else {
        customData.hobbies.splice(value, 1);
      }
    } else {
      setCustomData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };

  const customsubmit = (e) => {
    e.preventDefault();
    console.log(customData);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    customData.id = props.lead.id
    customeraxios
      .patch("customers/adv/info", customData, config)
      .then((response) => {
        console.log(response.data);
        props.onUpdate(response.data);
        customresetformmanually();
        toast.success("Additional Info Added successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      })
      .catch(function (error) {
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000
        });
        console.error("Something went wrong!", error);
      });
  };

  const customresetformmanually = () => {
    setCustomData({
      extension_no: "",
      intercom_no: "",
      stb_mac: "",
      stb_serial_no: ""
    });
    if(document.getElementById);
    document.getElementById("customresetid").click();
  };




  function checkCustomEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetCustomInputField = () => { };
  const customresetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });

  };
  const form = useRef(null);



  // get api 
  useEffect(() => {
    customeraxios
      .get("customers/rud/" + props.lead?.id || "")
      .then((res) => {
        console.log(res);
        setCustomData(res.data);
      });
  }, []);

  return (
    <>
      <Row>
        <Form onSubmit={customsubmit} id="myForm" onReset={customresetForm} ref={form}>
          <Row>
            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control not-empty"
                    type="text"
                    name="extension_no"
                    onChange={handleCustomChange}
                    onBlur={checkCustomEmptyValue}
                    disabled={props.lead && props.lead.extension_no}
                    value={customData && customData.extension_no == null ? '' : customData.extension_no}
                  />
                  <Label className="placeholder_styling">Extension No *</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control not-empty"
                    type="text"
                    name="intercom_no"
                    onChange={handleCustomChange}
                    onBlur={checkCustomEmptyValue}
                    disabled={props.lead && props.lead.intercom_no}
                    value={customData && customData.intercom_no == null ? '' : customData.intercom_no}
                  />
                  <Label className="placeholder_styling">Intercom No *</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control not-empty"
                    type="text"
                    name="stb_mac"
                    onChange={handleCustomChange}
                    onBlur={checkCustomEmptyValue}
                    disabled={props.lead && props.lead.stb_mac}
                    value={customData && customData.stb_mac == null ? '' : customData.stb_mac}

                  />
                  <Label className="placeholder_styling">STB MAC *</Label>
                </div>
              </FormGroup>
            </Col>
            <Col sm="4">
              <FormGroup>
                <div className="input_wrap">
                  <Input
                    className="form-control not-empty"
                    type="text"
                    name="stb_serial_no"
                    onChange={handleCustomChange}
                    onBlur={checkCustomEmptyValue}
                    disabled={props.lead && props.lead.stb_serial_no}
                    value={customData && customData.stb_serial_no == null ? '' : customData.stb_serial_no}
                  />
                  <Label className="placeholder_styling">STB Serial No *</Label>
                </div>
              </FormGroup>
            </Col>
          </Row>

          <br />

          <Row>
            <Col>
              <FormGroup className="mb-0">
                <Button
                  variant="contained"
                  type="submit"
                  className="mr-3"
                  onClick={resetCustomInputField}
                >
                  {Add}
                </Button>
                <Button type="reset" variant="contained" id="customresetid">
                  Reset
                </Button>
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </Row>
    </>
  );
};

export default AdvanceInfo;

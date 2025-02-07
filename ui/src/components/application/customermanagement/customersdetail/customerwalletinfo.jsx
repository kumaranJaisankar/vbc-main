import React, { useEffect, useState, useRef } from "react"; //hooks
import {
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Button,
  Input,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
} from "reactstrap";
import { toast } from "react-toastify";
import { customeraxios, franchiseaxios, adminaxios } from "../../../../axios";
import moment from "moment";
import { pick } from "lodash";
import useFormValidation from "../../../customhooks/FormValidation";
import CustomerLedger from "./customerledger";

const CustomerWalletInfo = (props, initialValues) => {
  const [balance, setBalance] = useState(null);
  const [inputs, setInputs] = useState(initialValues);
  const [offlinefield, setOfflinefield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(false);
  const [leadUser, setLeadUser] = useState(props.lead);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [paidtolist, setPaidtolist] = useState([]);

  useEffect(() => {
    franchiseaxios
      .get(`wallet/customer/${props.lead.id}`)
      .then((res) => {
        setBalance(res.data);
      });
  }, [props]);


  //code for upload receipt
  async function UploadImage(e) {
    let img = URL.createObjectURL(e.target.files[0]);
    setImgSrc(img);
    let preview = await getBase64(e.target.files[0]);

    setFormData((preState) => ({
      ...preState,

      payment_receipt: preview,
    }));
  }


  useEffect(() => {
    if (props.lead) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...props.lead.address,
        },
      }));
    }
    setLeadUser(props.lead);
  }, [props.lead]);

  const customerwalletpopup = () => {
    setOfflinefield(false);
    setOnlinefield(false);
    setVerticalcenter(true);
    setVerticalcenter(!Verticalcenter);
  };

  const [errors, setErrors] = useState({});
  const [imgSrc, setImgSrc] = React.useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setLeadUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const offline = () => {
    setOfflinefield(true);
    setOnlinefield(false);
  };
  const online = () => {
    setOnlinefield(true);
    setOfflinefield(false);
  };
  const form = useRef(null);

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  //add api
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    console.log(formData, "form value");

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const validationErrors = validate(formData);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);

    const data = pick(formData, [
      "paid_to",
      "payment_date",
      "amount",
      "payment_receipt",
    ]);;
    // const data = {...formData}
    data.customer_id = props.lead.id;
    data.payment_date = moment(formData.payment_date).format("YYYY-MM-DD");
    data.amount = parseInt(formData.amount);

    if (noErrors) {
      franchiseaxios
        .post(`wallet/deposit/offline`, data, config)
        .then((response) => {
          toast.success("Amount was added successfully", {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
          });
          setVerticalcenter(false);
          resetformmanually();
          setLeadUser((preState) => {
            return {
              ...preState,
              wallet_amount:
                parseInt(preState.wallet_amount) + parseInt(formData.amount),
            };
          });

          props.setWalletinformationupdated(response.data);
        })

        .catch(function (error) {
          console.error("Something went wrong!", error);
          if (error.response && error.response.data) {
            setErrors(error.response.data);
          }
        });
      resetInputField();
    }
  };

  //reset form after submission
  const resetInputField = () => { };
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
  //end

  const resetformmanually = () => {
    setFormData({
      wallet_amount: "",
      paid_to: "",
      payment_receipt: "",
    });
    setImgSrc(null)
  };
  const requiredFields = ["amount", "paid_to"];
  const { validate, Error } = useFormValidation(requiredFields);
  //getting customer id from customer list
  useEffect(() => {
    customeraxios
      .get("customers/list")
      .then((res) => {
        console.log(res);
        setLeadUser(res.data);
      });
  }, []);

  // useEffect(() => {
  //   franchiseaxios
  //     .get("wallet/ledger/C20584")
  //     // .then((res) => setData(res.data))
  //     .then((res) => {
  //       console.log(res);
  //       setLeadUser(res.data);
  //     });
  // }, []);

  //getting all the ledgers from api
  // useEffect(() => {

  //   setLeadUser(props.lead);
  //   if (!isEmpty(props.lead)) {
  //     franchiseaxios
  //       .get(`wallet/ledger/C${props.lead && props.lead.radius && props.lead.radius.username}`)
  //       // .then((res) => setData(res.data))
  //       .then((res) => {
  //         console.log(res);
  //         setCustomerlist(res.data);

  //       });
  //   }
  // }, [props.lead]);
  //end


  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  //api for paid to field while adding money
  useEffect(() => {
    adminaxios.get(`accounts/users?user_type=STAFF`).then((res) => {
      setPaidtolist([...res.data]);
    });
  }, []);

  //end
  return (
    <>
     <Row style={{  marginTop: "-41px" }}>
          <Col sm="12">
            <Button color="primary" onClick={customerwalletpopup}>
              Add Money
            </Button>
          </Col>
        </Row>
      <Modal isOpen={Verticalcenter} toggle={customerwalletpopup} centered>
        <ModalHeader toggle={customerwalletpopup}>
          Customer Wallet
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="4">
              <Button color="primary" onClick={online}>
                Online
              </Button>
            </Col>
            <Col sm="4">
              <Button color="primary" onClick={offline}>
                Offline
              </Button>
            </Col>
          </Row>
          <br />
          {offlinefield ? (
            <div>
              <Form id="myForm" onReset={resetForm} ref={form}>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <div className="input_wrap">
                        <input
                          className={`form-control digits not-empty`}
                          id="afterfocus"
                          type="text"

                          style={{ border: "none", outline: "none" }}
                          value={leadUser && leadUser.username}
                          onChange={handleChange}
                          // onBlur={blur}
                          disabled={true}
                        ></input>
                        <Label className="placeholder_styling">
                          Customer ID
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="6">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name="paid_to"
                          onChange={handleChange}
                          onBlur={checkEmptyValue}
                          className={`form-control digits ${formData && formData.paid_to ? "not-empty" : ""
                            }`}
                          value={formData && formData.paid_to}
                        >
                          <option style={{ display: "none" }}></option>
                          {paidtolist &&
                            paidtolist.map((assignedto) => (
                              <option
                                key={assignedto.id}
                                value={assignedto.id}
                              >
                                {assignedto.username}
                              </option>
                            ))}
                        </Input>

                        <Label className="placeholder_styling">
                          {" "}
                          Paid To *
                        </Label>
                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "14%",
                          left: "73%",
                        }}
                      ></div>
                      <span className="errortext">{errors.paid_to}</span>
                    </FormGroup>
                  </Col>
                  {/* <Col sm="6">
                      <FormGroup>
                        <div className="input_wrap">
                          <Input
                            name="paid_to"
                            className={`form-control digits ${
                              formData && formData.paid_to ? "not-empty" : ""
                            }`}
                            value={formData && formData.paid_to}
                            type="text"
                            onBlur={checkEmptyValue}
                            onChange={handleChange}
                          />
                          <Label className="placeholder_styling">Paid To</Label>
                        </div>
                        <span className="errortext">{errors.paid_to}</span>
                      </FormGroup>
                    </Col> */}
                </Row>
                <Row>
                  <Col sm="6">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          name="amount"
                          className={`form-control digits ${formData && formData.amount ? "not-empty" : ""
                            }`}
                          value={formData && formData.amount}
                          type="number"
                          onKeyDown={(evt) =>
                            (evt.key === "e" ||
                              evt.key === "E" ||
                              evt.key === "." ||
                              evt.key === "-"
                            )
                            &&
                            evt.preventDefault()
                          }
                          // onBlur={checkEmptyValue}
                          onChange={handleChange}
                        />
                        <Label className="placeholder_styling">
                          Paid Amount
                        </Label>
                      </div>
                      <span className="errortext">{errors.amount}</span>
                    </FormGroup>
                  </Col>

                  <Col sm="6">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className="form-control digits not-empty"
                          type="date"
                          value={startDate}
                          name="payment_date"
                          onChange={handleChange}
                        />
                        <Label
                          for="meeting-time"
                          className="placeholder_styling"
                        >
                          Date
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                <br />
                <Row>
                  <Col>
                    <FormGroup style={{ textAlign: "center" }}>
                      &nbsp;&nbsp;
                      <br />
                      <Row>
                        <Col style={{ textAlign: "left" }}>
                          <Label>Upload Receipt:</Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={{ textAlign: "left" }}>
                          <span class="uploadimagekyc">
                            Upload Receipt
                            <Input
                              name="payment_receipt"
                              onChange={UploadImage}
                              className="form-control"
                              accept="image/*"
                              type="file"
                              id="upload"
                              style={{
                                paddingTop: "3px",
                                position: "absolute",
                                left: "0",
                                top: "0",
                                opacity: "0",
                                cursor: "pointer",
                              }}
                            />
                          </span>
                        </Col>
                        <Col>
                          <img
                            src={imgSrc}
                            style={{ width: "200px" }}
                            className="imgsrc"
                          />
                        </Col>
                      </Row>
                      <br />

                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </div>
          ) : (
            ""
          )}
          {onlinefield ? (
            <div>
              <Row>
                <Col sm="4">
                  <p>Provide link</p>
                </Col>
              </Row>
            </div>
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" type="button" onClick={submit}>
            Submit
          </Button>
          <Button
            color="secondary"
            onClick={customerwalletpopup}
            id="resetid"
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
      <CustomerLedger
        setCustomerlist={props.setCustomerlist}
        customerlist={props.customerlist}
        lead={props.lead}
        balance={balance}
        setWalletinformationupdated={props.setWalletinformationupdated}
        walletinformationupdate={props.walletinformationupdate}
      />
    </>
  );
};

export default CustomerWalletInfo;

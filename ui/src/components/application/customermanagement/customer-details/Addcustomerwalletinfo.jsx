import React, { useState, useRef, useEffect } from "react"; //hooks
import {
  Row,
  Col,
  Form,
  Label,
  FormGroup,
  Input,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Modal,
  Spinner
} from "reactstrap";
import { toast } from "react-toastify";
import { franchiseaxios, adminaxios } from "../../../../axios";
import moment from "moment";
import { pick } from "lodash";
import Button from "@mui/material/Button";
import useFormValidation from "../../../customhooks/FormValidation";

const AddCustomerWalletInfo = ({ initialValues, profileDetails, setBalance, fetchComplaints }) => {
  const [inputs, setInputs] = useState(initialValues);
  const [offlinefield, setOfflinefield] = useState(false);
  const [onlinefield, setOnlinefield] = useState(false);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [formData, setFormData] = useState({});
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [loaderSpinneer, setLoaderSpinner] = useState(false);



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



  const customerwalletpopup = () => {
    setOfflinefield(false);
    setOnlinefield(false);
    setVerticalcenter(true);
    setVerticalcenter(!Verticalcenter);
    setErrors(false);
  };

  const [errors, setErrors] = useState({});
  const [imgSrc, setImgSrc] = React.useState(null);



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






  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
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





  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };




  //  // get waillet amount
  const [getWalletamt, setGetWalletamt] = useState(0);
  //  // checking customer wallet function
  const [walletCOst, setWalletCost] = useState()


  // submit apiCallCount
  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    const validationErrors = validate(formData)
    const noErrors = Object.keys(validationErrors).length === 0
    setErrors(validationErrors)
    console.log(formData, "form value");

    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };


    const data = pick(formData, [
      "paid_to",
      "payment_date",
      "amount",
      "payment_receipt",
    ]);
    data.customer_id = profileDetails.id;
    data.payment_date = moment(formData.payment_date).format("YYYY-MM-DD");
    data.amount = parseInt(formData.amount);
    data.paid_to = JSON.parse(localStorage.getItem("token"))?.id;

    if (noErrors) {
      setLoaderSpinner(true);
      const wllatObj = {
        wallet_amount: Number(getWalletamt)
      }
      let customerInfo = JSON.parse(sessionStorage.getItem("customerInfDetails"));
      adminaxios.post("wallet/walletcheck/" + customerInfo?.id, wllatObj).then((res) => {
        setWalletCost(res.data)
        if (res.data.check === true) {
          franchiseaxios
            .post(`wallet/deposit/offline`, data, config)
            .then((response) => {
              toast.success("Amount was added successfully", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
              });
              setVerticalcenter(false);
              resetformmanually();
              fetchComplaints();
              setBalance({ wallet_info: response.data[response.data.length - 1].wallet_amount })
              setLoaderSpinner(false);
            })

            .catch(function (error) {
              setLoaderSpinner(false);
              const errorString = JSON.stringify(error);
              const is500Error = errorString.includes("500");
              const is404Error = errorString.includes("404");
              if (error.response && error.response.data.detail) {
                toast.error(error.response && error.response.data.detail, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else if (is500Error) {
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else if (is404Error) {
                toast.error("API mismatch", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              } else {
                toast.error("Something went wrong", {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 1000,
                });
              }
            });
        }
        if (res.data.check === false) {
          setLoaderSpinner(false);
        }
      }).catch((err) => {
        setLoaderSpinner(false);
      })

      resetInputField();

    };
  }
  //end
  const requiredFields = ["amount"];
  // Errors

  const { validate, Error } = useFormValidation(requiredFields);

  const resetInputField = () => { };
  const resetformmanually = () => {
    setFormData({
      wallet_amount: "",
      paid_to: "",
      // payment_receipt: "",
    });
    setImgSrc(null)
  };


  //end
  return (
    <>
      <Row>
        <Col sm="12">

          <Button variant="outlined" size="small" onClick={customerwalletpopup} id="new_complaints">Add Money</Button>
        </Col>
      </Row>
      <Modal isOpen={Verticalcenter} toggle={customerwalletpopup} centered>
        <ModalHeader toggle={customerwalletpopup}>
          Customer Wallet
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col sm="4">
              <Button variant="contained" onClick={online} id="create_button">
                Online
              </Button>
            </Col>
            <Col sm="4">
              <Button variant="contained" onClick={offline} id="create_button">
                Offline
              </Button>
            </Col>
          </Row>
          <br />
          {offlinefield ? (
            <div>
              <Form id="myForm" onReset={resetForm} ref={form}>
                <Row style={{ marginTop: "7%" }}>
                  <Col md="6">
                    <FormGroup>
                      <div className="input_wrap">
                        <input
                          className={`form-control digits not-empty`}
                          id="afterfocus"
                          type="text"
                          value={profileDetails && profileDetails?.user?.username}
                          style={{ border: "none", outline: "none" }}
                          onChange={handleChange}
                          // onBlur={blur}
                          disabled={true}
                        ></input>
                        <Label className="form_label">
                          Customer ID
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="6">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className="form-control digits not-empty"
                          type="test"
                          value={JSON.parse(localStorage.getItem("token"))?.username}
                          name="paid_to"
                          onChange={handleChange}
                          disabled={true}
                        >
                        </Input>
                        <Label className="form_label"> Collected By *</Label>

                      </div>
                      <div
                        style={{
                          position: "absolute",
                          top: "14%",
                          left: "73%",
                        }}
                      ></div>
                    </FormGroup>
                  </Col>

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
                          min="0"
                          onKeyDown={(evt) =>
                            (evt.key === "e" ||
                              evt.key === "E" ||
                              evt.key === "." ||
                              evt.key === "-"
                            )
                            &&
                            evt.preventDefault()
                          }
                          onBlur={checkEmptyValue}
                          onChange={(e) => { handleChange(e); setGetWalletamt(e.target.value) }}
                        />
                        <Label className="form_label">
                          Paid Amount *
                        </Label>
                        <span className="errortext">{errors.amount}</span>
                      </div>
                      <div >
                        <span className="errortext">{walletCOst?.check === false && `Wallet amount of max ${(walletCOst?.remaining_wallet_amount).toFixed(2)} RS. is allowed.`}</span>
                      </div>
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
                          className="form_label"
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
                          <Label>Upload Receipt :</Label>
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
          <Button variant="contained" onClick={submit} id="create_button"
            disabled={loaderSpinneer ? loaderSpinneer : loaderSpinneer}
          >
            {loaderSpinneer ? <Spinner size="sm"> </Spinner> : null}

            Submit
          </Button>


          <button
            type="button"
            name="submit"
            className="btn btn-secondary"
            onClick={customerwalletpopup}
            id="resetid"
          >
            Cancel
          </button>
        </ModalFooter>
      </Modal>

    </>
  );
};

export default AddCustomerWalletInfo;
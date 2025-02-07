import React, {
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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { Spinner } from "reactstrap";

// Sailaja imported common component Sorting on 28th March 2023
import { Sorting } from "../../../common/Sorting";


var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}

const Allfranchisefilters = (props) => {
  const [rightSidebar, setRightSidebar] = useState(true);
  const width = useWindowSize();
  const [modal, setModal] = useState();
  const configDB = useSelector((content) => content.Customizer.customizer);
  const mix_background_layout = configDB.color.mix_background_layout;
  const [sidebar_type, setSidebar_type] = useState(
    configDB.settings.sidebar.type
  );
  //end
  const [searchbuttondisable, setSearchbuttondisable] = useState(true);
  //state for filter sms type status

  const [branchfilter, setBranchfilter] = useState([]);
  //state for franchise filter based on branch
  const [onfilterbranch, setOnfilterbranch] = useState([]);

  const [franchiseHide, setFranchiseHide] = useState(false)


  const tokenInfo = JSON.parse(localStorage.getItem("token"));
  let showPassword = false;
  if (
    (tokenInfo && tokenInfo.user_type === "Franchise Owner")
  ) {
    showPassword = true;
  }


  useEffect(() => {
    if (
      // props.customstartdate !== undefined ||
      // props.customenddate !== undefined ||
      props.inputs.franchiselistt !== undefined ||
      props.inputs.franchisetypee !== undefined ||
      props.inputs.franchisestatuss !== undefined ||
      props.inputs.franchisesmsgatewayy !== undefined ||
      props.inputs.filterbranch !== undefined
    ) {
      setSearchbuttondisable(false);
    }
  }, [props.inputs]);

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
    setModal(!modal);
  };
  const closeCustomizer = () => {
    setRightSidebar(!rightSidebar);
    document.querySelector(".customizer-contain").classList.remove("open");
  };


  document.addEventListener("mousedown", (event) => {
    const concernedElement = document.querySelector(".filter-container");
  });



  //get list of franchises
  // useEffect(() => {
  //   adminaxios
  //     .get(`franchise/list`)
  //     .then((response) => {
  //       console.log(response.data);
  //       setFranchiselist(response.data);
  //     })
  //     .catch(function (error) {
  //       console.error("Something went wrong!", error);
  //     });
  // }, []);

  //end
  // var inputs1 = props.inputs

  //handle change event
  const handleInputChange = (event) => {
    event.persist();
    props.setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));
    console.log(props.inputs, "inputs12")

    let val = event.target.value;

    const target = event.target;
    var value = target.value;
    const name = target.name;
    if (name == "filterbranch") {
      getlistoffranchises(val);
    }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }
  const box = useRef(null);
  //list if type,stattus,smsgateway

  // useEffect(() => {
  //   adminaxios
  //     .get(`franchise/options123`)
  //     .then((res) => {
  //       let { status, type, sms } = res.data;
  //       setFranchisesms([...sms]);
  //       setFranchisestatus([...status]);
  //       setFranchisetype([...type])

  //     })
  //     .catch((err) =>
  //       toast.error("Something went wrong", {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 1000,
  //       })
  //     );
  // }, []);
  //end
  //list of franchise branches

  useEffect(() => {
    adminaxios
      .get(`franchise/branches`)
      .then((res) => {
        let { branches } = res.data;
        // setBranchfilter([...branches]);
        // Sailaja sorting the Franchise Module ->Branch  Dropdown data as alphabetical order on 28th March 2023
        setBranchfilter(Sorting(([...branches]), 'branch'));
        console.log(res.data, "branchfilter")


      })

    // .catch((err) =>
    //   toast.error("Something went wrong", {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 1000,
    //   })
    // );
  }, []);

  //get franchise options based on branch selection
  const getlistoffranchises = (name) => {
    adminaxios
      .get(`franchise/${name}/branch`)
      .then((response) => {
        setOnfilterbranch(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
      });
  };

  return (
    <>

      {showPassword ? ""
        : <Container fluid={true}>
          <div className="edit-profile" >

            <Row>

              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="filterbranch"
                      className="form-control digits"
                      onChange={(event) => {
                        handleInputChange(event)
                        setFranchiseHide(event.target.value)
                      }}
                      onBlur={checkEmptyValue}
                      value={props.inputs && props.inputs.filterbranch}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL" selected>All</option>
                      {branchfilter.map((branchfiltreronfranchise) => (
                        <option key={branchfiltreronfranchise.id} value={branchfiltreronfranchise.id}>
                          {branchfiltreronfranchise.branch}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">Branch</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="franchisetypee"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={props.inputs && props.inputs.zone}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL2" selected>All</option>
                      {props.franchisetype.map((franchisereporttype) => (
                        <option key={franchisereporttype.name} value={franchisereporttype.name}>
                          {franchisereporttype.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">Franchise Type</Label>
                  </div>
                </FormGroup>
              </Col>



              <Col sm="2">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="franchisesmsgatewayy"
                      className="form-control digits"
                      onChange={handleInputChange}
                      onBlur={checkEmptyValue}
                      value={props.inputs && props.inputs.franchisesmsgatewayy}
                    >
                      <option style={{ display: "none" }}></option>
                      <option value="ALL4" selected>All</option>
                      {props.franchisesms.map((franchisesmsgateway) => (
                        <option key={franchisesmsgateway.name} value={franchisesmsgateway.name}>
                          {franchisesmsgateway.name}
                        </option>
                      ))}
                    </Input>

                    <Label className="form_label">SMS Gateway</Label>
                  </div>
                </FormGroup>
              </Col>
             
            </Row>
            <Row>
            <Col>
                <button
                  className="btn btn-primary openmodal"
                  id=""
                  type="button" onClick={() => { props.fetchFranchiseLists(props.inputs) }}
                  disabled={props.loader ? props.loader : props.loader}
                > 
                {props.loader ? <Spinner size="sm"> </Spinner> : null} &nbsp;
                <b>Search
                  </b>
                </button>
               
              </Col>
            </Row>

          </div>
        </Container>}
    </>
  );
};

export default Allfranchisefilters;

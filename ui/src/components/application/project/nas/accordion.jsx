import React, { useState } from "react";
import "antd/dist/antd.css";
import { Collapse } from "antd";
import { Row, Col,  Spinner,
} from "reactstrap";
import { networkaxios } from "../../../../axios";
import Tooltip from '@mui/material/Tooltip';


const { Panel } = Collapse;

export default function Accordion(props) {
  console.log(props.parentdpDetails?.name, "propsofaccordion");
  const [selectedid, setSelectedId] = useState();
  const [clickedChildDP, setClickedChildDP] = useState(null);
  const [nasstatus, setNasStatus] = useState(false);

  const [oltstatus, setOltStatus] = useState(false);
  const [childdpstatus, setchilddpStatus] = useState("childdp");
  const [cpestatus, setcpeStatus] = useState("cpe");
  const [defaultchilddpdpstatus, setdefaultchilddpdpStatus] = useState(false);

  const [defaultcpe, setdefaultcpe] = useState(false);
  const [showCPES, setShowCPES] = useState(false);


  // parentdpInfo={props.parentdpInfo}
  const showOlt = (value) => {
    props.setLoading(true)
    networkaxios
      .get(`network/get/${value}/parentdp`)
      .then((response) => {
        props.setParentdpDetails(response.data);
        props.setLoading(false)
        props.setParentdpInfo(response.data);
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        props.setLoading(false)

      });
    props.setShow(false);
  };

  const clickedCDP = (value) => {
    props.setLoading(true)
    networkaxios
      .get(`network/get/${value}/childdp`)
      .then((response) => {
        props.setChilddpDetails(response.data);
        props.setLoading(false)
        // setShowCPES(true);
        // props.setShowChildDP(true);
        // setClickedChildDP(value);
        console.log(response.data, "checkdppp");
      })

      .catch(function (error) {
        console.error("Something went wrong!", error);
        props.setLoading(false)
      });
    props.setShow(false);
    console.log(props.childdpDetails, "childdpDetails");
  };

  const clickedCDPfromOLT = (value) => {
    props.setLoading(true)
    networkaxios
      .get(`network/get/${value}/childdp`)
      .then((response) => {
        props.setDefaultchilddpDetails(response.data);
            props.setLoading(false)
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        props.setLoading(false)
      });
    props.setShow(false);
  };
  const clickedOLT = (value) => {
    props.setLoading(true)
    networkaxios
      .get(`network/get/${value}/olt`)
      .then((response) => {
        props.setOltDetails(response.data);
        props.setLoading(false)
        console.log(response.data, "checkdppp1");
      })
      // props.setLoaderSpinner(false)

      .catch(function (error) {
        console.error("Something went wrong!", error);
        props.setLoading(false)
      });

    props.setShow(false);
    props.setShowOLTDetials(true);
    console.log(props.childdpDetails, "childdpDetails");
  };

  const clickedCPE = (value) => {
    props.setLoading(true)
    networkaxios
      .get(`network/get/${value}/cpe`)
      .then((response) => {
        props.setCpeDetails(response.data);
        props.setLoading(false)
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        props.setLoading(false)

      });
    props.setShow(false);
  };

  const changeDetailsName = () => {
    if (nasstatus === false ) {
      props.setDeatilsname("OLT");
    }
  };
  const newchnageDetailsName = () => {
    if (oltstatus === false) {
      props.setDeatilsname("Parent DP");
    }
  };
  const defaultchnageDetailsName = () => {
    if (defaultchilddpdpstatus === false) {
      props.setDeatilsname("Child DP");
    } else if (defaultcpe === false) {
      props.setDeatilsname("CPE");
    }
  };


  const childdpchnageDetailsName = () => {
    if (childdpstatus ==="childdp"){
      props.setDeatilsname("Child DP");
    }
  }


  const cpechnageDetailsName = () => {
    if (cpestatus ==="cpe"){
      props.setDeatilsname("CPE");
    }
  }
  return (
    <>
      <br />
      <div
        style={{
          display: "block",
          // width: "78em",
          padding: 10,
          marginLeft: "-23px",
        }}
      >
        <Collapse defaultActiveKey={["1"]}>
          <Row>
            <Col sm="12">
            </Col>
          </Row>
     {props.cpeDetails ? "" :    <Panel
            header={`Devices Connected To (${
              props.nasdetails && !props.oltDetails && !props.childdpDetails
                ? props.nasdetails?.name
                : props.oltDetails &&
                  !props.parentdpInfo &&
                  !props.defaultchilddpDetails
                ? props.oltDetails?.name
                : props.parentdpInfo &&
                  !props.childdpDetails &&
                  !props.defaultchilddpDetails
                ? props.parentdpInfo?.name
                : props.childdpDetails &&
                  !props.cpeDetails &&
                  !props.defaultchilddpDetails
                ? props.childdpDetails.name
                : props.cpeDetails
                ? props.cpeDetails?.hardware_name
                : props.defaultchilddpDetails
                ? props.defaultchilddpDetails.name
                : props.details?.name
            })`}
            key="1"
          >
{props.loaderSpinneer? 

<Spinner size="sm" id="spinner"></Spinner>
: 
<>
{!props.oltDetails && props.hide === "nas" ? (
  <Row>
    {props.nasdetails?.connected_oltes.length > 0 ?
    props.nasdetails?.connected_oltes?.map((item) => (
      <Col
        sm="4"
        key={item.serial_no}
        onClick={() => {
          clickedOLT(item.id);
          setNasStatus(true)
          changeDetailsName();
        }}
      >
        <p
          className="childBlock"
          // onClick={() => showOlt(item.id)}
        >
          OLT- 
          
          {item.serial_no}
          ({item?.occupied_slots}/
          {item?.avaialable_slots})
        </p>{" "}
      </Col>
    )) : <p style={{marginLeft:"center"}}>
No Connected Devices
    </p> }
  </Row>
) : props.hide === "nas" &&
  props.oltDetails &&
  !props.parentdpInfo?.connected_childdpes &&
  !props.defaultchilddpDetails ? (
  <>
    <Row>
      {props.oltDetails?.connected_parentdpes?.map((item) => (
        <Col sm="4" key={item.serial_no} value={item.serial_no}>
          <p
            className="childBlock"
            onClick={() => {
              showOlt(item.id);
              setOltStatus(true);
              
              newchnageDetailsName();
            }}
          >
            Parent DP - {item.serial_no} ({item?.occupied_ports}/
            {item?.no_of_ports})
          </p>
        </Col>
      ))}
    </Row>
    <Row>
      {props.oltDetails?.connected_childdpes?.map((item) => (
        <Col sm="4" key={item.serial_no}>
          <p
            className="childBlock"
            onClick={() => {
              clickedCDPfromOLT(item.id);
              console.log(
                defaultchilddpdpstatus,
                "defaultchilddpdpstatus"
              );
              setdefaultchilddpdpStatus(true);
              defaultchnageDetailsName();
            }}
          >
             Child DP - {item.serial_no} (
            {item?.occupied_ports}/{item?.no_of_ports})
          </p>
        </Col>
      ))}
    </Row>
  </>
) : props.hide === "nas" &&
  props.oltDetails &&
  props.parentdpInfo?.connected_childdpes &&
  !props.childdpDetails ? (
  <>
    <Row>
      {props.oltDetails?.connected_childdpes?.map((item) => (
        <Col sm="4" key={item.serial_no}>
          <p
            className="childBlock"
            onClick={() => {
              clickedCDP(item.id);
              childdpchnageDetailsName();
            }}
          >
            Child DP - {item.serial_no} ({item?.occupied_ports}/
            {item?.no_of_ports})
          </p>
        </Col>
      ))}
    </Row>
  </>
) : props.hide === "nas" &&
  props.oltDetails &&
  props.childdpDetails ? (
  <Row>
    {props.childdpDetails?.connected_cpes?.map((item) => (
      <Col sm="4" key={item.serial_no}>
        <p
          className="childBlock"
          onClick={() => {
            clickedCPE(item.id);
            cpechnageDetailsName();
          }}
        >
          CPE - {item.serial_no}
        </p>
      </Col>
    ))}
  </Row>
) : props.defaultchilddpDetails ? (
  <Row>
    {props.defaultchilddpDetails?.connected_cpes?.map((item) => (
      <Col sm="4" key={item.serial_no}>
        <p
          className="childBlock"
          onClick={() => {
            clickedCPE(item.id);
            cpechnageDetailsName();
          }}
        >
          CPE  - {item.serial_no}
        </p>
      </Col>
    ))}
  </Row>
) : (
  ""
)}
</>
 }   
           
          </Panel>}
        </Collapse>
      </div>
      <br />
      <div
        style={{
          display: "block",
          // width: "78em",
          padding: 10,
          marginLeft: "-23px",
        }}
      >
        {!props.oltDetails && props.hide === "nas" && !props.cpeDetails 
        ? 
          ""
         : props.parentdpDetails && props.oltDetails && !props.cpeDetails 
         ? 
          ""
         : props.defaultchilddpDetails && !props.cpeDetails
          ? 
          ""
         : props.defaultchilddpDetails  && props.cpeDetails?
         <Collapse defaultActiveKey={["1"]}>
         <Panel header="Notes" key="1">
           <ul className="ant-list-items">
             <li className="ant-list-item ant-list-bordered ant-list-sm">
               <p
                 style={{
                   paddingLeft: "30px",
                   fontSize: "14px",
                   position: "relative",
                   top: "7px",
                 }}
               >
                 {props.parentdpDetails && !props.cpeDetails
                   ? props?.parentdpDetails?.notes
                   : props.oltDetails && !props.cpeDetails
                   ? props.oltDetails.notes
                   : props.cpeDetails
                   ? props.cpeDetails.notes
                   : props?.details?.notes}

                 {/* {props.oltDetails ? props.oltDetails.parent_nas.name : props.details?.parent_nas?.name}  */}
               </p>
             </li>
           </ul>
         </Panel>
       </Collapse>
        :

          <Collapse defaultActiveKey={["1"]}>
            <Panel header="Notes" key="1">
              <ul className="ant-list-items">
                <li className="ant-list-item ant-list-bordered ant-list-sm">
                  <p
                    style={{
                      paddingLeft: "30px",
                      fontSize: "14px",
                      position: "relative",
                      top: "7px",
                    }}
                  >
                    {props.parentdpDetails && !props.cpeDetails
                      ? props?.parentdpDetails?.notes
                      : props.oltDetails && !props.cpeDetails
                      ? props.oltDetails.notes
                      : props.cpeDetails
                      ? props.cpeDetails.notes
                      : props?.details?.notes}

                    {/* {props.oltDetails ? props.oltDetails.parent_nas.name : props.details?.parent_nas?.name}  */}
                  </p>
                </li>
              </ul>
            </Panel>
          </Collapse>
        }
      </div>
    </>
  );
}

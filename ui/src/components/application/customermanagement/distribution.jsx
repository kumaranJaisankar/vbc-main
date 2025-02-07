import React, { useState ,useEffect} from "react";
import {
  Row,
  Label,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalBody,
  Dropdown,
  DropdownMenu,
  DropdownToggle,Col
} from "reactstrap";

const Distribution = (props) => {
  console.log(props.selectedDpe,"dpeindentify")
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const [Verticalcenter, setVerticalcenter] = useState(false);
  const [availablePorts,setAvailablePorts] = useState([]);
  const Verticalcentermodaltoggle = () => {
    setVerticalcenter(!Verticalcenter);
  };



  useEffect(() => {
    const buttonArray =[];
    const greenCount = 8- props.selectedDpe.available_ports;

    for(let i=1; i<=8; i++){
      if(greenCount>=i){
        buttonArray.push({id:i,color:'danger'});
      }else{
        buttonArray.push({id:i,color:'success'});
      }

    }
  
    setAvailablePorts(buttonArray);
  }, [props.selectedDpe.available_ports])

  
  const getButton =(i,color)=>{
    return <Button size="sm" color={color} key={i} style={{margin:'5px'}}>
    {i}
  </Button>
  }
  return (
    <Row>

          {
            availablePorts.map((port)=>{
              return getButton(port.id,port.color);
            })
             
          }

    </Row>
  );
};
export default Distribution;

// import React, { useState } from "react";
// import {
//   Row,
//   Label,
//   FormGroup,
//   Input,
//   Button,
//   Modal,
//   ModalFooter,
//   ModalBody,Dropdown,
//   DropdownMenu,
//   DropdownToggle,
// } from "reactstrap";

// const Distribution = (props) => {
//     const [dropdownOpen, setDropdownOpen] = useState(false)
//     const toggleDropdown = () => setDropdownOpen((prevState) => !prevState)
//   const [Verticalcenter, setVerticalcenter] = useState(false);
//   const Verticalcentermodaltoggle = () => {
//     setVerticalcenter(!Verticalcenter);
//   };

//   return (
//     <FormGroup style={{ paddingTop: "15px" }}>
//       {/* <Button color="primary" onClick={Verticalcentermodaltoggle}>
//         DP
//       </Button> */}
//       <Dropdown
//                   isOpen={dropdownOpen}
//                   toggle={toggleDropdown}
//                   className="export-dropdown"
//                 >
//                   <DropdownToggle tag="span" aria-expanded={dropdownOpen}>
//                     <button type="button"
//                       class="btn btn-primary"
//                       style={{ whiteSpace: 'nowrap' }}
//                     >

//                       &nbsp;&nbsp; DP{' '}
//                     </button>
//                   </DropdownToggle>
//                   <DropdownMenu className="export-dropdown-list-container">
//                     <ul className="header-level-menuexport ">
//                       <li
//                        onClick={Verticalcentermodaltoggle}
//                       >
//                         <span>DP_01</span>
//                       </li>
//                       <li
//                        onClick={Verticalcentermodaltoggle}
//                       >
//                         <span>DP_02</span>
//                       </li>
//                     </ul>
//                   </DropdownMenu>
//                 </Dropdown>
//       {/* <Input
//                           type="select"
//                           name=""
//                           className="form-control digits"

//                           onBlur={props.checkEmptyValue}
//                         >
//                           <option value="" style={{display:"none"}}></option>

//                           <option value="prepaid"><p>DP_01</p></option>
//                           <option value="postpaid">DP_02</option>
//                           <option value="postpaid">DP_03</option>
//                         </Input>
//                         <Label className="placeholder_styling">
//                          DP
//                         </Label> */}
//       <Modal
//         isOpen={Verticalcenter}
//         toggle={Verticalcentermodaltoggle}
//         centered size="lg"
//       >
//         {/* <ModalHeader toggle={Verticalcentermodaltoggle}>

//         </ModalHeader> */}

//         <ModalBody >
//           <Button outline size="sm">1</Button>  &nbsp;
//           <Button outline size="sm">2</Button>&nbsp;
//           <Button outline size="sm">3</Button>  &nbsp;
//           <Button outline size="sm">4</Button>  &nbsp;
//           <Button outline size="sm">5</Button>  &nbsp;
//           <Button outline size="sm">6</Button>  &nbsp;
//           <Button outline size="sm">7</Button>  &nbsp;
//           <Button outline size="sm">8</Button>  &nbsp;
//         </ModalBody>
//         <ModalFooter>
//           <Button color="secondary" onClick={Verticalcentermodaltoggle}>
//             Close
//           </Button>
//           <Button color="primary" onClick={Verticalcentermodaltoggle}>
//             Save
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </FormGroup>
//   );
// };
// export default Distribution;

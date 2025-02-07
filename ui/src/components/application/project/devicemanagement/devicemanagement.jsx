import React, { Fragment, useState,  } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
 
} from "reactstrap";
// import OLT from "./devices/olt";
import Distribution from "./devices/switch";
import Customer from "./devices/pop";
import Node from "./devices/node";

const DeviceManagement = (props) => {
  const [BasicLineTab, setBasicLineTab] = useState('1');
 
 


  return (
    <Fragment>
      <br/>
      <Container fluid={true}>
        <div className="email-wrap bookmark-wrap">
          <Row>
          <Col sm="12" xl="12 xl-100 box-col-12">
          <Card>
                  <CardBody>
                     <Nav className="border-tab" tabs>
                       <NavItem>
                           <NavLink href="#javascript"  className={BasicLineTab === '1' ? 'active' : ''} onClick={() => setBasicLineTab('1')}><i className="icofont icofont-ui-home"></i>Optical Line Terminal(OLT)</NavLink>
                       </NavItem>
                       <NavItem>
                         <NavLink href="#javascript" className={BasicLineTab === '2' ? 'active' : ''} onClick={() => setBasicLineTab('2')}><i className="icofont icofont-man-in-glasses"></i>Distribution Point</NavLink>
                       </NavItem>
                       <NavItem>
                         <NavLink href="#javascript" className={BasicLineTab === '3' ? 'active' : ''} onClick={() => setBasicLineTab('3')}><i className="icofont icofont-contacts"></i>Customer Premises Equipment</NavLink>
                       </NavItem>
                     </Nav>
                     <TabContent activeTab={BasicLineTab}>
                       <TabPane  className="fade show" tabId="1">
                    <Node/>
                       </TabPane>
                       <TabPane tabId="2">
                       <Distribution/>
                       </TabPane>
                       <TabPane tabId="3">
                       <Customer/>
                        </TabPane>
                     </TabContent> 
                  </CardBody>
                </Card>
          </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};
export default DeviceManagement;

import React, { useState, useEffect } from 'react';
import {
  Card,

  Row,
  Col,
  Input
} from "reactstrap";
import { List } from 'antd'


const CustomerByStatus = ({ customers_by_status }) => {
  const [customerStatus, setCustomerStatus]= useState([]);

  const data = [
    {
      title: 'Title 1',
      status: 'Total',
      count: 0,
      color: '#AB8FE2',
      key: 'Total'
    },
    {
      title: 'Title 2',
      status: 'Active',
      count: 0,
      color: '#43BDDF',
      key: 'Active'
    },
    {
      title: 'Title 10',
      status: 'Deactive',
      count: 0,
      color: '#2c5f6e',
      key: 'Deactive'
    },
    {
      title: 'Title 3',
      status: 'Online',
      count: 0,
      color: '#7BD67A',
      key: 'Online',
    },
    {
      title: 'Title 4',
      status: 'Offline',
      count: 0,
      color: '#fbc45e',
      key: 'Offline',
    },
    {
      title: 'Title 5',
      status: 'Suspended',
      count: 0,
      color: '#F36458',
      key: 'Suspended',

    },
    {
      title: 'Title 6',
      status: 'Expired',
      count: 0,
      color: '#FBC45E',
      key: 'Expired',
    },
    {
      title: 'Title 7',
      status: 'Installed',
      count: 0,
      color: '#24cdaa',
      key: 'Installation',
    },
    {
      title: 'Title 8',
      status: 'Provisioning',
      count: 0,
      color: '#f36458',
      key: 'Provisioning',
    },
    {
      title: 'Title 7',
      status: 'Kyc Confirmed',
      count: 0,
      color: '#ab8fe2',
      key: 'KYC_Confirmed',
    }
   
  ];

  const list = ['Total','Active','Deactive','Expired','Provisioning','Installation','Suspended','KYC_Confirmed','Online','Offline']
  
  useEffect(() => {
   if(customers_by_status){
     const newList = list.map((key)=>{
        const d = data.find((d)=>d.key ===key);
        const c = customers_by_status.find((c)=> c && c.status === key);
        if(!!c){
          d.count = c.count;
        }
        return d;
     })
     setCustomerStatus(newList);
   }
  }, [customers_by_status])
  return (
    <div className="bandwidth-usage">

      <Row>
        <Col md={12}>
          <List
            grid={{
              gutter: 16,
              column: 4,
            }}
            dataSource={customerStatus}
            renderItem={item => (
              <List.Item>
                <Card title={item.title} style={{ backgroundColor: item.color, borderRadius: '4px' }} >
                  <div className='counter'>
                    <div className='customerCardCount'>{item.count}</div>
                    <div className='customerCardTitle'>{item.status}</div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Col>

      </Row>

    </div>
  );
};

CustomerByStatus.propTypes = {

};

export default CustomerByStatus;
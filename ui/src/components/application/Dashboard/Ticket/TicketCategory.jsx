import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  FormGroup,
  Label,

} from "reactstrap";
import moment from 'moment';
import Select from '../Common/Select';
import {getConvertedDataByMonthNodate}  from '../Common/getConvertedData';
import TimelineChart from '../Charts/TimelineChart';
import orderBy from 'lodash/orderBy';
import startCase from 'lodash/startCase';
import toLower from 'lodash/toLower';

const TicketCategory = ({ ticketInfo }) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [selectedRadioBtn, setSelectedRadioBtn] = useState('total');
  const [greenTotal, setGreenTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [graphdata, setGraphata]= useState([]);
  const [dataOfSelectedMonthInfo, setDataOfSelectedMonthInfo] = useState([])
  const [totalSolvedTicket, setTotalSolvedTicket] = useState(0)
  const [totalUnsolvedTicket, setTotalUnsolvedTicket] = useState(0)

  
  useEffect(() => {
    let dataFromAPI = [];
    if(selectedRadioBtn=='total'){
      dataFromAPI =ticketInfo.tickets_created_by_ticket_category_per_month;
    }else if(selectedRadioBtn=='solved'){
      dataFromAPI = ticketInfo.resolved_tickets_by_ticket_category_per_month;
    }else if(selectedRadioBtn=='unsolved'){
      dataFromAPI = ticketInfo.unresolved_tickets_by_ticket_category_per_month;
    }
 
     const dataFromAPIsolved = getConvertedDataByMonthNodate(ticketInfo.resolved_tickets_by_ticket_category_per_month);
     const dataOfSelectedMonthsolved = dataFromAPIsolved[selectedMonth];
     const dataFromAPIunsolved = getConvertedDataByMonthNodate(ticketInfo.unresolved_tickets_by_ticket_category_per_month);
     const dataOfSelectedMonthunsolved = dataFromAPIunsolved[selectedMonth];
     if (dataOfSelectedMonthsolved) {
      let total = 0;
      dataOfSelectedMonthsolved.forEach((a)=>{
        total = total+ a.count;
      })
      setTotalSolvedTicket(total)
    }
    if (dataOfSelectedMonthunsolved) {
      let total = 0;
      dataOfSelectedMonthunsolved.forEach((a)=>{
        total = total+ a.count;
      })
      setTotalUnsolvedTicket(total)
    }
    const dataByMonth = getConvertedDataByMonthNodate(dataFromAPI);
  
    const dataOfSelectedMonth = dataByMonth[selectedMonth];
    setDataOfSelectedMonthInfo(dataOfSelectedMonth)
    const d=[];
    if(dataOfSelectedMonth){
      const dataList  = orderBy(dataOfSelectedMonth, ['count'],['asc']); 
       
        for(let i=0; i<dataList.length; i++){
          d.push({
            name: dataList[i].category,
            data: [
                {
                    x: 'Category',
                    y: [
                        i==0 ? 0 :  dataList[i-1].count,
                        i==0 ? dataList[i].count : dataList[i-1].count + dataList[i].count
                    ]
                },
            ]
        })
        }
       
        setGraphata(d);
    }
 

}, [selectedMonth, selectedRadioBtn])

  useEffect(() => {
    if (dataOfSelectedMonthInfo) {
      let total = 0;
      dataOfSelectedMonthInfo.forEach((a)=>{
        total = total+ a.count;
      })
      setGreenTotal(total)
      // if (selectedRadioBtn == 'total') { 
      
      // } else if (selectedRadioBtn == 'solved') {
      //   setGreenTotal(ticketInfo.total_solved_tickets)
      // } else if (selectedRadioBtn == 'unsolved') {
      //   setGreenTotal(ticketInfo.total_unsolved_tickets)
      // }
    }

  }, [ticketInfo, selectedRadioBtn, dataOfSelectedMonthInfo]);

  const getTotalTicketsInfo = () => {
    if (ticketInfo) {
      if (selectedRadioBtn == 'total') {
        return <></>;
      } else if (selectedRadioBtn == 'solved') {
        return <>
          <div className="ticket-category-total-ticket">Total tickets <span className="count">{ticketInfo.total_no_of_tickets}</span></div>
          <div className="ticket-category-total-ticket">Unresolved <span className="count">{totalUnsolvedTicket}</span></div>
        </>
      } else if (selectedRadioBtn == 'unsolved') {
        return <>
        <div className="ticket-category-total-ticket">Total tickets <span className="count">{ticketInfo.total_no_of_tickets}</span></div>
        <div className="ticket-category-total-ticket">Resolved <span className="count">{totalSolvedTicket}</span></div>
      </>
      }
    }
  }

  return (
    <div className="bandwidth-usage ticket-card">
      <Card style={{paddingRight:"54px"}}>
        <CardHeader>
          <div className="month-dropdown" style={{
            textAlign: 'right',
            float: 'none'
          }}><span>Sort by:</span>
         <Select list={months}  setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>

          </div>
          <Row>
            <Col md={9}>
              <div className="new-customer-count"><span className="customerCount green-color">{greenTotal}</span></div>
              <div className="ticket-category-sub-text"> {startCase(toLower(selectedRadioBtn))} tickets this month
              </div>
              <div className="ticket-category-sub-title"> Categories ({graphdata.length})
              </div>
            </Col>
            <Col md={3} style={{ paddingTop: '30px' }}>
              {getTotalTicketsInfo()}

            </Col>
          </Row>
        </CardHeader>

        <TimelineChart data={graphdata}/>
        <Row >
          <Col >
            <FormGroup
              className="m-t-15 m-checkbox-inline mb-0 custom-radio-ml"
              style={{ display: "flex", float: 'right' }}
            >
              <div className="">
                <Input
                  id="total"
                  type="radio"
                  name="radio1"
                  className="radio_animated"
                  checked={selectedRadioBtn == 'total'}
                  onClick={() => setSelectedRadioBtn('total')}
                />
                <Label className="mb-0" for="total">
                  <span className="digits">Total tickets</span>
                </Label>
              </div>
              &nbsp;&nbsp;
              <div className="">
                <Input
                  id="solved"
                  type="radio"
                  name="radio1"
                  className="radio_animated"
                  checked={selectedRadioBtn == 'solved'}
                  onClick={() => setSelectedRadioBtn('solved')}
                />
                <Label className="mb-0" for="solved">
                  <span className="digits">Solved</span>
                </Label>
              </div>
              &nbsp;&nbsp;
              <div className="">
                <Input
                  id="unsolved"
                  type="radio"
                  name="radio1"
                  className="radio_animated"
                  checked={selectedRadioBtn == 'unsolved'}
                  onClick={() => setSelectedRadioBtn('unsolved')}
                />
                <Label className="mb-0" for="unsolved">
                  <span className="digits">Unsolved</span>
                </Label>
              </div>
            </FormGroup>
          </Col>
        </Row>

      </Card>
    </div>
  );
};

TicketCategory.propTypes = {

};

export default TicketCategory;
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import DateSelect from '../Common/DateSelect'
import { Card,Row,Col } from 'reactstrap';
import PieChartWithColor from '../Charts/PieChartWithColor';
import moment from 'moment';

const PaymentType = ({paymentInfo, getPaymentInfoBydate, defautDatePickerValue }) => {
    const [customerStatusdateRange, setCustomerStatusDateRange] = useState(defautDatePickerValue)
    const [paymentList, setPaymentList] = useState([]);
    const [totalCountForGraph, setTotalCountForGraph]= useState(0);

    const colorCodes = {
        wallet: '#26EB22',
        DC:'#EBE355',
        paylater:'#EBE320',
        netbanking:'#EBE326',
        DEBT:'#DF2E88',
        upi:'#DF2E2E',
        other:'#26EB5D'
    }

    useEffect(()=>{
        const startDate = moment(customerStatusdateRange[0]).format("YYYY-MM-DD")
        const endDate = moment(customerStatusdateRange[1]).format("YYYY-MM-DD")
        getPaymentInfoBydate(startDate, endDate,'paymentType');
    },[customerStatusdateRange])

    useEffect(() => {
        if(paymentInfo.paymentType){
          console.log("paymentInfo.paymentType", paymentInfo.paymentType);
          const list =[];
          let totalCount = 0;
          let otherTypeObj = {
            amount: 0,
            value:  0,
            type: 'Other methods',
            color: '#26EB5D'
          };
          for(let i=0;i<paymentInfo.paymentType.length; i++){
            totalCount = totalCount + paymentInfo.paymentType[i].count;
            if(paymentInfo.paymentType[i].online_payment_mode == 'upi' || paymentInfo.paymentType[i].online_payment_mode == 'netbanking'){
                list.push({...paymentInfo.paymentType[i], 
                    amount: parseInt(paymentInfo.paymentType[i].amount__sum),
                    value:  paymentInfo.paymentType[i].count,
                    type: paymentInfo.paymentType[i].online_payment_mode  == 'upi' ? 'UPI Payments' : 'Net Banking',
                    color: colorCodes[paymentInfo.paymentType[i].online_payment_mode]})
            }else{
                otherTypeObj = {
                    ...otherTypeObj, 
                    amount: parseInt(otherTypeObj.amount + paymentInfo.paymentType[i].amount__sum),
                    value: otherTypeObj.value + paymentInfo.paymentType[i].count,
                }
            }

          }
          list.push({...otherTypeObj})
          setTotalCountForGraph(totalCount);
          setPaymentList([...list]);
        }
 
    }, [paymentInfo.paymentType])

    return (
        <div>
              <Card style={{height:"389px"}}>
            <div className="flex-container flex-justify-space-between payment-grossdata-header">
                <span className="title">Payment Type</span>
                <span style={{float: 'right'}}>
                 <DateSelect setDateRange={setCustomerStatusDateRange} 
                 defaultPickerValue={defautDatePickerValue}/>
                </span>
            </div>
            <div className="payment-type-cards" >
                <Row>
                  
                        {paymentList.map((l)=>{
                            return    <Col md={4} lg={4}><Card className="payment-type-card"> 
                            <PieChartWithColor 
                            type={l.type}
                            value={l.value}  
                            maxTotal={totalCountForGraph}
                            options={{
                                        legend: {position: 'none'},
                                        colors: [
                                            l.color,
                                            '#E9E9E9',
                                        ],
                                        tooltip: {
                                            text: 'value'
                                        },
                                        chartArea: {'width': '100%', 'height': '80%'},
                                        pieSliceText: 'value',
                                        stroke: {
                                            width: 0
                                          },
                                    }} />
                            <div className="customer-type-customer">{l.value}+ Customers</div>
                            <div className="customer-type-upi">{l.type}</div>
                            <div className="customer-type-gross">Gross payments</div>
                            <div style={{textAlign: 'center'}}><span style={{fontSize:'18px'}}>₹</span> <span className="customer-type-payment">{l.amount}</span></div>
                        </Card>
                        </Col>
                        })}
                  
                </Row>
           
            </div>
        </Card>
        </div>
    );
};

PaymentType.propTypes = {
    
};

export default PaymentType;
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Row,
    Col,
    Card
} from "reactstrap";
import BarsWithValue from '../Charts/BarsWithValue';
import Select from '../Common/Select';
import {getConvertedDataByMonth} from '../Common/getConvertedData';

const TicketCreated = ({ total_tickets_created_per_month }) => {
    const [selectedMonth, setSelectedMonth] = useState('October');

    const [categories, setCategories]= useState([]);
    const [series, setSeries]= useState([]);
    const [columnWidth, setColumnWidth]= useState(35);

    useEffect(() => {
        const dataByMonth = getConvertedDataByMonth(total_tickets_created_per_month);
     
        const dataOfSelectedMonth = dataByMonth[selectedMonth];
        if(dataOfSelectedMonth){
            const ser=[];
            const cat= Object.keys(dataOfSelectedMonth); 
            for(let i=0; i<cat.length; i++){
                    ser.push(dataOfSelectedMonth[cat[i]].count);
            }
           
            setCategories(cat);
            setSeries(ser)
            var optimalColumnWidthPercent = 20 + (60 / (1 + 30*Math.exp(-cat.length /3)));
            setColumnWidth(optimalColumnWidthPercent);
        }
     
       

    }, [selectedMonth])

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
 //   const categories  = [5,10,12,14,16,18,20,22,24,26,28,30]
 //   const series =[45,13,39,39,39,39,39,39,39,39,39,39]
    return (
        <Card>
            <Row>
                <Col md={6}>
                    <div className="card-title leads-generated">Tickets Created</div>
                </Col>
                <Col md={6}>
                    <div className="month-dropdown"><span>Sort by:</span>
                        <Select list={months}  setSelectedMonth={setSelectedMonth} selectedMonth={selectedMonth}/>
                    </div>
                </Col>
            </Row>
            <BarsWithValue graphData={{categories: categories, series:series, dataLabelsPosition:'top',  seriesName :'Ticket',  
            offsetY:-20, columnWidth: columnWidth+'%', selectedMonth:selectedMonth}}/>
        </Card>
    );
};

TicketCreated.propTypes = {

};

export default TicketCreated;
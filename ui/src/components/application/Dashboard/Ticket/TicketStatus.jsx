import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import {
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Input
} from "reactstrap";
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import {getConvertedDataByMonthNodate}  from '../Common/getConvertedData';
import Select from '../Common/Select';
import FloatBarGraph from '../Charts/FloatBarGraph'

const TicketStatus = ({tickets_by_status_per_month}) => {
    const [labels, setLabels] = useState([]);
    const [series, setSeries] = useState([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [columnWidth, setColumnWidth]= useState(35);

    useEffect(() => {
        const dataByMonth = getConvertedDataByMonthNodate(tickets_by_status_per_month);
        const dataByMonthFiltered = {};
        let labelsArr = [];
        for(var prop in dataByMonth) {
          if(!isEmpty(dataByMonth[prop])){
            labelsArr.push(prop);
            const dataList  = orderBy(dataByMonth[prop], ['count'],['asc']); 
            dataByMonthFiltered[prop] = [...dataList];
          }
        }
        labelsArr = labelsArr.map((l)=>l.substring(0,3));
        setLabels(labelsArr);
        var optimalColumnWidthPercent = 20 + (60 / (1 + 30*Math.exp(-labelsArr.length /3)));
        setColumnWidth(optimalColumnWidthPercent);
        let assign =[];
        let closed = [];
        let inprogress =[];
        let open =[];
        let resolved=[]
        for(var prop in dataByMonthFiltered) {
          if(!isEmpty(dataByMonthFiltered[prop])){
           for(let i=0; i<dataByMonthFiltered[prop].length; i++){
             if(dataByMonthFiltered[prop][i].status == 'Assigned'){
              assign.push(dataByMonthFiltered[prop][i].count)
             }
            else if(dataByMonthFiltered[prop][i].status == 'Closed'){
              closed.push(dataByMonthFiltered[prop][i].count)
             }
             else if(dataByMonthFiltered[prop][i].status == 'In-Progress'){
              inprogress.push(dataByMonthFiltered[prop][i].count)
             }
           else if(dataByMonthFiltered[prop][i].status == 'Open'){
              open.push(dataByMonthFiltered[prop][i].count)
             }
           else if(dataByMonthFiltered[prop][i].status == 'Resolved'){
            resolved.push(dataByMonthFiltered[prop][i].count)
             }
           }
          }
        }

        const data =  [
          {
            label: 'Assigned',
            data: [...assign],
            backgroundColor: '#EBEFF4',
            borderRadius: 50,
            borderSkipped: false,
      
          },
          {
            label: 'Closed',
            data: [...closed],
            backgroundColor: '#FFAE80',
            borderRadius: 50,
          },
          {
            label: 'In-Progress',
            data: [...inprogress],
            backgroundColor: '#FFCAAB',
            borderRadius: 50,
          },
          {
            label: 'Open',
            data: [...open],
            backgroundColor: '#FF843F',
            borderColor: '#FF843F',
            borderWidth: 2,
            borderRadius: 5,
            borderSkipped: false,
          },
          {
            label: 'Resolved',
            data: [...resolved],
            backgroundColor: '#FF8400',
            borderColor: '#FF8400',
            borderWidth: 12,
            borderRadius: 15,
            borderSkipped: false,
          },
         
        ]
        setSeries(data);
       
    }, [tickets_by_status_per_month])

    return (
        <div className="bandwidth-usage">
        <Card>
          
            <FloatBarGraph 
            labels={labels}
            series={series} 
            columnWidth={columnWidth+'%'}/>
        </Card>
    </div>
    );
};

TicketStatus.propTypes = {
    
};

export default TicketStatus;
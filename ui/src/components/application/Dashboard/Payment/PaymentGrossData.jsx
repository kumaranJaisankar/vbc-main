import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DateSelect from '../Common/DateSelect'
import { Card } from 'reactstrap';
import MixMultipleLine from '../Charts/MixMultipleLine';
import moment from 'moment';
import { getConvertedDataByMonthKeyYear } from '../Common/getConvertedData';

const PaymentGrossData = ({ paymentInfo, getPaymentInfoBydate, defautDatePickerValue  }) => {
    const [customerStatusdateRange, setCustomerStatusDateRange] = useState(defautDatePickerValue)
    const [catagories, setCategories] = useState([]);
    const [avgSeries, setAvgSeries] = useState([]);
    const [grossSeries, setGrossSeries] = useState([]);
    const [columnWidth, setColumnWidth]= useState(35);

    useEffect(()=>{
        const startDate = moment(customerStatusdateRange[0]).format("YYYY-MM-DD")
        const endDate = moment(customerStatusdateRange[1]).format("YYYY-MM-DD")
        getPaymentInfoBydate(startDate, endDate,'paymentGrossData');
    },[customerStatusdateRange])

    useEffect(() => {
        if(paymentInfo.paymentGrossData){
            const avgMonthsdata = getConvertedDataByMonthKeyYear(paymentInfo.paymentGrossData.average_payment_gross_by_month)
            const grossMonthsdata = getConvertedDataByMonthKeyYear(paymentInfo.paymentGrossData.sum_of_payment_gross_by_month)
            const categoriesKeys = Object.keys(avgMonthsdata);
            setCategories(categoriesKeys);
            let avgSeries = [];
            let grossSeries = []
            for(let i=0; i<categoriesKeys.length; i++){
                const avg_amount = avgMonthsdata[categoriesKeys[i]].amount__avg;
                const gross_amount = grossMonthsdata[categoriesKeys[i]].amount__sum;
                avgSeries.push(avg_amount.toFixed(2));
                grossSeries.push(gross_amount.toFixed(2));
            }
            setGrossSeries(grossSeries);
            setAvgSeries(avgSeries);
            var optimalColumnWidthPercent = 20 + (60 / (1 + 30*Math.exp(-catagories.length /3)));
            setColumnWidth(optimalColumnWidthPercent);
        }
 
    }, [paymentInfo.paymentGrossData])

    return (
        <Card>
            <div className="flex-container flex-justify-space-between payment-grossdata-header gross-graph">
                <span className="title">Payment Gross Data</span>
                <span style={{float: 'right'}}>
                 <DateSelect setDateRange={setCustomerStatusDateRange} 
                 defaultPickerValue={defautDatePickerValue}/>
                </span>
            </div>
            <div className="payment-grossdata-graph">
                <MixMultipleLine 
                catagories={catagories} 
                avgSeries={avgSeries} 
                grossSeries={grossSeries}
                columnWidth={(columnWidth-10)+'%'}/>
            </div>
        </Card>
    );
};

PaymentGrossData.propTypes = {
    
};

export default PaymentGrossData;
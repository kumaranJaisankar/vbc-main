import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    Card,
    CardHeader,
    Row,
    Col,
} from "reactstrap";
import SpineArea from '../Charts/SpineArea';
import Select from '../Common/Select';

const BandWidthUsage = ({ daily_consumption, monthly_consumption }) => {
    const [selectedMonth, setSelectedMonth] = useState('October');
    const [bandwidthDataByMonth, setBandwidthDataByMonth] = useState({
        January: {},
        February: {},
        March: {},
        April: {},
        May: {},
        June: {},
        July: {},
        August: {},
        September: {},
        October: {},
        November: {},
        December: {}
    });
    const [currentData, setCurrentData] = useState({series:[], categories:[]});

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        const daily_consumptionKeys = Object.keys(daily_consumption);
        for (let i = 0; i < daily_consumptionKeys.length; i++) {
            let d = daily_consumptionKeys[i];
            var dateIn = moment(d, "DD/MM/YYYY");
            let checkMonth = dateIn.format("M") - 1;
            let checkDate = dateIn.format("D");
            let newData = { ...bandwidthDataByMonth[months[checkMonth]] };
            newData[checkDate] = { ...daily_consumption[daily_consumptionKeys[i]] };

            bandwidthDataByMonth[months[checkMonth]] = {
                ...newData
            };
        }
        setBandwidthDataByMonth(bandwidthDataByMonth);

    }, [daily_consumption])

    useEffect(() => {
        if (bandwidthDataByMonth[selectedMonth]) {
            const selectedata = bandwidthDataByMonth[selectedMonth];
            let daily_download_consumption = {}
            let daily_upload_consumption = {}
            for (let i = 1; i <= 31; i++) {
                if (selectedata[i]) {
                    daily_download_consumption[i] = selectedata[i].daily_download_consumption
                    daily_upload_consumption[i] = selectedata[i].daily_upload_consumption
                } else {
                    daily_download_consumption[i] = 0
                    daily_upload_consumption[i] = 0
                }
            }
            let daily_download_consumption_new ={...daily_download_consumption};
             for(let key in daily_download_consumption){
                 if(key % 2 !== 0)
                 delete daily_download_consumption_new[key] ;
             }
             const daily_upload_consumption_new = {...daily_upload_consumption};
             for(let key in daily_upload_consumption){
                if(key % 2 !== 0)
                delete daily_upload_consumption_new[key] ;
            }
  
            const data = {
                series: [{
                    name: 'Download',
                    data: Object.values(daily_download_consumption_new)
                },
                {
                    name: 'Upload',
                    data: Object.values(daily_upload_consumption_new)
                }
                ],
                categories: Object.keys(daily_download_consumption_new)
            }
            setCurrentData({ ...data })
        }
    }, [selectedMonth])

    return (
        <div className="bandwidth-usage network-bandwidth-graph">
            <Card>
                <CardHeader>
                    <Row>
                        <Col md={5}>
                         <div className="title1">Bandwidth Usage</div>
                            <div className="bandwidth-usage-avg">Avg.<span className="count">
                                 {monthly_consumption[selectedMonth] ? monthly_consumption[selectedMonth]:0}Gb</span> in {selectedMonth}</div>
                        </Col>
                        <Col md={7}>
                            <div className="month-dropdown"><span>Month:</span>
                                <Select list={months} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth}/>
                                </div>
                        </Col>
                    </Row>
                </CardHeader>
                <SpineArea series={currentData.series} categories={currentData.categories} toolbarShow={false} month={selectedMonth}/>
            </Card>
        </div>
    );
};

BandWidthUsage.propTypes = {

};

export default BandWidthUsage;
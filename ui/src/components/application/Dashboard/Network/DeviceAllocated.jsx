import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardBody,
    CardHeader,
    Row,
    Col,
    Input
} from "reactstrap";
import PieChart from '../Charts/PieChart';
const DeviceAllocated = props => {
    const [selectDeviceType, setSelectDeviceType] = useState('active')

    return (
        <div className="device-allocated">
            <Card>
                <CardHeader>
                    <div className="title">Devices Allocated</div>
                    <div className="subtitle">Total connected network devices</div>
                    <div className="input_wrap allocated-devices-dropdown">
                        <Input
                            type="select"
                            name="allocatedDevice"
                            className={`form-control digits ${selectDeviceType ? 'not-empty' : ''}`}
                            onChange={(e)=>setSelectDeviceType(e.target.value)}
                            value={selectDeviceType}
                        >
                          <option key={'active'} value={'active'}>
                                    {'active'}
                                </option>
                                <option key={'inactive'} value={'inactive'}>
                                    {'inactive'}
                                </option>
                        </Input>
                    </div>
                </CardHeader>
                <CardBody style={{padding: '0px',marginLeft:"20%"}}>
                    {props.allocatedDevices ? 
                    <PieChart
                        style={{margin: 'auto', width: "380px", height:"340px",}}
                        data={[
                            ['Device', 'No of Devices'],
                            ['NAS', props.allocatedDevices[selectDeviceType].Nas],
                            ['OLT', props.allocatedDevices[selectDeviceType].Olt],
                            ['DP', props.allocatedDevices[selectDeviceType].Dp],
                            ['CPE', props.allocatedDevices[selectDeviceType].CPE],
                        ]}
                        options={{
                            legend: {
                                position: 'bottom'
                            },
                            colors: [
                                "#855CF8",
                                '#E289F2',
                                "#6340C2",
                                "#B085FF",
                            ],
                            tooltip: {
                                text: 'value'
                            },
                            pieSliceText: 'value'
                        }} />
                        :
                        <span> No allocated Devices Data</span>
                        }
                </CardBody>
            </Card>
        </div>
    );
};

DeviceAllocated.propTypes = {

};

export default DeviceAllocated;
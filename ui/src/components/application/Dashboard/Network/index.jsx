import React from 'react';

import {
    Row,
    Col
} from "reactstrap";
import BandWidthUsage from './BandWidthUsage';
import DeviceAllocated from './DeviceAllocated';
import DeviceByArea from './DeviceByArea';

const NetworkDashboard = ({ networkInfo }) => {

    return (
        <div className="dashboard-content">
            <div className="dashboard-content-title">Network</div>
            <Row className="bandwidth-allocation">
                <Col xs={12} md={8} lg={8}>
                    {networkInfo.daily_consumption && <BandWidthUsage daily_consumption={networkInfo.daily_consumption} monthly_consumption={networkInfo.monthly_consumption}/>}
                </Col>
                <Col xs={12} md={4} lg={4} className="device-allocated">
                    {networkInfo.device_count &&
                        <DeviceAllocated allocatedDevices={networkInfo.device_count} />
                    }
                </Col>
            </Row>
            {networkInfo.device_locations &&
                <DeviceByArea deviceLocations={networkInfo.device_locations} />
            }
        </div>
    )
}

export default NetworkDashboard;
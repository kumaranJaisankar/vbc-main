import React, {useState, useEffect} from 'react';
import CLTable from './CLTable';
import {
    Card,
    CardHeader,
    Row,
    Col,
} from "reactstrap";
import moment from 'moment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const ConvertedLeadTable = props => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
       if(props.converted_leads){
           const list = props.converted_leads.map((lead)=>{
            return   {
                id: lead.id,
                name: lead.first_name + ' '+lead.last_name,
                date: moment(lead.created_at).format('LL'),
                phone: lead.mobile_no,
                source: lead.lead_source.name,
                status: lead.status,
                type: lead.type.name
            }
           })
           setTableData([...list]);
       }
    }, [props.converted_leads]);

    return (
        <div className="bandwidth-usage">
        <Card style={{padding:"25px", height:"481px"}}>
            <CardHeader>
                <Row>
                    <Col md={8}>
                        <div className="card-title leads-generated1" style={{fontSize:"20px"}}>Total Leads Conversion <ArrowForwardIcon/> {tableData.length}</div>
                        <br/>
                       
                    </Col>
                    <Col md={4}>
                    {/* <div className="month-dropdown"><span>Sort by:All</span>
                            <span className="input_wrap">
                                <Input
                                    type="select"
                                    name="bandwidthusage"
                                >
                              
                                </Input>
                            </span>
                            </div> */}
                          <a href={`/app/leads/leadsContainer/${process.env.REACT_APP_API_URL_Layout_Name}`}>
                       <ArrowForwardIcon className="lead-arrow-icon"/>
                         </a>
                    </Col>
                 
                </Row>
            </CardHeader>
            <CLTable data={tableData}/>
        </Card>
    </div>
    );
};

ConvertedLeadTable.propTypes = {
    
};

export default ConvertedLeadTable;
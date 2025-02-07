import React,{useState,useEffect} from "react";
import DataTable from "react-data-table-component";
import { iptvaxios } from "../../../../axios";


const ChannelsTable = (props)=>{
    const [channels,setChannels] = useState([]);
    useEffect(
        ()=>{
            iptvaxios.get("/api/channel/getChannels").then(
                (res)=>setChannels(res.data)
            ).catch(
                err=>console.log(err)
            )
        },[props.refresh]
    );
    const TableColumns = [
        {
            name:"Id",
            selector:"id",
            cell: (row) => (
                <>
                  <a
                    onClick={() => props.openCustomizer("3", row)}
                    className="openmodal"
                  >
                    CH{row.id}
                  </a>
                </>
              ),
        },
        {
            name:"Name",
            selector:"name",
            sortable:true 
        },
        {
            name:"Genre",
            selector:"genre",
            sortable:true 
        },
        {
            name:"Type",
            sortable:true,
            cell : (row)=>{
                return (
                    <div>{row.type?"FREE":"PAID"}</div>
                )
            }   
        },
        {
            name:"Status",
            sortable:true,
            cell:(row)=>{
                return(
                    <div>{row.status?"ACTIVE":"INACTIVE"}</div>
                )
            }
        },
        {
            name:"Language",
            selector:"language",
            sortable:true 
        },
        {
            name:"Channel ID",
            selector:"channelId",
            sortable:true   
        },
        {
            name:"Price",
            selector:"price",
            sortable:true   
        }
    
    ];

    return(
        <DataTable
            className="customer-list"
            columns={TableColumns}
            data={channels}
            pagination

        />
    )
}
export default ChannelsTable;

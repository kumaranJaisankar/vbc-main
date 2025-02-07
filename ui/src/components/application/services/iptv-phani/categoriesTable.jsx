import React,{useState,useEffect} from "react";
import { iptvaxios } from "../../../../axios";
import DataTable from "react-data-table-component";
import moment from "moment";



const CategoriesTable = (props)=>{
    const [categories,setCategories] = useState([]);
    useEffect(()=>{
        iptvaxios.get("/api/category/getCategories").then(
            res=>setCategories(res.data)
        ).catch(
            err=>console.log(err)
        )
    },[props.refresh])
    const TableColumns=[
        {
            name:"ID",
            selector:"id",
            cell: (row) => (
                <>
                  <a
                    onClick={() => props.openCustomizer("3", row)}
                    className="openmodal"
                  >
                    CA{row.id}
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
            name:"Status",
            sortable:true,
            cell:(row)=>{
                return(
                    <div>{row.status?"ACTIVE":"INACTIVE"}</div>
                )
            }
        },
        {
            name:"Channel Count",
            sortable:true,
            cell : (row)=>{
                return(
                    <div>{row.channels.length}</div>
                )
            }
        },
        {
            name:"Created Date",
            sortable:true,
            cell:(row)=>{return(
                <div>
                    {moment(row.createdDate).format("DD MMM YYYY")}
                </div>
            )}
    
        },
        {
            name:"Created By",
            sortable:true,
            selector:"createdBy"
        }
    ];
    return (
        <DataTable
            className="customer-list"
            columns={TableColumns}
            data={categories}
            pagination
        />
    )
};
export default CategoriesTable;
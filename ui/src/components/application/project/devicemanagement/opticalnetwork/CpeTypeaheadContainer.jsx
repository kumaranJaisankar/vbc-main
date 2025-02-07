import React,{useState} from 'react';
import { Typeahead } from "react-bootstrap-typeahead";


const CpeTypeaheadContainer =(props)=>{
  
    const [selectedopenfor, setSelectedopenfor] = useState([]);
 
    const [openToFilter, setOpenToFilter] = useState([]);

    
    return (
        <Typeahead
        id="multiple-typeahead"
        className=""
        filterBy={['username']}
        labelKey="username"
        renderMenuItemChildren={(option, props) => (
          <div className="openmodal">
            <div className="openmodal">{option.username}</div>
           
          </div>
        )}

        placeholder="Search With Customer ID"
        selected={selectedopenfor}
        onChange={(selected) => {
          if (selected.length > 0) {
            props.setSelectedId(selected[0].username)
           
          }

          setSelectedopenfor(selected);
        }}
        options={openToFilter}
        onInputChange={(text) => {
          if (text !== '' && props.leadUsers && props.leadUsers.length > 0) {
            let arrFilter = props.leadUsers.filter((lead) => {
              console.log(text,"textlead");
              console.log(lead, "textlead");
              return (
              
                lead.username.toLowerCase().indexOf(text.toLowerCase()) !== -1
              )
            })
            setOpenToFilter(arrFilter)
          } else {
            setOpenToFilter([])
          }
        }}
        onFocus={() => setOpenToFilter([])}
      />
    )
}

export default CpeTypeaheadContainer;
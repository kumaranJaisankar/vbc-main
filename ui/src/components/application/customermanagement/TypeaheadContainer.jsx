import React, { useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import Paper from "@mui/material/Paper";

const TypeaheadContainer = (props) => {
  const [selectedopenfor, setSelectedopenfor] = useState([]);

  const [openToFilter, setOpenToFilter] = useState([]);

  return (
    <Paper component="div" style={{ width: "260px", boxShadow: "none" }}>
      <Typeahead
        id="multiple-typeahead"
        className=""
        filterBy={["id", "first_name", "email", "mobile_no"]}
        labelKey="id"
        renderMenuItemChildren={(option, props) => (
          <div>
            <div>{option.id}</div>
            <div>{option.first_name}</div>
            <div>{option.email}</div>
            <div>{option.mobile_no}</div>
          </div>
        )}
        placeholder="Search With Lead ID,  Mobile,  Email"
        selected={selectedopenfor}
        onChange={(selected) => {
          if (selected.length > 0) {
            props.setSelectedId(selected[0].id);
          }

          setSelectedopenfor(selected);
        }}
        options={openToFilter}
        onInputChange={(text) => {
          if (text !== "" && props.leadUsers && props.leadUsers.length > 0) {
            let arrFilter = props.leadUsers.filter((lead) => {
              console.log(text, "textlead");
              console.log(lead, "textlead");
              return (
                (lead.first_name &&
                  lead.first_name.toLowerCase().indexOf(text.toLowerCase()) !==
                    -1) ||
                (lead.email &&
                  lead.email.toLowerCase().indexOf(text.toLowerCase()) !==
                    -1) ||
                lead.mobile_no.indexOf(text.toLowerCase()) !== -1 ||
                lead.id.toLowerCase().indexOf(text.toLowerCase()) !== -1
              );
            });
            setOpenToFilter(arrFilter);
          } else {
            setOpenToFilter([]);
          }
        }}
        onFocus={() => setOpenToFilter([])}
      />
    </Paper>
  );
};

export default TypeaheadContainer;

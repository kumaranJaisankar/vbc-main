import React, { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";

const TypeaheadSearch = (props) => {
  const [selectedopenfor, setSelectedopenfor] = useState([]);

  const url = window.location.pathname.split("/")[4];

  useEffect(() => {
    if (url != "customerdetails") {
      setSelectedopenfor([]);
      props.setCustomerListToShow([]);
    }
    // Function will retrigger on URL change
  }, [url]);

  useEffect(() => {}, []);

  // const results = props.customerListToShow.length -1;
  return (
    <>
      <Typeahead
        // onPaginate={()=>{props.nextPage()}}
        // paginate={true}
        // paginationText={"show more"}
        // onKeyDown={ ()=>props.keyPress()}
        onKeyDown={props.handleKeyDown}
        id="multiple-typeahead"
        className="input_search"
        filterBy={["username"]}
        labelKey={props.globalSearchBy}
        autocomplete="off"
        placeholder="Search With Username"
        style={{
          width: "300px",
          borderRadius: "20px",
          fontFamily: "Open Sans",
          fontStyle: "normal",
          fontWeight: "400",
          fontSize: "16px",
          lineHeight: "22px",
          color: "#A6A6A6 !important",
        }}
        emptyLabel={
          props?.getList === undefined || props?.getList === []
            ? " "
            : props.loading
        }
        // maxResults={(props.nextPage1?.currentPageNo * props.nextPage1?.currentItemsPerPage)-1}
        selected={selectedopenfor}
        onChange={(selected) => {
          if (selected.length > 0) {
            props.setSelectedId(selected[0]);
          }
          setSelectedopenfor(selected);
        }}
        options={props.customerListToShow}
        onInputChange={(text) => {
          props.onChange(text);
        }}
        // onFocus={() => setOpenToFilter([])}
      ></Typeahead>
    </>
  );
};

export default TypeaheadSearch;

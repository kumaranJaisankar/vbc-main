import React, { Fragment } from "react";
import { Row, Col, Button } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import Stack from "@mui/material/Stack";

export const BillingShowSelectedStrings = (props) => {
  return (
    <Fragment>
      <Stack spacing={2} direction="row">
        <button class="rbt-token" style={{height:"33px"}}>
          <a
            style={{ color: "#7366ff" }}
            className="filter-clear-text"
            onClick={() => props.clearAllFilter()}
          >
            Clear
          </a>
        </button>

        <Col sm="9">
          <Typeahead style={{width:"max-content"}}
            selected={props.options && props.options}
            id="public-methods-example"
            labelKey="name"
            emptyLabel=""
            open={false}
            inputProps={{ onFocus: false }}
            multiple
            options={props.options}
            onChange={(selected) => {
              props.setOptions((prev) => {
                const removed = prev.filter((s) => !selected.includes(s));
                props.filterSelectionOptionsFunc(
                  false,
                  props.filterSelectionOptions,
                  removed[0].key.split(".")[0],
                  removed[0].key.split(".")[1]
                );
                return selected;
              });
              let selectedKeys = selected.map((a) => a.key);
              props.setOptionKeys(selectedKeys);
              props.applyFilter(!selected.length);
              props.clearFilterText(selectedKeys);
              if (selected.length === 0) {
                props.clearAllFilter();
              }
            }}
            labelKey={(option) => `${option.stringToShow}`}
          />
        </Col>
      </Stack>
      {!props.hideApply && (
        <Col md="2 text-center">
          <Button size="xs" color="primary" onClick={() => props.applyFilter()}>
            {"Apply Filter"}
          </Button>
        </Col>
      )}
    </Fragment>
  );
};

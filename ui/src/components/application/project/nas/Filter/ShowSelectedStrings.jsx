import React, { Fragment } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Typeahead } from 'react-bootstrap-typeahead'

export const ShowSelectedStrings = (props) => {
  return (
    <Fragment>
      <Row>
        <Col sm="2 clear-text">
          <button class="rbt-token">
            <a
              style={{ color: '#7366ff' }}
              className="filter-clear-text"
              onClick={() => props.clearAllFilter()}
            >
              Clear
            </a>
          </button>
        </Col>
        <Col sm="9">
          <Typeahead
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
                const removed = prev.filter((s) => !selected.includes(s))
                props.filterSelectionOptionsFunc(
                  false,
                  props.filterSelectionOptions,
                  removed[0].key.split('.')[0],
                  removed[0].key.split('.')[1],
                )
                return selected
              })
              let selectedKeys = selected.map((a) => a.key)
              props.setOptionKeys(selectedKeys)
              props.applyFilter(!selected.length)
              props.clearFilterText(selectedKeys)
              if (selected.length === 0) {
                props.clearAllFilter()
              }
            }}
            labelKey={(option) => `${option.stringToShow}`}
          />
        </Col>

        {!props.hideApply && (
          <Col md="2 text-center">
            <Button
              size="xs"
              color="primary"
              onClick={() => props.applyFilter()}
            >
              {'Apply Filter'}
            </Button>
          </Col>
        )}
      </Row>
    </Fragment>
  )
}

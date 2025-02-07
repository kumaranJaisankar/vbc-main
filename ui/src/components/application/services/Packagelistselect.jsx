import React, { Component } from "react";
import { default as ReactSelect } from "react-select";
import { components } from "react-select";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export default class Packagelistselect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionSelected: props.selectedplan ? props.selectedplan : null
    };
  }

  handleChange = (selected) => {
    this.props.setSelectedServicelist(selected)
    this.setState({
      optionSelected: selected
    });
  };

  render() {
    return (
      <span
        class="d-inline-block"
        data-toggle="popover"
        data-trigger="focus"
        data-content="Select Plans"
        style={{width:"100%"}}
      >
        <ReactSelect
          options={this.props.servicelist}
          isMulti
          closeMenuOnSelect={false}
          hideSelectedOptions={false}
          components={{
            Option
          }}
          onChange={this.handleChange}
          allowSelectAll={true}
          value={this.state.optionSelected}
        />
      </span>
    );
  }
}


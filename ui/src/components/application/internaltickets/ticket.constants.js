export const filterSchemaToApply = {
  // status:{
  //   value:{
  //     type: "text",
  //     strVal: "",
  //     label: "{nameplaceholder}",
  //   }
  // },
  open_date: {
    type: "date",
    strVal: null,
    label: "Open date from {dateplaceholder}",
  },
  open_date_end: {
    type: "date",
    strVal: null,
    label: "Open date to {dateplaceholder}",
  },
  assigned_date: {
    type: "date",
    strVal: null,
    label: "Assigned date from {dateplaceholder}",
  },
  assigned_date_end: {
    type: "date",
    strVal: null,
    label: "Assigned date to {dateplaceholder}",
  },
  ticket_category: {
    type: "array",
    results: [],
  },
  subcategory: {
    type: "array",
    results: [],
  },
  assigned: {
    type: "array",
    results: [],
  },
  priority_sla: {
    type: "array",
    results: [],
  },  
  status: {
    type: "array",
    results: [],
  },
  area: {
      type: "array",
      results: [],
  },
  franchise: {
    type: "array",
    results: [],
},
}
export const getAppliedHelpdeskFiltersObj = () => {
  return {   
    open_for:{
      value:{
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      }
    },
    name:{
      value:{
        type: "text",
        strVal: "",
        label: "{nameplaceholder}",
      }
    },
    ticket_category: {
      value: {
        type: "array",
        strVal: [],
        idVal: [],
      },
    },
    // area: {
    //   value:{
    //     type: "text",
    //     strVal: "",
    //     label: "{nameplaceholder}",
    //   }
    // },
  }
}
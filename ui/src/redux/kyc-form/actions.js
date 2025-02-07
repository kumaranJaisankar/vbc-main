import {
  HANDLE_CHANGE_FORM_INPUT,
  TOGGLE_IMAGE_UPLOAD_MODAL,
  TOGGLE_IMAGE_UPLOAD_MODAL1,
  TOGGLE_IMAGE_UPLOAD_MODAL2,
  HANDLE_CHANGE_DISPLAY_IMAGE_INPUT,
  SET_BILLING_ADDRESS_AS_PERMANENT_ADDRESS,
  SET_SERVICE,
  CLEAR_SERVICE,
  OPEN_CUSTOMIZER,
  CLOSE_CUSTOMIZER,
  SET_SELECTED_PLAN,
  CLEAR_SELECTED_PLAN,
  TOGGLE_SIGNATURE_UPLOAD_SIDE_BAR,
  SET_ERRORS,
  SET_FORM_DATA,
  SET_ZONE_BY_BRANCH,
  SET_AREA_BY_ZONE,
  SET_DUE_DATE,
  SET_START_DATE,
  TOGGLE_SAVE_AS_BUTTON,
  SHOW_HIDE_PERMANENT_ADDRESS,
  SET_ACTIVE_ADDRESS_BREADCRUMB,
  SET_TOGGLE_STATE_FOR_SAVE_AS_BILLING_ADDRESS,
  HANDLE_CHANGE_FORM_INPUT1,
  HANDLE_CHANGE_DISPLAY_IMAGE_INPUT1,
  HANDLE_CHANGE_FORM_INPUT2,
  HANDLE_CHANGE_DISPLAY_IMAGE_INPUT2
} from "./constants";

export const handleChangeFormInput = (payload) => {
  return {
    type: HANDLE_CHANGE_FORM_INPUT,
    payload,
  };
};

export const handleChangeFormInput1 = (payload) => {
  return {
    type: HANDLE_CHANGE_FORM_INPUT1,
    payload,
  };
};

export const handleChangeFormInput2 = (payload) => {
  return {
    type: HANDLE_CHANGE_FORM_INPUT2,
    payload,
  };
};


export const handleChangeDisplayImage = (payload) => {
  return {
    type: HANDLE_CHANGE_DISPLAY_IMAGE_INPUT,
    payload,
  };
};

export const handleChangeDisplayImage1 = (payload) => {
  return {
    type: HANDLE_CHANGE_DISPLAY_IMAGE_INPUT1,
    payload,
  };
};

export const handleChangeDisplayImage2 = (payload) => {
  return {
    type: HANDLE_CHANGE_DISPLAY_IMAGE_INPUT2,
    payload,
  };
};


export const toggleImageUploadModal = () => {
  return {
    type: TOGGLE_IMAGE_UPLOAD_MODAL,
  };
};

export const toggleImageUploadModal1 = () =>{
  return {
    type: TOGGLE_IMAGE_UPLOAD_MODAL1,
  };
}

export const toggleImageUploadModal2 = () =>{
  return {
    type: TOGGLE_IMAGE_UPLOAD_MODAL2,
  };
}
export const toggleSignatureUploadSideBar = () => {
  return {
    type: TOGGLE_SIGNATURE_UPLOAD_SIDE_BAR
  }
}

export const setPermanentAddressAsBillingAddress = (payload) => {
  return {
    type: SET_BILLING_ADDRESS_AS_PERMANENT_ADDRESS,
    payload
  }
}

export const setService = (payload) => {
  return {
    type: SET_SERVICE,
    payload
  }
}

export const clearService = () => {
  return {
    type: CLEAR_SERVICE
  }
}

export const openCustomiser = () => {
  return {
    type: OPEN_CUSTOMIZER
  }
}

export const closeCustomiser = () => {
  return {
    type: CLOSE_CUSTOMIZER
  }
}

export const setSelectedPlan = (payload) => {
  return {
    type: SET_SELECTED_PLAN,
    payload
  }
}

export const clearSelectedPlan = () => {
  return {
    type: CLEAR_SELECTED_PLAN
  }
}

export const setFormErrors = (payload) => {
  return {
    type: SET_ERRORS,
    payload
  }
}

export const setFormData = (payload) => {
  return {
    type : SET_FORM_DATA,
    payload
  }
}

export const setZoneByBranch = (payload) => {
  return {
    type: SET_ZONE_BY_BRANCH,
    payload
  }
}

export const setAreaByZone = (payload) => {
  return {
    type: SET_AREA_BY_ZONE,
    payload
  }
}

export const setDueDate = (payload) => {
  return {
    type: SET_DUE_DATE,
    payload
  }
}

export const setStartDate = (payload) => {
  return {
    type: SET_START_DATE,
    payload
  }
}

export const toggleSaveAsButton = () => {
  return {
    type: TOGGLE_SAVE_AS_BUTTON
  }
}

export const togglePermanentAddress = (payload) => {
  return {
    type: SHOW_HIDE_PERMANENT_ADDRESS,
    payload
  }
}

export const setActiveBreadCrumb = (payload) => {
  return {
    type: SET_ACTIVE_ADDRESS_BREADCRUMB,
    payload
  }
}

export const setToggleState = (payload) => {
  return {
    type: SET_TOGGLE_STATE_FOR_SAVE_AS_BILLING_ADDRESS,
    payload
  }
}
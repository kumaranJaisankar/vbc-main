import {
  TOGGLE_DRAFT_MODAL,
  CLOSE_DRAFT_MODAL,
  TOGGLE_PERMISSION_MODAL,
  CLOSE_PERMISSION_MODAL,
  SET_PERMISSION_MODAL_TEXT,
  SET_SELECTED_LEAD_FOR_EDIT,
  UPDATE_SELECTED_LEAD_FOR_SUBMIT,
  SET_CUSTOMER_DETAILS_FOR_SELECTED_EDIT_LEAD,
  SET_SELECTED_EDIT_LEAD_ADDITIONAL_INFORMATION
} from "./constants";

export const toggleDraftModal = () => {
  return {
    type: TOGGLE_DRAFT_MODAL,
  };
};

export const closeDraftModal = () => {
  return {
    type: CLOSE_DRAFT_MODAL,
  };
};

export const togglePermissionModal = () => {
  return {
    type: TOGGLE_PERMISSION_MODAL,
  };
};

export const closePermissionModal = () => {
  return {
    type: CLOSE_PERMISSION_MODAL,
  };
};

export const setPermissionModalText = (payload) => {
  return {
    type: SET_PERMISSION_MODAL_TEXT,
    payload
  };
};

export const setSelectedLeadForEdit = (payload) => {
  return {
    type: SET_SELECTED_LEAD_FOR_EDIT,
    payload
  };
};

export const updateSelectedLeadForSubmit = (payload) => {
  return {
    type: UPDATE_SELECTED_LEAD_FOR_SUBMIT,
    payload
  };
};

export const setSelectedLeadAdditionalInfo = (payload) => {
  return {
    type: SET_SELECTED_EDIT_LEAD_ADDITIONAL_INFORMATION,
    payload
  };
};

export const setSelectedLeadCustomerLists = (payload) => {
  return {
    type: SET_CUSTOMER_DETAILS_FOR_SELECTED_EDIT_LEAD,
    payload
  };
};
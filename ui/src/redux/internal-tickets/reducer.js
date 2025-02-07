import {
  TOGGLE_DRAFT_MODAL,
  CLOSE_DRAFT_MODAL,
  TOGGLE_PERMISSION_MODAL,
  CLOSE_PERMISSION_MODAL,
  SET_PERMISSION_MODAL_TEXT,
  defaultPermissionText,
  SET_SELECTED_LEAD_FOR_EDIT,
  UPDATE_SELECTED_LEAD_FOR_SUBMIT,
  SET_CUSTOMER_DETAILS_FOR_SELECTED_EDIT_LEAD,
  SET_SELECTED_EDIT_LEAD_ADDITIONAL_INFORMATION,
} from "./constants";

const initialState = {
  openDraftModal: false,
  openPermissionModal: false,
  permissionModalText: `${defaultPermissionText}`,
  selectedLeadForEdit: {},
  leadForSubmit: {},
  customerDetails: [],
  selectedWatchList: [],
  workNotes: "",
  worknoteActivities: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DRAFT_MODAL: {
      return {
        ...state,
        openDraftModal: !state.openDraftModal,
      };
    }
    case CLOSE_DRAFT_MODAL: {
      return {
        ...state,
        openDraftModal: false,
      };
    }
    case TOGGLE_PERMISSION_MODAL: {
      return {
        ...state,
        openPermissionModal: !state.openPermissionModal,
      };
    }
    case CLOSE_PERMISSION_MODAL: {
      return {
        ...state,
        openPermissionModal: false,
      };
    }
    case SET_PERMISSION_MODAL_TEXT: {
      return {
        ...state,
        permissionModalText: action.payload || `${defaultPermissionText}`,
      };
    }
    case SET_SELECTED_LEAD_FOR_EDIT: {
      return {
        ...state,
        selectedLeadForEdit: action.payload || {},
        leadForSubmit: action.payload || {},
      };
    }
    case UPDATE_SELECTED_LEAD_FOR_SUBMIT: {
      const { leadForSubmit } = state;
      return {
        ...state,
        leadForSubmit: { ...leadForSubmit, ...action.payload },
      };
    }
    case SET_CUSTOMER_DETAILS_FOR_SELECTED_EDIT_LEAD: {
      return {
        ...state,
        customerDetails: action.payload,
      };
    }
    case SET_SELECTED_EDIT_LEAD_ADDITIONAL_INFORMATION: {
      const { workNotes, selectedWatchList, worknoteActivities, workNotesEdit } = action.payload;
      return {
        ...state,
        workNotes: workNotes || "",
        selectedWatchList: selectedWatchList || state.selectedWatchList,
        worknoteActivities: worknoteActivities || state.worknoteActivities,
        workNotesEdit: workNotesEdit || state.workNotesEdit
      };
    }
    default: {
      return { ...state };
    }
  }
};

import {
  HANDLE_CHANGE_FORM_INPUT,
  TOGGLE_IMAGE_UPLOAD_MODAL,
  HANDLE_CHANGE_DISPLAY_IMAGE_INPUT,
  SET_BILLING_ADDRESS_AS_PERMANENT_ADDRESS,
  SET_SERVICE,
  CLEAR_SERVICE,
  SET_SELECTED_PLAN,
  CLEAR_SELECTED_PLAN,
  OPEN_CUSTOMIZER,
  CLOSE_CUSTOMIZER,
  TOGGLE_SIGNATURE_UPLOAD_SIDE_BAR,
  SET_ERRORS,
  SET_FORM_DATA,
  SET_AREA_BY_ZONE,
  SET_ZONE_BY_BRANCH,
  SET_DUE_DATE,
  SET_START_DATE,
  TOGGLE_SAVE_AS_BUTTON,
  SHOW_HIDE_PERMANENT_ADDRESS,
  SET_ACTIVE_ADDRESS_BREADCRUMB,
  SET_TOGGLE_STATE_FOR_SAVE_AS_BILLING_ADDRESS,
  HANDLE_CHANGE_DISPLAY_IMAGE_INPUT1,
  HANDLE_CHANGE_FORM_INPUT1,
  TOGGLE_IMAGE_UPLOAD_MODAL1,
  HANDLE_CHANGE_FORM_INPUT2,
  HANDLE_CHANGE_DISPLAY_IMAGE_INPUT2,
  TOGGLE_IMAGE_UPLOAD_MODAL2,
} from "./constants";

import moment from "moment";

//Set the initial form data here
const initialState = {
  formData: {
    address: {
      house_no: "",
      street: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
      city: "",
      country: "",
      longitude: "12.022586",
      latitude: "24.568978",
    },
    permanent_address: {
      house_no: "",
      street: "",
      district: "",
      state: "",
      pincode: "",
      landmark: "",
      city: "",
      country: "",
      longitude: "12.022586",
      latitude: "24.568978",
    },

    service_plan: "",
    plan_name: "",
    upload_speed: "",
    franchise: 11,
    branch: "",
    otp_verification: false,
    alternate_mobile: "",
    alternate_email: "",
    wallet_amount: "120.00",
    session_id: "session-1",
    package_plan: "5",
    account_status: "INS",
    user_type: "IND",
    account_type: "REG",
    expiry_date: "2021-10-28",
    // last_renewal: "",
    last_invoice_id: "---",
    device_id: "---",
    payment: {},
    customer_documents: {
      CAF_form: "CMP",
      identity_proof: "",
      Aadhar_Card_No: null,
      address_proof: "",
      customer_pic: "",
      signature: "",
      pan_card: null,
    },
  },
  customer_images: {
    CAF_form: "CMP",
    identity_proof: "",
    Aadhar_Card_No: "",
    address_proof: "",
    customer_pic: "",
    signature: "",
    pan_card: "",
  },
  showImageUploadModal: false,
  showSignatureUploadToggle: false,
  showImageUploadModal1:false,
  showCustomizer: false,
  selectedPlan: {},
  service: [],
  errors: {},
  zone: [],
  area: [],
  previousDay: null,
  startDate: moment().format("YYYY-MM-DD"),
  saveAsBillingAddress: true,
  showPermanentAddress: false,
  activeAddressBreadCrumb: "billing_address",
  toggleState: "on"
};

const emptyPermanentAddress = {
  house_no: "",
  street: "",
  district: "",
  state: "",
  pincode: "",
  landmark: "",
  city: "",
  country: "",
  longitude: "12.022586",
  latitude: "24.568978",
};
{/*changed pan card keyname by Marieya */}

export default (state = initialState, action) => {
  switch (action.type) {
    case HANDLE_CHANGE_FORM_INPUT: {
      return !Boolean(action.payload.parent)
        ? {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.name]: action.payload.value,
            },
          }
        : {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.parent]: {
                ...state.formData[action.payload.parent],
                [action.payload.name]: action.payload.value,
              },
            },
          };
    }

    case HANDLE_CHANGE_FORM_INPUT1: {
      return !Boolean(action.payload.parent)
        ? {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.name]: action.payload.value,
            },
          }
        : {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.parent]: {
                ...state.formData[action.payload.parent],
                [action.payload.name]: action.payload.value,
              },
            },
          };
    }

    case HANDLE_CHANGE_FORM_INPUT2: {
      return !Boolean(action.payload.parent)
        ? {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.name]: action.payload.value,
            },
          }
        : {
            ...state,
            formData: {
              ...state.formData,
              [action.payload.parent]: {
                ...state.formData[action.payload.parent],
                [action.payload.name]: action.payload.value,
              },
            },
          };
    }
    case TOGGLE_IMAGE_UPLOAD_MODAL: {
      return {
        ...state,
        showImageUploadModal: !state.showImageUploadModal,
      };
    }
    case TOGGLE_IMAGE_UPLOAD_MODAL1: {
      return {
        ...state,
        showImageUploadModal1: !state.showImageUploadModal1,
      };
    }

    case TOGGLE_IMAGE_UPLOAD_MODAL2: {
      return {
        ...state,
        showImageUploadModal2: !state.showImageUploadModal2,
      };
    }
    case TOGGLE_SIGNATURE_UPLOAD_SIDE_BAR: {
      return {
        ...state,
        showSignatureUploadToggle: !state.showSignatureUploadToggle
      }
    }
    case HANDLE_CHANGE_DISPLAY_IMAGE_INPUT: {
      return {
        ...state,
        customer_images: {
          ...state.customer_images,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case HANDLE_CHANGE_DISPLAY_IMAGE_INPUT1: {
      return {
        ...state,
        customer_images: {
          ...state.customer_images,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case HANDLE_CHANGE_DISPLAY_IMAGE_INPUT2: {
      return {
        ...state,
        customer_images: {
          ...state.customer_images,
          [action.payload.name]: action.payload.value,
        },
      };
    }
    case SET_BILLING_ADDRESS_AS_PERMANENT_ADDRESS: {
      return action.payload === "on"
        ? {
            ...state,
            formData: {
              ...state.formData,
              permanent_address: {
                ...state.formData.address,
              },
            },
          }
        : {
            ...state,
            formData: {
              ...state.formData,
              permanent_address: {
                ...emptyPermanentAddress
              },
            },
          };
    }
    case SET_SERVICE: {
      return {
        ...state,
        service: [...action.payload]
      }
    }
    case CLEAR_SERVICE: {
      return {
        ...state,
        service: []
      }
    }
    case OPEN_CUSTOMIZER: {
      return {
        ...state,
        showCustomizer: true
      }
    }
    case CLOSE_CUSTOMIZER: {
      return {
        ...state,
        showCustomizer: false
      }
    }
    case SET_SELECTED_PLAN:{
      const currentSelectedPlan = action.payload;
      return {
        ...state,
        selectedPlan: currentSelectedPlan,
        formData: {
          ...state.formData,
          upload_speed: currentSelectedPlan.upload_speed,
          download_speed: currentSelectedPlan.download_speed,
          data_limit: currentSelectedPlan.fup_limit,
          plan_cost: currentSelectedPlan.plan_cost,
          plan_SGST: currentSelectedPlan.plan_sgst,
          plan_CGST: currentSelectedPlan.plan_cgst,
          time_unit: currentSelectedPlan.time_unit,
          total_plan_cost: currentSelectedPlan.total_plan_cost
        }
      }
    }
    case CLEAR_SELECTED_PLAN:{
      return {
        ...state,
        selectedPlan: {},
        formData:{
          ...state.formData,
          upload_speed: "",
          download_speed: "",
          data_limit: "",
          plan_cost: "",
          plan_SGST: "",
          plan_CGST: "",
          total_plan_cost: ""
        }
      }
    }
    case SET_ERRORS:{
      return {
        ...state,
        errors: {
          ...action.payload
        }
      }
    }
    case SET_FORM_DATA: {
      return {
        ...state,
        formData : {
          ...action.payload
        }
      }
    }
    case SET_ZONE_BY_BRANCH: {
      return {
        ...state,
        zone: action.payload
      }
    }
    case SET_AREA_BY_ZONE: {
      return {
        ...state,
        area: action.payload
      }
    }
    case SET_DUE_DATE: {
      return {
        ...state,
        previousDay: action.payload
      }
    }
    case SET_START_DATE: {
      return {
        ...state,
        startDate: action.payload
      }
    }
    case TOGGLE_SAVE_AS_BUTTON: {
      return {
        ...state,
        saveAsBillingAddress: !state.saveAsBillingAddress
      }
    }
    case SHOW_HIDE_PERMANENT_ADDRESS: {
      return {
        ...state,
        showPermanentAddress: action.payload
      }
    }
    case SET_ACTIVE_ADDRESS_BREADCRUMB: {
      return {
        ...state,
        activeAddressBreadCrumb : action.payload
      }
    }
    case SET_TOGGLE_STATE_FOR_SAVE_AS_BILLING_ADDRESS: {
      return {
        ...state,
        toggleState: action.payload
      }
    }
    default:
      return {
        ...state,
      };
  }
};

import {
  GET_ALL_LEADS_LOADING,
  GET_ALL_LEADS_SUCCESS,
  GET_ALL_LEADS_ERROR,
} from '../actionTypes'

const initial_state = {
  leads: [],
  loading: false,
  success: false,
  error: false,
}

export default (state = initial_state, action) => {
  switch (action.type) {
    case GET_ALL_LEADS_LOADING:
      return {
        ...state,
        loading: true,
        error: false,
        leads: [],
      }

    case GET_ALL_LEADS_SUCCESS:
      return {
        ...state,
        leads: action.payload,
        loading: false,
        success: true,
      }

    case GET_ALL_LEADS_ERROR:
      return {
        ...state,
        error: true,
      }

    default:
      return { ...state }
  }
}

import {
  GET_ALL_LEADS,
  GET_ALL_LEADS_LOADING,
  GET_ALL_LEADS_SUCCESS,
  GET_ALL_LEADS_ERROR,
} from '../actionTypes'

export const getAllLeads = () => ({
  type: GET_ALL_LEADS,
})

export const getAllLeadsLoading = () => ({
  type: GET_ALL_LEADS_LOADING,
})
export const getAllLeadsSuccess = (data) => ({
  type: GET_ALL_LEADS_SUCCESS,
  payload: data,
})

export const getAllLeadsError = (error) => ({
  type: GET_ALL_LEADS_ERROR,
  payload: error.message,
})

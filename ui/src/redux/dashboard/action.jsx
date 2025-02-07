import {
  GET_DASHBOARD_NETWORK_INFO,
  DASHBOARD_NETWORK_INFO_LOADING,
  DASHBOARD_NETWORK_INFO_SUCCESS,
  DASHBOARD_NETWORK_INFO_ERROR,

  GET_DASHBOARD_LEAD_INFO,
  DASHBOARD_LEAD_INFO_LOADING,
  DASHBOARD_LEAD_INFO_SUCCESS,
  DASHBOARD_LEAD_INFO_ERROR,

  GET_DASHBOARD_CUSTOMER_INFO,
  DASHBOARD_CUSTOMER_INFO_LOADING,
  DASHBOARD_CUSTOMER_INFO_SUCCESS,
  DASHBOARD_CUSTOMER_INFO_ERROR,

  GET_DASHBOARD_CUSTOMER_INFO_BY_DATE,
  DASHBOARD_CUSTOMER_INFO_BY_DATE_LOADING,
  DASHBOARD_CUSTOMER_INFO_BY_DATE_SUCCESS,
  DASHBOARD_CUSTOMER_INFO_BY_DATE_ERROR,

  GET_DASHBOARD_TICKET_INFO,
  DASHBOARD_TICKET_INFO_LOADING,
  DASHBOARD_TICKET_INFO_SUCCESS,
  DASHBOARD_TICKET_INFO_ERROR,

  GET_DASHBOARD_PAYMENT_INFO_BY_DATE,
  DASHBOARD_PAYMENT_INFO_LOADING,
  DASHBOARD_PAYMENT_INFO_SUCCESS,
  DASHBOARD_PAYMENT_INFO_ERROR

} from '../actionTypes'

export const getDashboardNetworkInfo = () => ({
  type: GET_DASHBOARD_NETWORK_INFO,
})

export const getDashboardNetworkInfoLoading = () => ({
  type: DASHBOARD_NETWORK_INFO_LOADING,
})
export const getDashboardNetworkInfoSuccess = (data) => ({
  type: DASHBOARD_NETWORK_INFO_SUCCESS,
  payload: data,
})

export const getDashboardNetworkInfoError = (error) => ({
  type: DASHBOARD_NETWORK_INFO_ERROR,
  payload: error.message,
})

//lead actions

export const getDashboardLeadInfo = () => ({
  type: GET_DASHBOARD_LEAD_INFO,
})

export const getDashboardLeadInfoLoading = () => ({
  type: DASHBOARD_LEAD_INFO_LOADING,
})
export const getDashboardLeadInfoSuccess = (data) => ({
  type: DASHBOARD_LEAD_INFO_SUCCESS,
  payload: data,
})

export const getDashboardLeadInfoError = (error) => ({
  type: DASHBOARD_LEAD_INFO_ERROR,
  payload: error.message,
})

//customer info actions

export const getDashboardCustomerInfo = () => ({
  type: GET_DASHBOARD_CUSTOMER_INFO,
})

export const getDashboardCustomerInfoLoading = () => ({
  type: DASHBOARD_CUSTOMER_INFO_LOADING,
})
export const getDashboardCustomerInfoSuccess = (data) => ({
  type: DASHBOARD_CUSTOMER_INFO_SUCCESS,
  payload: data,
})

export const getDashboardCustomerInfoError = (error) => ({
  type: DASHBOARD_CUSTOMER_INFO_ERROR,
  payload: error.message,
})

//customer info by Date actions

export const getDashboardCustomerInfoByDate = (start, end, category) => ({
  type: GET_DASHBOARD_CUSTOMER_INFO_BY_DATE,
  payload: {
    start,
    end,
    category
  }
})

export const getDashboardCustomerInfoByDateLoading = () => ({
  type: DASHBOARD_CUSTOMER_INFO_BY_DATE_LOADING,
})
export const getDashboardCustomerInfoByDateSuccess = (data) => ({
  type: DASHBOARD_CUSTOMER_INFO_BY_DATE_SUCCESS,
  payload: data,
})

export const getDashboardCustomerInfoByDateError = (error) => ({
  type: DASHBOARD_CUSTOMER_INFO_BY_DATE_ERROR,
  payload: error.message,
})

//ticket info actions

export const getDashboardTicketInfo = () => ({
  type: GET_DASHBOARD_TICKET_INFO,
})

export const getDashboardTicketInfoLoading = () => ({
  type: DASHBOARD_TICKET_INFO_LOADING,
})
export const getDashboardTicketInfoSuccess = (data) => ({
  type: DASHBOARD_TICKET_INFO_SUCCESS,
  payload: data,
})

export const getDashboardTicketInfoError = (error) => ({
  type: DASHBOARD_TICKET_INFO_ERROR,
  payload: error.message,
})

//payment info actions

export const getDashboardPaymentInfoByDate = (start, end, category) => ({
  type: GET_DASHBOARD_PAYMENT_INFO_BY_DATE,
  payload: {
    start,
    end,
    category
  }
})

export const getDashboardPaymentInfoLoading = () => ({
  type: DASHBOARD_PAYMENT_INFO_LOADING,
})
export const getDashboardPaymentInfoSuccess = (data) => ({
  type: DASHBOARD_PAYMENT_INFO_SUCCESS,
  payload: data,
})

export const getDashboardPaymentInfoError = (error) => ({
  type: DASHBOARD_PAYMENT_INFO_ERROR,
  payload: error.message,
})
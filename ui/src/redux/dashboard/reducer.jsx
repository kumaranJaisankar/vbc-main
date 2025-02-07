import {
  DASHBOARD_NETWORK_INFO_LOADING,
  DASHBOARD_NETWORK_INFO_SUCCESS,
  DASHBOARD_NETWORK_INFO_ERROR,

  DASHBOARD_LEAD_INFO_LOADING,
  DASHBOARD_LEAD_INFO_SUCCESS,
  DASHBOARD_LEAD_INFO_ERROR,

  DASHBOARD_CUSTOMER_INFO_LOADING,
  DASHBOARD_CUSTOMER_INFO_SUCCESS,
  DASHBOARD_CUSTOMER_INFO_ERROR,

  DASHBOARD_CUSTOMER_INFO_BY_DATE_LOADING,
  DASHBOARD_CUSTOMER_INFO_BY_DATE_SUCCESS,
  DASHBOARD_CUSTOMER_INFO_BY_DATE_ERROR,

  GET_DASHBOARD_TICKET_INFO,
  DASHBOARD_TICKET_INFO_LOADING,
  DASHBOARD_TICKET_INFO_SUCCESS,
  DASHBOARD_TICKET_INFO_ERROR,

  DASHBOARD_PAYMENT_INFO_LOADING,
  DASHBOARD_PAYMENT_INFO_SUCCESS,
  DASHBOARD_PAYMENT_INFO_ERROR

} from '../actionTypes'
import pick from 'lodash/pick';

const initial_state = {
  network: [],
  networkloading: false,
  networksuccess: false,
  networkerror: false,

  lead: [],
  leadloading: false,
  leadsuccess: false,
  leaderror: false,

  customer: [],
  customerloading: false,
  customersuccess: false,
  customererror: false,
  customerStatus:[],
  newCustomer:0,
  customerOnline:[],

  ticket: [],
  ticketloading: false,
  ticketsuccess: false,
  ticketerror: false,

  payment: [],
  paymentloading: false,
  paymentsuccess: false,
  paymenterror: false,
  paymentGrossData: {},
  paymentType: [],
  weeklyTransactions: [],

}

export default (state = initial_state, action) => {
  switch (action.type) {
    case DASHBOARD_NETWORK_INFO_LOADING:
      return {
        ...state,
        networkloading: true,
        networkerror: false,
        network: [],
      }

    case DASHBOARD_NETWORK_INFO_SUCCESS:
      return {
        ...state,
        network: action.payload,
        networkloading: false,
        networksuccess: true,
      }

    case DASHBOARD_NETWORK_INFO_ERROR:
      return {
        ...state,
        networkerror: true,
      }
    case DASHBOARD_LEAD_INFO_LOADING:
      return {
          ...state,
          leadloading: true,
          leaderror: false,
          lead: [],
      }
  
    case DASHBOARD_LEAD_INFO_SUCCESS:
      return {
          ...state,
          lead: action.payload,
          leadloading: false,
          leadsuccess: true,
      }
  
    case DASHBOARD_LEAD_INFO_ERROR:
       return {
          ...state,
          leaderror: true,
      }
    case DASHBOARD_CUSTOMER_INFO_LOADING:
      return {
            ...state,
            customerloading: true,
            customererror: false,
            customer: [],
        }
    
    case DASHBOARD_CUSTOMER_INFO_SUCCESS:
      return {
            ...state,
            customer: action.payload,
            customerloading: false,
            customersuccess: true,
        }
    
    case DASHBOARD_CUSTOMER_INFO_ERROR:
        return {
            ...state,
            customererror: true,
        }
    case DASHBOARD_CUSTOMER_INFO_BY_DATE_SUCCESS:
      const {category, data} = action.payload;
      let customerStatus = state.customerStatus;
      let newCustomer = state.newCustomer;
      let customerOnline = state.customerOnline;
     
      switch(category){
        case 'init':
        customerStatus=data.customers_by_account_status;
        newCustomer= data.new_customers_created;
        //const deactive1 = data.customers_by_account_status.find(s=>s.status ==='dct');
        const arr1 = [{
          status:'online',
          count: data.status_counts && data.status_counts.online
        },
        {
          status:'offline',
          count: data.status_counts && data.status_counts.offline
        },
        {status: 'deactive', count: data.customers_by_account_status['dct']}]
        customerOnline= [...arr1];
        break;
        case 'customerStatus':
          customerStatus= data.customers_by_account_status;
          break;
        case 'customerOnline':
          //const deactive = data.customers_by_account_status.find(s=>s.status ==='dct');
          const arr = [{
            status:'online',
            count: data.status_counts && data.status_counts.online
          },
          {
            status:'offline',
            count: data.status_counts && data.status_counts.offline
          },
          {status: 'deactive', count: data.customers_by_account_status['dct']}]
          customerOnline= [...arr];
          break;
        case 'newCustomer':
          newCustomer= data.new_customers_created;
          break;
      }
        return {
              ...state,
              customerStatus,
              newCustomer,
              customerOnline
          }

      case DASHBOARD_TICKET_INFO_LOADING:
      return {
            ...state,
            ticketloading: true,
            ticketrerror: false,
            ticket: [],
        }
    
    case DASHBOARD_TICKET_INFO_SUCCESS:
      return {
            ...state,
            ticket: action.payload,
            ticketloading: false,
            ticketsuccess: true,
        }
    
    case DASHBOARD_TICKET_INFO_ERROR:
        return {
            ...state,
            ticketrerror: true,
        }
    case DASHBOARD_PAYMENT_INFO_LOADING:
          return {
                ...state,
                paymentloading: true,
                paymentrerror: false,
                payment: [],
            }
        
    case DASHBOARD_PAYMENT_INFO_SUCCESS:
      const {category2, data2} = action.payload;
      let paymentGrossData = state.paymentGrossData;
      let paymentType = state.paymentType;
      let weeklyTransactions = state.weeklyTransactions;

      switch(category2){
        case 'init':
          paymentGrossData = pick(data2, 'sum_of_payment_gross_by_month', 'average_payment_gross_by_month');
          paymentType= data2.payment_made_by_type;
          weeklyTransactions = data2.weekly_transactions;
        case 'paymentGrossData':
          paymentGrossData = pick(data2, 'sum_of_payment_gross_by_month', 'average_payment_gross_by_month');
        break;
        case 'paymentType':
          paymentType= data2.payment_made_by_type;
          break;
        case 'weeklyTransactions':
          weeklyTransactions = data2.weekly_transactions;
          break;
      }
          return {
                ...state,
                payment: {...data2},
                paymentloading: false,
                paymentsuccess: true,
                paymentGrossData: paymentGrossData,
                paymentType: paymentType,
                weeklyTransactions: weeklyTransactions
            }
        
    case DASHBOARD_PAYMENT_INFO_ERROR:
            return {
                ...state,
                paymentrerror: true,
            }
    default:
      return { ...state }
  }
}

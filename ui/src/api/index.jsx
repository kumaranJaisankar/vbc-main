// import axios from "axios";
import axios from "../axios";
import { networkaxios, customeraxios, helpdeskaxios, billingaxios } from '../axios';

export const fetchProductApi = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/product.json`);
};

export const fetchChatApi1 = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/chatMember.json`);
};

export const fetchChatApi2 = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/chat.chats.json`);
};

export const fetchEmailApi = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/email.json`);
};

export const fetchBookmaekApi = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/bookmark.json`);
};

export const fetchTodoApi = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/todo.json`);
};

export const fetchTaskApi = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/task.json`);
};

export const fetchProjectApi = () => {
    return axios.get(`${process.env.PUBLIC_URL}/api/project.json`);
};

export const fetchAllLeads = () => {
    return axios.get(`radius/lead/display`)
  }
  
  export const getDashboardNetwork = () => {
    // return networkaxios.get(`network/dashboard`)
  }

   
  export const getDashboardLead = () => {
    // return axios.get(`radius/lead/dashboard`);
  }

  export const getDashboardCustomer = () => {
    // return customeraxios.get(`customers/analytics`);
  }
  export const getDashboardCustomerByDate = (startDate, endDate) => {
    // return customeraxios.get(`customers/analytics/date?`, {
        // params: {
        //     start_date: startDate,
        //     end_date: endDate
        // }
      // });
  }

  export const getDashboardTicket = () => {
    // return helpdeskaxios.get(`analytics`);
  }
  
  export const getDashboardPaymentByDate = (startDate, endDate) => {
    // return billingaxios.get(`payment/analytics/date?`, {
    //     params: {
    //         start_date: startDate,
    //         end_date: endDate
    //     }
    //   });
    }
import React, { useState, useEffect, useMemo } from "react";
import { connect } from "react-redux";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import {
  getDashboardNetworkInfo,
  getDashboardLeadInfo,
  getDashboardCustomerInfo,
  getDashboardCustomerInfoByDate,
  getDashboardPaymentInfoByDate,
  getDashboardTicketInfo,
} from "../../../redux/dashboard/action";
import CardList, { Showcards } from "./Cards/CardList";
import NetworkDashboard from "./Network";
import LeadDashboard from "./Lead";
import CustomerDashboard from "./Customer";
import TicketDashboard from "./Ticket";
import PaymentDashboard from "./Payment";
import { DASHBOARD } from "../../../utils/permissions";
var storageToken = localStorage.getItem("token");
if (storageToken !== null) {
  var token = JSON.parse(storageToken);
}
const Dashboard = (props) => {
  const permissions = JSON.parse(localStorage.getItem("token")).permissions;
  const dashboardPermissions = useMemo(
    () =>
      Object.keys(DASHBOARD).reduce((initialValue, currentValue) => {
        if (!initialValue[currentValue]) {
          initialValue[currentValue] = permissions?.includes(
            DASHBOARD[currentValue]
          );
          return initialValue;
        }
        return initialValue;
      }, {}),
    [permissions]
  );
  const [selectedTab, setSelectedTab] = useState(1);
  const [cardList, setCardList] = useState([]);
  const [network, setNetwork] = useState({});
  const [lead, setLead] = useState({});
  const [customer, setCustomer] = useState({});
  const [ticket, setTicket] = useState({});
  const [payment, setPayment] = useState({});
  const [defautDatePickerValue, setDefautDatePickerValue] = useState([
    moment().subtract(30, "days"),
    moment(),
  ]);
  const [leadCountByMonth, setLeadCountByMonth] = useState(0);

  useEffect(() => {
    const startDate = moment().subtract(60, "days");
    const endDate = moment();
    setDefautDatePickerValue([startDate, endDate]);
    props.getCustomerInfo();
    props.getNetworkInfo();
    props.getLeadInfo();
    props.getTicketInfo();
    props.getCustomerInfoBydate(
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD"),
      "init"
    );
    // props.getCustomerInfoBydate(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), 'newCustomer');
    props.getPaymentInfoBydate(
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD"),
      "init"
    );
  }, []);

  useEffect(() => {
    if (props.network) {
      setNetwork(props.network[0]);
    }
  }, [props.network]);

  useEffect(() => {
    if (!isEmpty(props.lead)) {
      setLead(props.lead);
    }
  }, [props.lead]);

  useEffect(() => {
    if (!isEmpty(props.customer)) {
      setCustomer(props.customer);
    }
  }, [props.customer]);
  useEffect(() => {
    if (!isEmpty(props.ticket)) {
      setTicket(props.ticket);
    }
  }, [props.ticket]);
  useEffect(() => {
    if (!isEmpty(props.payment)) {
      setPayment(props.payment);
    }
  }, [props.payment]);
  useEffect(() => {
    if (token.permissions.includes(DASHBOARD.NETWORK)) {
      if (!isEmpty(network)) {
        let totalNetworkDevices = 0;
        for (let key1 in network.device_count) {
          for (let key2 in network.device_count[key1]) {
            totalNetworkDevices =
              totalNetworkDevices + network.device_count[key1][key2];
          }
        }
        const info = {
          id: 3,
          title: "Network devices",
          totalCount: totalNetworkDevices,
          suffix: "",
          classType: "network",
          selected: selectedTab === 3,
          onClickHandler: () => setSelectedTab(3),
        };
        updateCardList(info);
      }
    }
  }, [network, selectedTab]);

  useEffect(() => {
    if (token.permissions.includes(DASHBOARD.LEAD)) {
      if (!isEmpty(lead)) {
        const info = {
          id: 2,
          title: "Total leads",
          totalCount: lead.total_lead_count,
          suffix: "",
          classType: "lead",
          selected: selectedTab === 2,
          onClickHandler: () => setSelectedTab(2),
        };
        updateCardList(info);
      }
    }
  }, [lead, selectedTab, leadCountByMonth]);

  useEffect(() => {
    if (token.permissions.includes(DASHBOARD.CUSTOMER)) {
      if (!isEmpty(customer)) {
        const info = {
          id: 1,
          title: "Total customers",
          totalCount: customer.total_no_of_customers,
          suffix: "",
          classType: "customer",
          selected: selectedTab === 1,
          onClickHandler: () => setSelectedTab(1),
        };
        updateCardList(info);
      }
    }
  }, [customer, selectedTab]);
  useEffect(() => {
    if (token.permissions.includes(DASHBOARD.TICKET)) {
      if (!isEmpty(ticket)) {
        const info = {
          id: 4,
          title: "Total no. of tickets",
          totalCount: ticket.total_no_of_tickets,
          suffix: "",
          classType: "ticket",
          selected: selectedTab === 4,
          onClickHandler: () => setSelectedTab(4),
        };
        updateCardList(info);
      }
    }
  }, [ticket, selectedTab]);

  useEffect(() => {
    if (token.permissions.includes(DASHBOARD.PAYMENT)) {
      if (!isEmpty(payment)) {
        const info = {
          id: 5,
          title: "Payment gross",
          totalCount: payment.total_payment_gross,
          suffix: "",
          classType: "payment",
          selected: selectedTab === 5,
          onClickHandler: () => setSelectedTab(5),
        };
        updateCardList(info);
      }
    }
  }, [payment, selectedTab]);

  let listNew = [];
  const updateCardList = (info) => {
    if (!isEmpty(info)) {
      const card = {
        id: info.id,
        title: info.title,
        totalCount: info.totalCount,
        suffix: info.suffix,
        classType: info.classType,
        selected: info.selected,
        onClickHandler: () => setSelectedTab(info.id),
      };
      // let cardListNew = [...listNew];
      // cardListNew[info.id] = { ...card };
      // listNew=cardListNew;
      // if(cardListNew.length===5)
      setCardList((prevState) => {
        return {
          ...prevState,
          [info.id]: card,
        };
      });
    }
  };

  return (
    <div className="dashboard">
      <div>
        <CardList list={orderBy(cardList, ["id"], ["asc"])} />
        {selectedTab === 3 && (
          <>
            {network && dashboardPermissions.NETWORK ? (
              <NetworkDashboard networkInfo={network} />
            ) : (
              <span>Loading...</span>
            )}
          </>
        )}
        {selectedTab === 2 && (
          <>
            {lead && dashboardPermissions.LEAD ? (
              <LeadDashboard
                leadInfo={lead}
                setLeadCountByMonth={setLeadCountByMonth}
              />
            ) : (
              <span>Loading...</span>
            )}
          </>
        )}
        {selectedTab === 1 && (
          <>
            {customer && dashboardPermissions.CUSTOMER ? (
              customer && customer.detail == "EMPTY_DASHBOARD" ? (
                <h3 style={{ textAlign: "center", marginTop: "20px" }}>
                  <span>No customer data available</span>
                </h3>
              ) : (
                <CustomerDashboard
                  customerInfo={customer}
                  getCustomerInfoBydate={props.getCustomerInfoBydate}
                  defautDatePickerValue={defautDatePickerValue}
                />
              )
            ) : (
              // <span>Loading...</span
              ""
            )}
          </>
        )}
        {selectedTab === 4 && (
          <>
            {ticket && dashboardPermissions.TICKET ? (
              <TicketDashboard ticketInfo={ticket} />
            ) : (
              <span>Loading...</span>
            )}
          </>
        )}
        {selectedTab === 5 && (
          <>
            {payment && dashboardPermissions.PAYMENT ? (
              <PaymentDashboard
                paymentInfo={payment}
                getPaymentInfoBydate={props.getPaymentInfoBydate}
                defautDatePickerValue={defautDatePickerValue}
              />
            ) : (
              <span>Loading...</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const customer = {
    ...state.dashboard.customer,
    new_customers_created: state.dashboard.newCustomer,
    customerOnline: state.dashboard.customerOnline,
    customerStatus: state.dashboard.customerStatus,
  };
  const paayment = {
    ...state.dashboard.payment,
    paymentGrossData: state.dashboard.paymentGrossData,
    paymentType: state.dashboard.paymentType,
    weeklyTransactions: state.dashboard.weeklyTransactions,
  };
  return {
    network: state.dashboard.network,
    loading: state.dashboard.networkloading,
    success: state.dashboard.networksuccess,
    error: state.Leads.networkerror,
    lead: state.dashboard.lead,
    customer: {
      ...customer,
    },

    ticket: state.dashboard.ticket,
    payment: {
      ...paayment,
    },
  };
};

const mapDispatchToProps = {
  getNetworkInfo: getDashboardNetworkInfo,
  getLeadInfo: getDashboardLeadInfo,
  getCustomerInfo: getDashboardCustomerInfo,
  getCustomerInfoBydate: (start, end, type) =>
    getDashboardCustomerInfoByDate(start, end, type),
  getTicketInfo: getDashboardTicketInfo,
  getPaymentInfoBydate: (start, end, type) =>
    getDashboardPaymentInfoByDate(start, end, type),
};

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

export default DashboardContainer;

import React,{useEffect} from 'react';

import { connect } from 'react-redux'
import { getAllLeadsLoading } from '../../../redux/leads/action'
import All from './all';

const Leads = (props)=>{
    useEffect(() => {   
        if (props.leads.length === 0) {
          props.getAllLeads()
        }
      }, [])
    return(
        <>
        <All allLeads={props.leads} loading={props.loading} getAllLeads={props.getAllLeads}/>
        </>
    )
}


const mapStateToProps = (state) => { 
    return {
      leads: state.Leads.leads,
      loading: state.Leads.loading,
      error:state.Leads.error,
    }
  }
  
  const mapDispatchToProps = {
    getAllLeads: getAllLeadsLoading,
  }
  const LeadsContainer = connect(mapStateToProps, mapDispatchToProps)(Leads)
  export default LeadsContainer
  
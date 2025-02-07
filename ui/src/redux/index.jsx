import {combineReducers} from 'redux'
import Todoapp from './todo/reducer'
import Ecommerce from './ecommerce/product/reducer'
import Filters from './ecommerce/filter/reducer'
import Wishlist from './ecommerce/wishlist/reducer'
import Cart from './ecommerce/cart/reducer'
import ChatApp from './chap-app/reducer'
import EmailApp from './email/reducer'
import Customizer from './customizer/reducer'
import Bookmarkapp from './bookmark/reducer'
import Taskapp from './task-app/reducer'
import Projectapp from './project-app/reducer'
import Leads from './leads/reducer'
import kycFormReducer from './kyc-form/reducer';
import InternalTicketsModuleReducer from "./internal-tickets/reducer";
import dashboard from './dashboard/reducer';
const reducers = combineReducers({
    Todoapp,
    data:Ecommerce,
    filters:Filters,
    Wishlistdata:Wishlist,
    Cartdata:Cart,
    ChatApp,
    EmailApp,
    Customizer,
    Bookmarkapp,
    Taskapp,
    Projectapp,
    Leads,
    KYCForm: kycFormReducer,
    InternalTickets: InternalTicketsModuleReducer,
    dashboard
});

export default reducers;
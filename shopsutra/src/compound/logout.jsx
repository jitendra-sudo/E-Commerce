import { toast } from 'react-toastify';
import Api from './Api'; 
import { logout } from "../ContextApi/AuthSlice"; 

const Logout = (dispatch) => {
  localStorage.removeItem("token");
  delete Api.defaults.headers.common["Authorization"];
  dispatch(logout());
};

export default Logout;

import logo from './logo.svg';
import './App.css';
import Router from './component/Router.jsx'
import api from './component/Api.js'
import { useContext, useEffect } from 'react';
import { GlobalContext } from './Caontext/Context.js'

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const getUserData = async () => {
      try {
        let res = await api.get('/profile');
        dispatch({ type: "USER_LOGIN", user: res.data?.user })

      } catch (error) {
        dispatch({ type: "USER_LOGOUT" })
      }
    }
    getUserData();
  }, [])
  return (
    <Router />
  );
}

export default App;

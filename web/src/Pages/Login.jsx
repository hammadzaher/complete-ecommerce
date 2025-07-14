import { useContext, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../Caontext/Context';
import api from '../component/Api'


function App() {

    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');

    // const { state, dispatch } = useContext(GlobalContext)

    // const navigate = useNavigate();

    // const loginUser = async (e) => {
    //     e.preventDefault();
    //     try {
    //         let respone = await axios.post('http://localhost:3001/login', {
    //             email: email,
    //             password: password
    //         })
    //         console.log(respone.data);
    //         alert(respone.data.message);
    //         dispatch({ type: "USER_LOGIN", user: respone.data.user })
    //         setTimeout(() => {
    //             navigate("/home")
    //         }, 1000)

    //     } catch (error) {
    //         console.log("error", error);
    //         alert(error.response.data.message)
    //     }

    // }

    let { state, dispatch } = useContext(GlobalContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate()

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            let res = await api.post(`/login`, {
                email: email,
                password: password
            })
            console.log(res.data);
            alert(res.data.message);
            dispatch({ type: "USER_LOGIN", user: res.data.user })
            setTimeout(() => {
                navigate('/home')
            }, 1000)

        } catch (error) {
            console.log("Error", error);
            alert(error.response.data.message)
        }

    }



    return (
        <>
            <form onSubmit={loginUser}>
                <label>
                    Email:
                    <input type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                </label>
                <br />
                <label>
                    Password
                    <input type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </label>
                <br />
                <button>Login</button>
            </form>
            <button><Link to={"/signUp"}>Sign_Up</Link></button>
        </>
    )
}

export default App

import { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../Caontext/Context';

function App() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { state } = useContext(GlobalContext)

    const navigate = useNavigate();

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${state.baseUrl}/sign_up`, {
                first_name: firstName,
                last_name: lastName,
                email,
                password
            });

            console.log(response.data);
            alert(response.data.message);
            navigate('/login');
        } catch (error) {
            console.log("error", error);
            alert(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <>
            <form onSubmit={registerUser} className="p-4 max-w-md mx-auto">
                <label>
                    First Name:
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="border p-2 m-2 w-full"
                    />
                </label>
                <br />
                <label>
                    Last Name:
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="border p-2 m-2 w-full"
                    />
                </label>
                <br />
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 m-2 w-full"
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 m-2 w-full"
                    />
                </label>
                <br />
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
            </form>
            <button><Link to={'/login'}>Login</Link></button>
        </>
    );
}

export default App;

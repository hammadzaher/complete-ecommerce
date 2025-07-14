
import { Routes, Route, Navigate } from 'react-router-dom';
import Sign_up from '../Pages/Sign_up.jsx';
import Login from '../Pages/Login.jsx';
import Category from '../Pages/Category.jsx';
import AddProducts from '../Pages/Add-product.jsx';
import Home from '../Pages/Home.jsx';
import { useContext } from 'react';
import { GlobalContext } from '../Caontext/Context.js';

function App() {
    let { state, dispatch } = useContext(GlobalContext)
    return (
        <div>
            <Routes>
                {state.isLogin === true ? (
                    <>
                        <Route path="/categorys" element={<Category />} />
                        <Route path="/add-product" element={<AddProducts />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="*" element={<Navigate to="/home" />} />
                    </>
                ) : (
                    <>
                        <Route path="/signUp" element={<Sign_up />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                )}
            </Routes>
        </div>
    );
}

export default App;

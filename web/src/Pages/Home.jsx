import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { GlobalContext } from '../Caontext/Context';
import { Link } from 'react-router-dom';
import api from '../component/Api'

const Home = () => {
    const [products, setProducts] = useState([]);

    // let { state, dispatch } = useContext(GlobalContext)

    // console.log(state);

    // useEffect(() => {
    //     const getProducts = async () => {
    //         let res = await axios.get('http://localhost:3001/products')
    //         console.log('RES', res.data);
    //         setProducts(res.data.products)
    //     }
    //     getProducts();
    // }, [])

    let { state } = useContext(GlobalContext)
    useEffect(() => {
        const getProduct = async () => {
            try {
                let res = await api.get(`/products`, {
                    withCredentials: true
                });
                console.log("res", res.data)
                setProducts(res.data.products)

            } catch (error) {
                console.log("Error", error)
            }
        }
        getProduct()
    }, [])
    return (
        <>
            {
                (state.user.user_role == 1) ?
                    <div><Link to={'/add-product'}>Add Product</Link></div>
                    :
                    null
            }
            {products.map((eachProduct, i) => {
                return (
                    <div>
                        <img src={eachProduct.product_image} alt="" />
                        <h1>{eachProduct.product_name}</h1>
                        <p>{eachProduct.price}</p>
                        <h6>{eachProduct.category_name}</h6>
                    </div>

                )
            })}
        </>
    )
}

export default Home
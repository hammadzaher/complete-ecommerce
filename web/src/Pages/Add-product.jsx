import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import GlobalContext from '../Caontext/Context.js'

const AddProducts = () => {
    const [categoryList, setCategoryList] = useState([]);


    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState('');

    const { state } = useContext(GlobalContext)



    const getCategory = async () => {
        try {
            let res = await axios.get('http://localhost:3001/category');
            setCategoryList(res.data.products)
            console.log(res.data.products);

        } catch (error) {
            console.log("Get Category Errir", error);
        }
    }
    useEffect(() => {
        getCategory();
    }, [])

    const addProduct = async (e) => {
        e.preventDefault();
        try {
            let respnse = await axios.post(`${state.baseUrl}/products`, {
                name: productName,
                price: productPrice,
                description: productDescription,
                image: productImage,
                category_id: productCategory
            });
            console.log("Response", respnse);
            alert("product Added")

        } catch (error) {
            console.log("Add Products Error", error);
        }
    }
    return (
        <form onSubmit={addProduct}>
            <select value={productCategory} onChange={(e) => { setProductCategory(e.target.value) }}>
                <option disabled>Select Category</option>
                {categoryList.map((eachCategory, i) => (
                    <option value={eachCategory.catergory_id}>{eachCategory.category_name}</option>
                ))}
            </select>
            <br />
            <label>
                Name:
                <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                />
            </label>

            <br />

            <label>
                Price:
                <input
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    required
                />
            </label>

            <br />

            <label>
                Image URL:
                <input
                    type="text"
                    value={productImage}
                    onChange={(e) => setProductImage(e.target.value)}
                    required
                />
            </label>

            <br />

            <label>
                Description:
                <textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    required
                />
            </label>

            <br />

            <button type="submit">Add Product</button>
        </form>
    )
}

export default AddProducts
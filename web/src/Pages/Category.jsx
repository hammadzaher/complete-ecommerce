import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { GlobalContext } from '../Caontext/Context';



const Category = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [show, setShow] = useState(false);

    const { state } = useContext(GlobalContext)


    const getCategory = async () => {
        try {
            let res = await axios.get('http://localhost:3001/category');
            setCategoryList(res.data.products)
            console.log(res.data.products);

        } catch (error) {
            console.log("Get Category Error", error);
        }
    }
    useEffect(() => {
        getCategory();
    }, [])

    const addCategory = async (e) => {
        e.preventDefault();
        try {
            let res = await axios.post(`${state.baseUrl}/catgories`, {
                name: categoryName,
                description: categoryDescription
            });
            console.log("Add Category Response", res);
            alert("Category Added")
            claerForm()
        } catch (error) {
            console.log("Add Category Error", error);
        }

    }


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const claerForm = () => {
        setCategoryDescription("");
        setCategoryName("")
    }
    return (

        <>
            <Button variant="primary" onClick={handleShow}>
                Add Category
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <form onSubmit={addCategory}>

                    <label>
                        Name:
                        <input type="text" placeholder='Enter your name' value={categoryName} onChange={(e) => { setCategoryName(e.target.value) }} />
                    </label>
                    <br />
                    <label>
                        Desription:
                        <textarea placeholder='Enter your description' value={categoryDescription} onChange={(e) => { setCategoryDescription(e.target.value) }}></textarea>
                    </label>
                    <br />
                </form>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={addCategory}>
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className='category'>
                <table>
                    <thead>
                        <tr>
                            <th>Category_id</th>
                            <th>Category_Name</th>
                            <th>description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryList.map((eachCategory, i) => {
                            return (
                                <tr>
                                    <td>{eachCategory.catergory_id}</td>
                                    <td>{eachCategory.category_name}</td>
                                    <td>{eachCategory.description}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Category
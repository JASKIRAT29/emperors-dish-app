import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
    CREATE_MENU_ITEM,
    DELETE_MENU_ITEM,
    UPDATE_MENU_ITEM,
} from "../utils/mutations";
import { GET_MENU_ITEMS } from "../utils/queries";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Auth from '../utils/auth';
import UploadWidget from "../components/uploadWidget";
//import { button } from 'react-bootstrap';

const Admin = () => {
    //vars for create
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [createMenuItem, { error }] = useMutation(CREATE_MENU_ITEM);

    //vars for delete
    const [selectedItem, setSelectedItem] = useState("");
    const { loading, data } = useQuery(GET_MENU_ITEMS);
    const [deleteMenuItem] = useMutation(DELETE_MENU_ITEM, {
        refetchQueries: [{ query: GET_MENU_ITEMS }],
    });

    // vars for update
    const [selectedItemId, setSelectedItemId] = useState("");
    const [updateName, setUpdateName] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [updatePrice, setUpdatePrice] = useState(0);
    const [updateImage, setUpdateImage] = useState("");
    const [updateMenuItem, { error: updateError }] = useMutation(
        UPDATE_MENU_ITEM,
        {
            refetchQueries: [{ query: GET_MENU_ITEMS }],
        }
    );

  const token = Auth.loggedIn() ? Auth.getToken() : null;

  if (!token) {
    window.location.assign('/Login');
    return false;
  }
   

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    try {
      
        await createMenuItem({
            variables: { 
              name: name,
              description: description,
              price: price,
              image: image,
            }
          });
      setName('');
      setDescription('');
      setPrice(0);
      setImage('');
      alert("Item sucessfully added to menu.");
    } catch (e) {
      console.error(e.message);
    }
  };
  
  //do if delete button
  const handleDelete = () => {
    deleteMenuItem({
        variables: { _id: selectedItem },
        onCompleted: () => {
            alert("Item successfully deleted.");
          },
    });
    setSelectedItem("");
  };

    //do if selection list of update button
    const handleMenuItemChange = (event) => {
        const itemId = event.target.value;
        setSelectedItemId(itemId);
        const selectedItem = data.menuItems.find((item) => item._id === itemId);
        setUpdateName(selectedItem.name);
        setUpdateDescription(selectedItem.description);
        setUpdatePrice(selectedItem.price);
        setUpdateImage(selectedItem.image);
    };

    //do if update button

    const handleUpdateMenuItem = async () => {
        try {
            await updateMenuItem({
                variables: {
                    _id: selectedItemId,
                    name: updateName,
                    description: updateDescription,
                    price: parseFloat(updatePrice),
                    image: updateImage,
                },
            });
            setSelectedItemId("");
            setUpdateName("");
            setUpdateDescription("");
            setUpdatePrice(0);
            setUpdateImage("");
            alert("Item successfully updated.")
        } catch (error) {
            console.error(error);
        }
    };

    //wait on db before rendering page
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error! </p>;

    //render page
    //create div
    //delete div
    //update div
    return (
        <div className="admin-container">
          <button onClick={Auth.logout}>Logout</button>
            <section className="add-menu-item">
                <h2>Add item to menu:</h2>
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <TextField
                            sx={{ margin: 1 }}
                            size={"small"}
                            type={"text"}
                            id="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <TextField
                            sx={{ margin: 1 }}
                            size={"small"}
                            type={"text"}
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="price">Price:</label>
                        <TextField
                            sx={{ margin: 1 }}
                            type={"number"}
                            size={"small"}
                            id="price"
                            value={price}
                            onChange={(event) =>
                                setPrice(parseFloat(event.target.value))
                            }
                        />
                    </div>
                    <div>
                        <label htmlFor="image">Image URL:</label>
                        <TextField
                            sx={{ margin: 1 }}
                            size={"small"}
                            type={"text"}
                            id="image"
                            value={image}
                            onChange={(event) => setImage(event.target.value)}
                        />
                    </div>
                    <UploadWidget />
                    <Button type={"submit"} variant="outlined">
                        Add Item
                    </Button>
                </form>
                {error && <div>Error adding menu item.</div>}
            </section>
            <br />
            <div>
                <h2>Delete menu item:</h2>
                <div>
                    <select
                        value={selectedItem}
                        onChange={(e) => setSelectedItem(e.target.value)}
                    >
                        <option value="">Select item to delete</option>
                        {data.menuItems.map((item) => (
                            <option key={item._id} value={item._id}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Button
                    sx={{ margin: 1 }}
                    variant="outlined"
                    onClick={handleDelete}
                    disabled={!selectedItem}
                >
                    Delete
                </Button>
            </div>
            <br />
            <div>
                <h2>Update menu item:</h2>
                <label className="menu-label">
                    Select a menu item to update:
                    <select
                        value={selectedItemId}
                        onChange={handleMenuItemChange}
                    >
                        <option value="">--Select--</option>
                        {data.menuItems.map((menuItem) => (
                            <option key={menuItem._id} value={menuItem._id}>
                                {menuItem.name}
                            </option>
                        ))}
                    </select>
                </label>
                <br />
                <label>
                    Name:
                    <TextField
                        sx={{ margin: 1 }}
                        size={"small"}
                        type={"text"}
                        id="name"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Description:
                    <TextField
                        sx={{ margin: 1 }}
                        size={"small"}
                        type="text"
                        id="description"
                        value={updateDescription}
                        onChange={(e) => setUpdateDescription(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Price:
                    <TextField
                        sx={{ margin: 1 }}
                        size="small"
                        type={"number"}
                        id="price"
                        value={updatePrice}
                        onChange={(e) => setUpdatePrice(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Image URL:
                    <TextField
                        sx={{ margin: 1 }}
                        size={"small"}
                        type={"text"}
                        id="image"
                        value={updateImage}
                        onChange={(e) => setUpdateImage(e.target.value)}
                    />
                </label>
                <br />
                <Button variant="outlined" onClick={handleUpdateMenuItem}>
                    Update
                </Button>
            </div>
        </div>
    );
};

export default Admin;

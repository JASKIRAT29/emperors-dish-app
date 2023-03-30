import React from "react";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";

const Reviews = () => {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(name, message);
        setMessage("");
        setName("");
    };
    return (
        <div className="review">
            <h3>Please Review our food</h3>
            <form onSubmit={handleSubmit} className="review-form">
                <TextField
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type={"text"}
                    placeholder="Name"
                    sx={{ margin: 3 }}
                />
                <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    type={"text"}
                    multiline
                    rows={5}
                    placeholder="Review message"
                    sx={{ margin: 3 }}
                />
                <Button type="submit" variant="contained">
                    submit
                </Button>
            </form>
        </div>
    );
};

export default Reviews;
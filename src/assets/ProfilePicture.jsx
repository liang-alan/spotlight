import React, { useState, useEffect } from "react";
import { Container, Form, Button, Image, ProgressBar, Alert } from "react-bootstrap";
import './styles.css';



export default function ProfilePicture(props) {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState(props.url);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUrl(URL.createObjectURL(selectedFile));
            props.onFileSelect(selectedFile);
        }
        // update users profile picture


    };

    return (
    <Container>
        <Image
            src={url}
            alt="Profile Picture"
            className="profile-picture"
        />
        <Form.Group controlId="formFile">
            <Form.Label>Update Picture</Form.Label>
            <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
        </Form.Group>
        {props.uploading && (
            <ProgressBar now={props.progress} label={`${props.progress}%`} />
        )}
        {props.error && (
            <Alert variant="danger">
                {props.error}
            </Alert>
        )}
        </Container>
    );
}
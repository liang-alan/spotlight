import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Image, Row, Col } from 'react-bootstrap';
import { getBytes } from 'firebase/storage';
import './styles.css';

export default function UploadMedia(props) {
    const [file, setFile] = useState(null);

    const [preview, setPreview] = useState(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile)); // For previewing the image
            props.onFileSelect(selectedFile, props.index); // Notify parent with selected file
        }
    };

    useEffect(() => {
        if (props.url) {
            setPreview(props.url);
        }
    }, [props.url]);




    return (
        <Container>
            <Container className="d-flex justify-content-center align-items-center">
                <Form.Group controlId="formFile">
                    <Form.Label>Select Media</Form.Label>
                    <Form.Control
                        type="file"
                        accept={props.type ? `${props.type}/*` : '*/*'}
                        onChange={handleFileChange}
                    />
                </Form.Group>
            </Container>

            <Container>
                {preview && (
                    <div className="mt-3">
                        <h5>Preview:</h5>
                        <div className="media-container">
                            {props.type=="image" && (    
                                <Image src={preview} alt="Preview" className="image-preview" />
                            )}
                            {props.type == "audio" && (
                                <audio src={preview} controls className="audio-preview" />
                            )}
                        </div>

                    </div>
                )}
            </Container>
        </Container>
                
    );
}

import UserCard from "../assets/UserCard";

import { useState, useEffect } from "react";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";


import { collection, getDocs, query, orderBy, where, limit, startAfter, and, or } from "firebase/firestore";

import { db, auth } from '../navigation/firebase-config';

import LoadingIcon from "../assets/LoadingIcon";

import { motion } from 'framer-motion';
import { Form, Row, Col } from "react-bootstrap";
import '../assets/styles.css';



export default function FindArtists() {
    const [isLoading, setIsLoading] = useState(true);
    const [lastDoc, setLastDoc] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [searchParam, setSearchParam] = useState('');
    const [users, setUsers] = useState([]);

    const fetchUsers = async (next = false) => {

        try {
            const userCollectionRef = collection(db, 'users');
            let userQuery;
            if (searchParam) {
                setIsLoading(true);

                if (next && lastDoc) {
                    userQuery = query(
                        userCollectionRef,
                        or(
                            and(where('displayName_lowercase', '>=', searchParam),
                                where('displayName_lowercase', '<=', searchParam + '\uf8ff')),
                            and(where('bio_lowercase', '>=', searchParam),
                                where('bio_lowercase', '<=', searchParam + '\uf8ff')),
                            where('tags', 'array-contains', searchParam)

                        ),
                        limit(10),
                        orderBy('displayName_lowercase'),   
                        startAfter(lastDoc)
                    );
                } else {
                    userQuery = query(
                        userCollectionRef,
                        or(
                            and(where('displayName_lowercase', '>=', searchParam),
                                where('displayName_lowercase', '<=', searchParam + '\uf8ff')),
                            and(where('bio_lowercase', '>=', searchParam),
                                where('bio_lowercase', '<=', searchParam + '\uf8ff')),
                            where('tags', 'array-contains', searchParam)

                        ),
                        limit(10),
                        orderBy('displayName_lowercase')  
                    );
                }
            } else {
                if (next && lastDoc) {
                    userQuery = query(
                        userCollectionRef,
                        limit(10),
                        orderBy('displayName_lowercase'),   
                        startAfter(lastDoc)
                    );
                } else {
                    userQuery = query(
                        userCollectionRef,
                        limit(10),
                        orderBy('displayName_lowercase'),   
                    );
                }
            }

            const userQuerySnapshot = await getDocs(userQuery);
            const userDocs = userQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            
            if (userDocs.length < 10) {
                setHasMore(false);
            }

            setUsers(prevUsers => next ? [...prevUsers, ...userDocs] : userDocs);
            setLastDoc(userQuerySnapshot.docs[userQuerySnapshot.docs.length - 1]);
            setIsLoading(false);


        } catch (error) {
            console.error('Error fetching users: ', error);
            setIsLoading(false);

        }

    };


    const loadMore = () => {
        fetchUsers(true);
    };


    const submitQuery = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    useEffect(() => {
        fetchUsers();
    }, []);


    if (isLoading) {
        return <LoadingIcon />;
    }


    return <motion.div
        initial={{ opacity: 0, y: 200 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
    >
        <h1>Find Artists</h1>
        <Form onSubmit={submitQuery}>
            <Form.Group as={Row} className="mb-3" controlId="query">
                <Col className="mb-3 d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search"
                        value={searchParam}
                        onChange={(e) => setSearchParam(e.target.value.trim().toLowerCase())

                        } />
                    <Button variant="primary" type="submit">
                        Search
                    </Button>
                </Col>

            </Form.Group>
        </Form>
        <Row>
            {users.map(user => {
                return <UserCard key={user.id} {...user} uid={user.id} />;
                }
            )}
        </Row>
        {hasMore && <Button onClick={loadMore}>Load More</Button>}
    </motion.div>
}
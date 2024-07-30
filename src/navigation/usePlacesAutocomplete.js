import { useEffect, useRef } from 'react';
import {loader} from './firebase-config';

const usePlacesAutocomplete = (callback) => {
    const inputRef = useRef(null);

    useEffect(() => {
        loader.load().then(() => {
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode'],
            });

            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (callback) {
                    callback(place);
                }
            });
        });
    }, [callback]);

    return inputRef;
};

export default usePlacesAutocomplete;
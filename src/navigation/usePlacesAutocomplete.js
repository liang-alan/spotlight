import { useEffect, useRef } from 'react';
import { loader } from './firebase-config';

const usePlacesAutocomplete = (callback) => {
    const inputRef = useRef(null);

    useEffect(() => {
        loader.load().then(() => {
            console.log('Google Maps API loaded');
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                types: ['geocode'],
            });
            
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                console.log('Place selected:', place);
                if (callback) {
                    callback(place);
                }
            });
        }).catch(e => {
            console.error('Error loading Google Maps API:', e);
        });
    }, [callback]);

    return inputRef;
};

export default usePlacesAutocomplete;
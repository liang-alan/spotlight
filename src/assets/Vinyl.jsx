import './styles.css';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

import { FaPlay, FaPause } from "react-icons/fa";


export default function Vinyl(props) {

    const [audio, setAudio] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const audioElement = new Audio(props.track);
        setAudio(audioElement);

        audioElement.addEventListener('play', () => setIsPlaying(true));
        audioElement.addEventListener('pause', () => setIsPlaying(false));
        audioElement.addEventListener('ended', () => setIsPlaying(false));

        return () => {
            audioElement.pause();
            audioElement.removeEventListener('play', () => setIsPlaying(true));
            audioElement.removeEventListener('pause', () => setIsPlaying(false));
            audioElement.removeEventListener('ended', () => setIsPlaying(false));
            audioElement.remove();
        };
    }, [props.track]);

    const handleClick = () => {
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    return (
        <div className="vinyl" onClick={handleClick}>
            <motion.div
                className="vinyl-disc"
                animate={{
                    rotate: isPlaying ? 360 : 0,
                }}
                transition={{
                    repeat: Infinity,
                    duration: isPlaying ? 4 : 0,
                    ease: 'linear',
                }}
                
            >   <div className="vinyl-label">
                    <p>{props.name}</p>
                </div>
                <div className="vinyl-hole">
                    {isPlaying ? <FaPause className="vinyl-icon" /> : <FaPlay className="vinyl-icon" />}
                </div>
            </motion.div>
            
        </div>
        
    );
}
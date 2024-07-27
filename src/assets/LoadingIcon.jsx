import React from 'react';
import { motion } from 'framer-motion';

import './styles.css'; 

export default function LoadingIcon() {
    return <div className="loading-container">
        <motion.div
            className='loading-spinner'
            animate={{
                rotate: 360,
                transition: {
                    repeat: Infinity,
                    duration: 1,
                    ease: 'linear',
                }
            }}
        />
    </div>
}
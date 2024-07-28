import { Button } from "react-bootstrap";
import {motion} from 'framer-motion';

export default function LoginBlockade(props) {
    return <motion.div
        initial={{ opacity: 1, x: 0 }}       // Initial state: fully opaque, at x position 0
        animate={props.animate}    // Animate to: fully transparent, moved left by 100px
        transition={{ duration: 0.4 }}         // Animation duration: 2 seconds
        onClick={props.onClick}
        style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
        }}
        onAnimationComplete={props.handleAnimationComplete}
    >
        <Button
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
            }}
            onClick={props.onClick}
        >
            <h1 style={{ color: 'white' }}>
                {props.text}
            </h1>
        </Button>
    </motion.div>
    
}
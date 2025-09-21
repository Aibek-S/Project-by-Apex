import { motion } from "framer-motion";
import { forwardRef } from "react";

const AnimatedButton = forwardRef(({ 
  children, 
  className = "", 
  onClick, 
  type = "button",
  disabled = false,
  whileHover = { scale: 1.05 },
  whileTap = { scale: 0.95 },
  transition = { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={transition}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...props}
    >
      {children}
    </motion.button>
  );
});

export default AnimatedButton;
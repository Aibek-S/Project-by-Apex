import AnimatedButton from "./AnimatedButton";

// Example usage of AnimatedButton component
const AnimatedButtonExample = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h2>AnimatedButton Examples</h2>
      
      {/* Default button */}
      <AnimatedButton
        className="btn"
        onClick={() => console.log("Default button clicked")}
        style={{ margin: "10px" }}
      >
        Default Button
      </AnimatedButton>
      
      {/* Custom animation button */}
      <AnimatedButton
        className="btn"
        onClick={() => console.log("Custom animation button clicked")}
        whileHover={{ scale: 1.1, backgroundColor: "#b8935f" }}
        whileTap={{ scale: 0.9 }}
        style={{ margin: "10px", background: "var(--primary)", color: "#1a120b" }}
      >
        Custom Animation
      </AnimatedButton>
      
      {/* Icon button */}
      <AnimatedButton
        className="icon-btn"
        onClick={() => console.log("Icon button clicked")}
        style={{ 
          width: "40px", 
          height: "40px", 
          display: "inline-flex", 
          alignItems: "center", 
          justifyContent: "center",
          margin: "10px"
        }}
      >
        ⓘ
      </AnimatedButton>
      
      {/* Disabled button */}
      <AnimatedButton
        className="btn"
        disabled
        onClick={() => console.log("This won't fire")}
        style={{ margin: "10px" }}
      >
        Disabled Button
      </AnimatedButton>
    </div>
  );
};

export default AnimatedButtonExample;
import './loading-spinner.css'

function LoadingSpinner({ size = 40, color = "#333" }) {
   const spinnerStyle = {
    width: size,
    height: size,
    border: `${size / 8}px solid rgba(0, 0, 0, 0.1)`,
    borderTop: `${size / 8}px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  return (
    <div className="loader-container">
       <div style={spinnerStyle} className="loading-spinner"></div>
    </div>
  );
}

export default LoadingSpinner;

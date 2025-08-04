function Button({
  color,
  backgroundColor,
  text,
  onClick,
  id = "",
  className = "",
  tabIndex = 0,
  ariaLabel= "",
  disabled,
}) {
    const buttonStyle = {
        color: color,
        backgroundColor: backgroundColor
    }

    return (
        <button style={buttonStyle} 
                onClick={onClick} 
                id={id} 
                className={className} 
                tabIndex={tabIndex} 
                aria-label={ariaLabel} 
                disabled={disabled}>
            {text}
        </button>
    )
}

export default Button;
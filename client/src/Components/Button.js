import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Button = ({ className, children, onClick, to, type }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return to ? (
    <Link
      to={to}
      className={`rounded-md py-2 px-4 font-bold text-white ${className}`}
    >
      {children}
    </Link>
  ) : (
    <button
      type={type}
      className={`rounded-md py-2 px-4 font-bold text-white ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  to: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]), // Add type prop
};

Button.defaultProps = {
  type: "button", // Default type is "button"
};

export default Button;

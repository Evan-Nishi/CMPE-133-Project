// Button.js
import React from "react";
import PropTypes from "prop-types";

const Button = ({ className, children, onClick, redirect }) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (redirect) {
      window.location.href = redirect;
    }
  };

  return (
    <button
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
  redirect: PropTypes.string,
};

export default Button;

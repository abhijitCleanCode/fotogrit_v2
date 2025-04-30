import React from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const ButtonCollapseAbhijit = ({
  label,
  isOpen,
  handleClick,
  disabled,
  background = "#111111",
}) => {
  return (
    <button
      className={`flex items-center gap-2 px-3 pr-4 py-2 sm:max-w-max group hover:bg-opacity-80 hover:text-opacity-80 transition-all duration-300`}
      onClick={handleClick}
      disabled={disabled}
      style={{
        backgroundColor: isOpen ? "transparent" : background,
        borderRadius: isOpen ? "0" : "0.5rem", // rounded-lg when closed
        color: isOpen ? "#fff" : "#fff",
      }}
    >
      <div
        className={`p-1 transition-all duration-300 group-hover:bg-opacity-80`}
        style={{
          backgroundColor: isOpen ? background : "transparent",
          borderRadius: isOpen ? "0.375rem" : "0",
          color: "#fff",
        }}
      >
        {isOpen ? (
          <IoIosArrowDown className="duration-300 group-hover:transform group-hover:-rotate-180" />
        ) : (
          <FaPlus />
        )}
      </div>

      <span className="text-sm font-medium group-hover:text-opacity-60">
        {label}
      </span>
    </button>
  );
};

export default ButtonCollapseAbhijit;

//* Key concept
// 1. isOpen: boolean - this make this component stateless. It relis on props to know wheter it's "open" or "closed"

import React from "react";
import { FiSearch } from "react-icons/fi"; // Feather icons (lightweight)

const InputAbhijit = React.forwardRef(
  ({ placeholder = "Search", searchValue, onChange }, ref) => {
    return (
      <div
        className="flex items-center w-full max-w-sm px-3 py-2 border border-gray-300 rounded-[0.5rem] bg-white shadow-sm"
        role="search"
      >
        <FiSearch className="text-gray-400 text-lg" aria-hidden="true" />
        <input
          ref={ref}
          type="search"
          placeholder={placeholder}
          value={searchValue}
          onChange={onChange}
          aria-label="Search"
          className="ml-2 w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />
      </div>
    );
  }
);

export default InputAbhijit;

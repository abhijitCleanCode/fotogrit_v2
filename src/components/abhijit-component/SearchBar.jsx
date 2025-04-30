import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const SearchBar = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "Search...",
      className = "",
      inputClassName = "",
    },
    ref
  ) => {
    const handleSearch = (e) => {
      onChange(e.target.value);
    };

    return (
      <div className={`flex flex-wrap items-center gap-4 ${className}`}>
        <div className="relative flex-1 min-w-[200px]">
          <FaMagnifyingGlass
            className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleSearch}
            placeholder={placeholder}
            className={`w-full py-2 pl-10 pr-4 border border-gray-300 rounded-[0.5rem] focus:outline-none focus:ring-2 focus:ring-[#A67C52] focus:border-transparent ${inputClassName}`}
            aria-label="Search input"
          />
        </div>
      </div>
    );
  }
);

export default React.memo(SearchBar); // if parent re-renders frequently

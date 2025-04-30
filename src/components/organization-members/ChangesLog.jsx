// components
import { TableChangeLog } from ".";
import { SearchBar } from "../abhijit-component";
// icons
import { FiFilter } from "react-icons/fi";

const SearchWithFilter = ({
  className = "",
  searchValue = "",
  setSearchValue,
  onFilterClick = () => {},
  filterActive = false,
  placeholder = "Search...",
  disabled = false,
  isLoading = false,
}) => {
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} role="search">
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        // disabled={disabled}
      />

      {/* drop down */}
      <button
        onCLick={onFilterClick}
        aria-label={filterActive ? "Close filters" : "Open filters"}
        aria-pressed={filterActive}
        className={`p-2 rounded-md ${
          filterActive ? "bg-gray-200" : "hover:bg-gray-100"
        }`}
      >
        <FiFilter className="mr-2 h-5 w-5" />
      </button>
    </div>
  );
};

const mockData = {
  data: [
    {
      id: 1,
      log_number: "L01111",
      date: "15-Mar-2025",
      user_code: "C-1111 Ben",
      action: "Add user as a member",
      user_code_performing_action: "Self",
    },
  ],
  meta: {
    total_page: 1,
    total_record: 4,
  },
};

const ChangesLog = () => {
  return (
    <>
      <SearchWithFilter />

      <div className="my-[32px]">
        <TableChangeLog
          data={mockData}
          isSuccess={true}
          isLoading={false}
          isError={false}
        />
      </div>
    </>
  );
};

export default ChangesLog;

import { useState } from "react";
// icons
import { FiFilter } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
// custom components
import {
  AddNewRelatedOrganization,
  TableRelatedOrganizationList,
  EditRelatedOrganization,
  DeleteRelationship,
} from ".";
import { ButtonIcon, SearchBar } from "../abhijit-component";
import { IoIosArrowUp } from "react-icons/io";
import { Collapse } from "..";

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
        onClick={onFilterClick}
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

const mockTableData = {
  data: [
    {
      id: 1,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 2,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 3,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 4,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 5,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 6,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 7,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 8,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 9,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 10,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 11,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 12,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 13,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 14,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 15,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 16,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 17,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 18,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 19,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 20,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 21,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 22,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 23,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 24,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 25,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 26,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 27,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 28,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 29,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 30,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 31,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 32,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 33,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 34,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 35,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 36,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 37,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 38,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 39,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 40,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 41,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 42,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 43,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 44,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 45,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 46,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 47,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 48,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 49,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 50,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 51,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 52,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 53,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 54,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 55,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 56,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 57,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 58,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 59,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 60,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 61,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 62,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 63,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 64,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 65,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 66,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 67,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 68,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
    {
      id: 69,
      code: "CC1111 Perbasi DKI Jakarta",
      type: "Governing Body",
      relationship: "Parent",
      added_by: "Self",
    },
    {
      id: 70,
      code: "CC2222 Roar Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "Self",
    },
    {
      id: 71,
      code: "CC3333 Warriors Basketball Club",
      type: "Club",
      relationship: "Child",
      added_by: "C-1011 Ben (Org PIC)",
    },
    {
      id: 72,
      code: "CC4444 Warriors Academy",
      type: "Academy",
      relationship: "Child",
      added_by: "C-9999 (Org PIC)",
    },
  ],

  meta: {
    total_page: 8,
    total_record: 72,
  },
};

const VIEWS = {
  ADD_NEW: "Add_New_Organization",
  EDIT: "Edit_Related_Organization",
  DELETE: "Delete_Relationship",
};

const RelatedOrganizationList = (props) => {
  const { parentOrganization } = props;

  const [currentView, setCurrentView] = useState(VIEWS.ADD_NEW);
  const [isOpenAddNewOrganization, setIsOpenAddNewOrganization] =
    useState(false); // Track open/close

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const handleEditClick = () => {
    setCurrentView("Edit_Related_Organization");
  };

  return (
    <>
      {currentView === "Add_New_Organization" && (
        <div className="flex items-center justify-between flex-wrap">
          <ButtonIcon
            icon={isOpenAddNewOrganization ? IoIosArrowUp : BiPlus}
            iconPosition="left"
            onClick={() => setIsOpenAddNewOrganization((prev) => !prev)}
          >
            Add new related organization
          </ButtonIcon>

          <SearchWithFilter className="max-w-2xl" />
        </div>
      )}

      {currentView === "Add_New_Organization" && (
        <Collapse isOpen={isOpenAddNewOrganization}>
          <div className="mt-[32px]">
            <AddNewRelatedOrganization
              setIsOpenAddNewOrganization={setIsOpenAddNewOrganization}
              parentOrganization={parentOrganization}
            />
          </div>
        </Collapse>
      )}

      {currentView === "Add_New_Organization" && (
        <div className="mt-[32px]">
          <TableRelatedOrganizationList
            data={mockTableData}
            isSuccess={true}
            isLoading={false}
            isError={false}
            // these props would normally come from api hooks
            setOpenModal={() => {}}
            setGetData={() => {}}
            limitPerPage={limitPerPage}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            onEditClick={handleEditClick}
          />
        </div>
      )}

      {currentView === "Edit_Related_Organization" && (
        <EditRelatedOrganization setCurrentView={setCurrentView} />
      )}

      {currentView === "Delete_Relationship" && <DeleteRelationship />}
    </>
  );
};

export default RelatedOrganizationList;

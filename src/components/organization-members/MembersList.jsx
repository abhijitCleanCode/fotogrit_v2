import { useState } from "react";
// icons
import { ButtonIcon, SearchBar } from "../abhijit-component";
import { BiPlus } from "react-icons/bi";
import { IoIosArrowUp } from "react-icons/io";
import { FiFilter } from "react-icons/fi";
import { Collapse } from "..";
import { AddNewMembers, EditMembers, TableMembersList } from ".";
import { useGetOrganizationMembersListQuery } from "@/services/api/orgMembersApiSlice";

const VIEWS = {
  ADD_NEW: "Add_New_Member",
  EDIT_MEMBER: "Edit_Member",
};

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

const MembersList = (props) => {
  const { selectedOrganization, setSelectedOrganization } = props;
  console.log("members list :: selectedOrganization: ", selectedOrganization);

  const [currentView, setCurrentView] = useState(VIEWS.ADD_NEW);
  const [isOpenAddNewMember, setIsOpenAddNewMember] = useState(false);

  const {
    data: orgMembers,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrganizationMembersListQuery({
    org: selectedOrganization?.value,
  });
  console.log("members list :: data: ", orgMembers);

  const handleEditClick = () => {
    setCurrentView(VIEWS.EDIT_MEMBER);
  };

  const renderView = () => {
    switch (currentView) {
      case VIEWS.ADD_NEW:
        return (
          <>
            <div className="flex items-center justify-between flex-wrap space-y-4">
              <ButtonIcon
                icon={isOpenAddNewMember ? IoIosArrowUp : BiPlus}
                iconPosition="left"
                onClick={() => setIsOpenAddNewMember((prev) => !prev)}
              >
                Add new member
              </ButtonIcon>

              <SearchWithFilter className="max-w-2xl" />
            </div>

            <Collapse isOpen={isOpenAddNewMember}>
              <div className="mt-8">
                <AddNewMembers selectedOrganization={selectedOrganization} />
              </div>
            </Collapse>

            <div className="mt-8">
              <TableMembersList
                data={orgMembers}
                isSuccess={true}
                isLoading={false}
                isError={false}
                onEditClick={handleEditClick}
              />
            </div>
          </>
        );

      case VIEWS.EDIT_MEMBER:
        return (
          <div className="mt-8">
            <EditMembers />
          </div>
        );
    }
  };

  return <>{renderView()}</>;
};

export default MembersList;

//! abhijit changes
import { useState, Suspense, lazy } from "react";
// lazy components
const LazyButtonIcon = lazy(() =>
  import("@/components/abhijit-component/ButtonIcon")
);
const LazyAddNewOrganizationForm = lazy(() =>
  import("./AddNewOrganizationForm")
);
const LazyEditOrganizationTypeForm = lazy(() =>
  import("./EditOrganizationTypeForm")
);
const LazyTableOrganizationType = lazy(() => import("./TableOrganizationType"));
import { SkeletonBlock, SkeletonForm, SkeletonTable } from "../Skeleton";

// icons
import { FiEdit2, FiFilter } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { IoIosArrowUp } from "react-icons/io";
// custom components
import { SearchInputAbhijit } from "../abhijit-component";
import { Collapse } from "..";
import useDebounce from "@/hooks/useDebounce";
import { useGetOrganizationTypeListQuery } from "@/services/api/generalSettingOrganizationTypeApiSlice";

// similar component is present in src :: components :: form-input :: FilterSearch
const SearchWithFilter = ({
  className,
  placeholder = "Search...",
  searchValue,
  setSearchValue,
  onFilterClick,
  filterActive,
}) => {
  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <SearchInputAbhijit
        placeholder={placeholder}
        searchValue={searchValue}
        onChange={handleSearchChange}
      />

      {/* drop down menu */}
      <button
        className={`p-2 rounded-[0.5rem] ${
          filterActive
            ? "bg-blue-100 border border-blue-500"
            : "bg-white border border-gray-300"
        }`}
        // variant={filterActive ? "default" : "secondary"}
        size="icon"
        // onClick={onFilterClick}
        aria-label="Filter"
      >
        <FiFilter className="h-4 w-4" />
      </button>
    </div>
  );
};

const VIEW_STATES = {
  LIST: "All_Organizations_Type",
  EDIT: "Edit_Organization_Type",
};

// main component
const OrganizationType = () => {
  const [currentView, setCurrentView] = useState(VIEW_STATES.LIST); // state managed view switching pattern + container component
  const [isOpenAddNewOrganizationType, setIsOpenAddNewOrganizationType] =
    useState(false); // Track open/close
  const [selectedOrganizationType, setSelectedOrganizationType] = useState(); // store selected org in state to know what org is being edited
  const [isConfirm, setIsConfirm] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data, isLoading, isSuccess, isError, error } =
    useGetOrganizationTypeListQuery({
      page: currentPage,
      limit: 100,
      searchTerm: debouncedSearchValue || undefined,
    });

  const handleEditClick = (organizationType) => {
    // store selected item in state to know what item is being edited
    setSelectedOrganizationType(organizationType);
    setCurrentView(VIEW_STATES.EDIT);
  };

  return (
    <>
      {currentView !== VIEW_STATES.EDIT && (
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* permission based access */}
          <Suspense fallback={<SkeletonBlock />}>
            <LazyButtonIcon
              icon={isOpenAddNewOrganizationType ? IoIosArrowUp : BiPlus}
              iconPosition="left"
              onClick={() => setIsOpenAddNewOrganizationType((prev) => !prev)}
              data-testid="add-new-organization-type-toggle-button"
            >
              Add New Organization Type
            </LazyButtonIcon>
          </Suspense>

          <SearchWithFilter
            className="max-w-2xl"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      )}

      {currentView !== VIEW_STATES.EDIT && (
        <Collapse isOpen={isOpenAddNewOrganizationType}>
          <Suspense fallback={<SkeletonForm cols={4} rows={4} />}>
            <LazyAddNewOrganizationForm
              isConfirm={isConfirm}
              setIsConfirm={setIsConfirm}
            />
          </Suspense>
        </Collapse>
      )}

      {currentView !== VIEW_STATES.EDIT && (
        <section className="mt-[32px]">
          <Suspense fallback={<SkeletonTable />}>
            <LazyTableOrganizationType
              data={data}
              isSuccess={isSuccess}
              isLoading={isLoading}
              isError={isError}
              // these props would normally come from api hooks
              setOpenModal={() => {}}
              setGetData={() => {}}
              limitPerPage={limitPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              onEditClick={handleEditClick} // Pass handler to the table
            />
          </Suspense>
        </section>
      )}

      {currentView === VIEW_STATES.EDIT && (
        <div>
          <Suspense fallback={<SkeletonBlock />}>
            <LazyButtonIcon
              icon={FiEdit2}
              iconPosition="left"
              onClick={() => {
                setCurrentView(VIEW_STATES.LIST);
              }}
            >
              Edit Organization Type
            </LazyButtonIcon>
          </Suspense>

          <Suspense fallback={<SkeletonForm cols={4} rows={4} />}>
            <LazyEditOrganizationTypeForm
              selectedOrganizationType={selectedOrganizationType}
            />
          </Suspense>
        </div>
      )}
    </>
  );
};

export default OrganizationType;

//! abhijit changes
import { useState, Suspense, lazy } from "react";
// lazy components
const LazyButtonIcon = lazy(() =>
  import("@/components/abhijit-component/ButtonIcon")
);
const LazyAddNewOrganizationForm = lazy(() =>
  import("./AddNewOrganizationForm")
);
const LazyTableOrganizationType = lazy(() => import("./TableOrganizationType"));
import { SkeletonBlock, SkeletonForm, SkeletonTable } from "../Skeleton";

// form related imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  add_new_organization_type_schema,
  edit_organization_type_schema,
} from "./schemaValidation";
// icons
import { FiEdit2, FiFilter } from "react-icons/fi";
import { BiPlus } from "react-icons/bi";
import { IoIosArrowUp } from "react-icons/io";
// custom components
import { ButtonIcon } from "../abhijit-component";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
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

const EditOrganizationType_View = (props) => {
  const { switchView, onSubmit, serverErrors } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(edit_organization_type_schema),
    mode: "onChange", // Validate on change
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const handleFormSubmit = async (data) => {
    console.log("data :: ", data);

    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Submitting error: ", error);
    }
  };

  return (
    <div className="">
      <ButtonIcon icon={FiEdit2} iconPosition="left">
        Edit Organization Type
      </ButtonIcon>

      <div className="relative min-h-[52vh] p-4 py-8 mt-[32px] bg-white shadow-lg">
        <form className="grid grid-flow-row-dense md:grid-cols-3 lg:grid-cols-3 gap-4 sm:grid-cols-1 gap-y-2">
          <FormInputAbhijit
            type="text"
            label="Organization Type Code"
            placeholder="OT001"
            {...register("code")}
            error={errors.code?.message || serverErrors?.code}
            autoComplete="off"
            autoFocus
          />
          <FormInputAbhijit
            type="text"
            label="Organization Type Name"
            placeholder="Enter organization Type Name"
            {...register("name")}
            error={errors.name?.message || serverErrors?.name}
            autoComplete="off"
          />
          <FormInputAbhijit
            type="text"
            label="Description"
            placeholder="Enter Description"
            {...register("description")}
            error={errors.description?.message || serverErrors?.description}
            autoComplete="off"
          />

          <div className="absolute bottom-0 right-0 pb-2 mr-2 mt-4 flex justify-end gap-4">
            <ButtonIcon type="submit">Save</ButtonIcon>
          </div>
        </form>
      </div>
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
  const [isConfirm, setIsConfirm] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const debouncedSearchValue = useDebounce(searchValue, 500);
  const { data, isLoading, isSuccess, isError, error } =
    useGetOrganizationTypeListQuery({
      page: currentPage,
      limit: 10,
      searchTerm: debouncedSearchValue || undefined,
    });

  const handleEditClick = (organizationType) => {
    // store selected item in state to know what item is being edited
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

      {currentView === VIEW_STATES.EDIT && <EditOrganizationType_View />}
    </>
  );
};

export default OrganizationType;

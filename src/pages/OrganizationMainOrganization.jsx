import { lazy, Suspense, useState, useCallback } from "react";

// lazy components
const LazyBreadcrumb = lazy(() => import("@/components/Breadcrumb"));
const LazyButtonIcon = lazy(() =>
  import("@/components/abhijit-component/ButtonIcon")
);
const LazyTableMainOrganization = lazy(() =>
  import("@/components/organization-main-organization/TableMainOrganization")
);
import {
  SkeletonBlock,
  SkeletonBreadcrumb,
  SkeletonTable,
} from "@/components/Skeleton";

// icons
import { BiPlus } from "react-icons/bi";
import { IoIosArrowUp } from "react-icons/io";
import { FiFilter } from "react-icons/fi";

// components
import { Card, CardBody } from "@/components/Card";
import {
  AddNewOrganization,
  FormEditOrganization,
  TableMainOrganization,
} from "@/components/organization-main-organization";
import { ButtonIcon, SearchInputAbhijit } from "@/components/abhijit-component";
import { Collapse } from "@/components";
import { useGetOrganizationTypeListQuery } from "@/services/api/generalSettingOrganizationTypeApiSlice";
import { useGetCitiesQuery } from "@/services/api/cityApiSlice";
import { useGetOrganizationListQuery } from "@/services/api/orgMainOrgApiSlice";

const breadcrumbItems = [
  { label: "Organizations", url: "#" },
  { label: "Main Organizations" },
];

const SearchWithFilter = ({
  className = "",
  placeholder = "Search...",
  searchValue = "",
  onSearchChange = () => {},
  onFilterClick = () => {},
  filterActive = false,
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <SearchInputAbhijit
        placeholder={placeholder}
        searchValue={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <button
        // variant={filterActive ? "default" : "secondary"}
        // size="icon"
        // onClick={onFilterClick}
        aria-label="Filter"
      >
        <FiFilter className="mr-2 h-4 w-4" />
      </button>
    </div>
  );
};

const VIEW_STATES = {
  LIST: "All_Organizations_list",
  EDIT: "Edit_Organization",
};

// main component
const OrganizationMainOrganization = () => {
  const [currentView, setCurrentView] = useState(VIEW_STATES.LIST); // state managed view switching pattern + container component
  const [isOpenAddNewOrganization, setIsOpenAddNewOrganization] =
    useState(false); // Track open/close
  const [selectedOrganization, setSelectedOrganization] = useState(); // store selected org in a state to know what org is being edited

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  // for options org type
  const {
    data: organizationTypes,
    // isLoading,
    // isSuccess,
    // isError,
    // error,
  } = useGetOrganizationTypeListQuery({
    limit: 100,
  });
  const optionsOrgTypes = organizationTypes?.data?.org_types?.map(
    (orgType) => ({
      value: orgType?.id,
      label: `${orgType?.code} ${orgType?.name ? ` - ${orgType?.name}` : ""}`,
    })
  );

  // for options filter city
  const { data: cities } = useGetCitiesQuery({
    page: 1,
    searchTerm: "",
  });
  const optionsCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(optionsCities)) {
    optionsCities.unshift({ value: "", label: "Select City" });
  }

  // for table, and also options for parent organization
  const {
    data: organizationList,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrganizationListQuery({
    page: currentPage,
    limit: limitPerPage,
    searchTerm: searchValue,
  });
  const optionsOrganizations = organizationList?.data?.orgs?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? ` - ${item?.name}` : ""}`,
  }));

  const handleEditClick = useCallback((organization) => {
    setSelectedOrganization(organization);
    setCurrentView(VIEW_STATES.EDIT);
  }, []);

  return (
    <>
      <Card className="p-4 px-6 pb-0">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Organizations" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-[32px]">
          {currentView !== VIEW_STATES.EDIT && (
            // permission based access
            <div className="flex items-center justify-between flex-wrap">
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonIcon
                  icon={isOpenAddNewOrganization ? IoIosArrowUp : BiPlus}
                  iconPosition="left"
                  onClick={() => setIsOpenAddNewOrganization((prev) => !prev)}
                  data-testid="add-new-organization-toggle-button"
                >
                  Add new organization
                </LazyButtonIcon>

                <SearchWithFilter
                  className="max-w-2xl"
                  searchValue={searchValue}
                  onSearchChange={setSearchValue}
                />
              </Suspense>
            </div>
          )}

          {currentView !== VIEW_STATES.EDIT && (
            <Collapse isOpen={isOpenAddNewOrganization}>
              <div className="mt-[32px]">
                <AddNewOrganization
                  optionsOrgTypes={optionsOrgTypes}
                  cities={optionsCities}
                  optionsOrganizations={optionsOrganizations}
                />
              </div>
            </Collapse>
          )}

          {currentView !== VIEW_STATES.EDIT && (
            <div className="mt-[32px]">
              <Suspense fallback={<SkeletonTable />}>
                <LazyTableMainOrganization
                  data={organizationList}
                  isSuccess={isSuccess}
                  isLoading={isLoading}
                  isError={isError}
                  // these props would normally come from api hooks
                  setOpenModal={() => {}}
                  setGetData={() => {}}
                  limitPerPage={10}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  onEditClick={handleEditClick} // Pass handler to the table
                />
              </Suspense>
            </div>
          )}

          {/* potential improvement: bring edit org button in this component, no need to pass state to child component */}
          {currentView === VIEW_STATES.EDIT && (
            <div className="mt-[32px]">
              <FormEditOrganization
                initialValues={selectedOrganization}
                optionsOrgTypes={optionsOrgTypes}
                cities={optionsCities}
                setCurrentView={setCurrentView}
                optionsOrganizations={optionsOrganizations}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default OrganizationMainOrganization;

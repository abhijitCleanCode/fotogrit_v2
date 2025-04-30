import { lazy, Suspense, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { BiReset } from "react-icons/bi";

const LazyButton = lazy(() => import("@/components/Button"));
const LazyFilterSearch = lazy(() =>
  import("@/components/form-input/FilterSearch")
);
const LazyFilterSelect = lazy(() =>
  import("@/components/form-input/FilterSelect")
);
const LazyButtonCollapse = lazy(() => import("@/components/ButtonCollapse"));
const LazyTableTeamMaster = lazy(() =>
  import("@/components/team-master/TableTeamMaster")
);

import { Collapse, Modal, PopUpDelete, Tooltip } from "@/components";
import { Card, CardBody } from "@/components/Card";
import {
  FormAddTeamMaster,
  FormDetailTeamMaster,
} from "@/components/team-master";
import { SkeletonBlock, SkeletonTable } from "@/components/Skeleton";

import useDebounce from "@/hooks/useDebounce";
import { useGetCitiesQuery } from "@/services/api/cityApiSlice";
import {
  useDeleteTeamMasterMutation,
  useGetTeamMasterQuery,
} from "@/services/api/teamMasterApiSlice";
import { selectCurrentModules } from "@/services/state/authSlice";
import {
  useGetOptionsAgeGroupQuery,
  useGetOptionsEventPoolQuery,
  useGetOptionsEventTypeQuery,
} from "@/services/api/othersApiSlice";
import { useGetClubListQuery, useGetOptionsClubsQuery } from "@/services/api/clubMasterApiSlice";
import { useGetAllCustomerDataQuery } from "@/services/api/customerDataApiSlice";
import {
  useGetEventGroupListQuery,
  useGetEventGroupOwnedQuery,
} from "@/services/api/eventGroupApiSlice";
import { useGetTeamListQuery } from "@/services/api/eventsApiSlice";

const TeamMaster = (props) => {
  const { eventGroupID, optionsEventGroup } = props;

  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [filterSelectedValue, setFilterSelectedValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [getDetailData, setGetDetailData] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);

  const modules = useSelector(selectCurrentModules);
  const teamMasterAccess = modules[10];

  const {
    data: dataTeam,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTeamListQuery({
    eventGroup: eventGroupID,
    searchTerm: '',
    page: currentPage,
    limit: limitPerPage,
  });

  const teamListCode = dataTeam?.data?.team_code;

  const [deleteTeamMaster, { isLoading: isLoadingDelete }] =
    useDeleteTeamMasterMutation();

  const handleResetFilter = () => {
    setFilterSelectedValue("");
    setSearchValue("");
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTeamMaster({
        id: getDetailData?.team_id,
      }).unwrap();

      if (!response.error) {
        setPopUpDelete(false);
        setOpenModal(false);
        toast.success(`"${getDetailData?.name}" has been deleted!`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (err) {
      console.error("Failed to delete data", err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    }
  };

  // Get Options City from api city
  const { data: cities } = useGetCitiesQuery({
    page: "",
    searchTerm: "",
  });
  const selectDataCities = cities?.data?.map((item) => ({
    value: item?.city,
    label: item?.city,
  }));
  if (Array.isArray(selectDataCities)) {
    selectDataCities.unshift({ value: "", label: "Select City" });
  }

  const [pageClub, setPageClub] = useState(1);
  const [searchQueryClub, setSearchQueryClub] = useState('');
  const debouncedSearchClub = useDebounce(searchQueryClub, 200);
  const { data: clubsData } = useGetClubListQuery({
     searchTerm: debouncedSearchClub,
  });
    const totalPageOptionClubData = clubsData?.meta?.total_page;
  const optionsClubs = clubsData?.data?.clubs?.map((item) => ({
    value: item?.id,
    label: `${item?.code} - ${item?.name}`,
    logo: item?.logo,
  }));
  if (Array.isArray(optionsClubs)) {
    optionsClubs.unshift({ value: "", label: "Select Club", logo: "" });
  }

  // Get Options Age Group
  const [pageAgeGroup, setPageAgeGroup] = useState(1);
  const [searchQueryAgeGroup, setSearchQueryAgeGroup] = useState('');
  const debouncedSearchAgeGroup = useDebounce(searchQueryAgeGroup, 200);
  const { data: AgeGroupsData } = useGetOptionsAgeGroupQuery({
    searchTerm: debouncedSearchAgeGroup,

  });
    const totalPageOptionAgeData = AgeGroupsData?.meta?.total_page;
  const optionsAgeGroups = AgeGroupsData?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.age_group} ${item?.gender} ${item?.description}`,
  }));
  if (Array.isArray(optionsAgeGroups)) {
    optionsAgeGroups.unshift({ value: "", label: "Select Age Group" });
  }

  // Get Options Event Type
  const { data: eventTypeData } = useGetOptionsEventTypeQuery();
  const optionsEventType = eventTypeData?.data?.map((item) => ({
    value: item?.id,
    label: item?.event_type,
  }));
  if (Array.isArray(optionsEventType)) {
    optionsEventType.unshift({ value: "", label: "Select Event Type" });
  }

  // for options pool
  const { data: pools } = useGetOptionsEventPoolQuery();
  const optionsPools = pools?.data?.map((item) => ({
    value: item?.id,
    label: item?.name,
  }));
  if (Array.isArray(optionsPools)) {
    optionsPools.unshift({ value: "", label: "Select Pool" });
  }

  // Options Customers
  const [pageCustomerData, setPageCustomerData] = useState(1);
  const [searchQueryCustomerData, setSearchQueryCustomerData] = useState('');
  const debouncedSearchCustomerData = useDebounce(searchQueryCustomerData, 200);
  const { data: customers } = useGetAllCustomerDataQuery({
    searchTerm: debouncedSearchCustomerData,
  });
  const totalPageOptionCustomerData = customers?.meta?.total_page;
  const optionsCustomers = customers?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? `- ${item?.name}` : ""}`,
    email: item?.email,
    phone: item?.phone_number,
  }));
  if (Array.isArray(optionsCustomers)) {
    optionsCustomers.unshift({ value: "", label: "Select PIC" });
  }


  const handleClickButtonAddTeam = () => {
    // If the form is collapsed do some validation, if not just close it.
    if (!isOpenNewData) {
      if (!eventGroupID) {
        toast.error("Please select an event group before adding a team.");
        return;
      }

      setIsOpenNewData(true);
    } else {
      setIsOpenNewData(false);
    }
  };

  const filteredTeams = useMemo(() => {
    if (!dataTeam?.data?.[0]?.teams || !searchValue) {
      return dataTeam?.data?.[0]?.teams || [];
    }

    return dataTeam.data[0].teams.filter((team) => {
      return (
        (team.code &&
         team.code.toLowerCase().includes(searchValue.toLowerCase())) ||
        (team.name &&
         team.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (team.pic_team &&
         team.pic_team.toLowerCase().includes(searchValue.toLowerCase())) ||
        (team.club_name &&
         team.club_name.toLowerCase().includes(searchValue.toLowerCase()))
      );
    });
  }, [dataTeam, searchValue]);

  return (
    <>
      <Card className="">
        <CardBody className="">
          <div
            className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${
              teamMasterAccess?.can_add
                ? "md:justify-between"
                : "md:justify-end"
            }`}
          >
            {teamMasterAccess?.can_add && (
              <Suspense fallback={<SkeletonBlock />}>
                <LazyButtonCollapse
                  label="Add New Team"
                  isOpen={isOpenNewData}
                  handleClick={() => handleClickButtonAddTeam()}
                />
              </Suspense>
            )}

            <div className="flex gap-2 flex-col sm:flex-row sm:items-center sm:justify-between w-full sm:w-[60%] lg:w-[50%]">
              <div className="w-full">
                <Suspense fallback={<SkeletonBlock width="w-full" />}>
                  <LazyFilterSearch
                    searchValue={searchValue}
                    setSearchValue={setSearchValue}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>

              <Tooltip text="Reset Filter" position="top">
                <Suspense fallback={<SkeletonBlock width="w-10" />}>
                  <LazyButton
                    background="black"
                    onClick={handleResetFilter}
                    className="block w-full"
                  >
                    <BiReset className="mx-auto" />
                  </LazyButton>
                </Suspense>
              </Tooltip>
            </div>
          </div>

          <Collapse isOpen={isOpenNewData}>
            <FormAddTeamMaster
              eventGroupID={eventGroupID}
              setOpenColapse={setIsOpenNewData}
              teamListCode={teamListCode}
              optionsCities={selectDataCities}
              optionsEventGroup={optionsEventGroup}
              optionsClubs={optionsClubs}
              optionsAgeGroups={optionsAgeGroups}
                setSearchQueryAgeGroup={setSearchQueryAgeGroup}
              setPageAgeGroup={setPageAgeGroup}
              totalPageOptionAgeData={totalPageOptionAgeData}
              optionsEventType={optionsEventType}
              optionsPools={optionsPools}
              optionsCustomers={optionsCustomers}
              data={dataTeam}
              setSearchQueryOptionCustomerData={setSearchQueryCustomerData}
              totalPageOptionCustomerData={totalPageOptionCustomerData}
              setPageOptionCustomerData={setPageCustomerData}
              // club
              setPageClub={setPageClub}
              setSearchQueryClub={setSearchQueryClub}
              totalPageOptionClubData={totalPageOptionClubData}
            />
          </Collapse>

          <section className="mt-3">
            <Suspense fallback={<SkeletonTable />}>
              <LazyTableTeamMaster
                isEventGroupSelected={eventGroupID}
                openModal={openModal}
                setOpenModal={setOpenModal}
                setGetData={setGetDetailData}
                data={{
                  ...dataTeam,
                  data: dataTeam?.data ? [{
                    ...dataTeam.data[0],
                    teams: filteredTeams
                  }] : []
                }}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isError={isError}
                error={error}
                limitPerPage={limitPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </Suspense>

            {/* MODAL */}
            <Modal
              title="Detail Team"
              openModal={openModal}
              setOpenModal={setOpenModal}
              rounded="rounded-xl"
            >
              <FormDetailTeamMaster
                eventGroupID={eventGroupID}
                data={getDetailData}
                setOpenModal={setOpenModal}
                setIsOpenPopUpDelete={setPopUpDelete}
                isAccess={teamMasterAccess}
                optionsCities={selectDataCities}
                optionsClubs={optionsClubs}
                optionsAgeGroups={optionsAgeGroups}
                optionsEventType={optionsEventType}
                optionsPools={optionsPools}
                optionsCustomers={optionsCustomers}
                optionsEventGroup={optionsEventGroup}
                setSearchQueryOptionCustomerData={setSearchQueryCustomerData}
                totalPageOptionCustomerData={totalPageOptionCustomerData}
                setPageOptionCustomerData={setPageCustomerData}
                // club
              setPageClub={setPageClub}
              setSearchQueryClub={setSearchQueryClub}
                totalPageOptionClubData={totalPageOptionClubData}
                // age group
                setPageAgeGroup={setPageAgeGroup}
                setSearchQueryAgeGroup={setSearchQueryAgeGroup}
                totalPageOptionAgeData={totalPageOptionAgeData}
              />
            </Modal>
            {/* END MODAL */}

            {/* Pop Up Delete */}
            <PopUpDelete
              handleDelete={handleDelete}
              isLoading={isLoadingDelete}
              isOpenPopUpDelete={popUpDelete}
              setIsOpenPopUpDelete={setPopUpDelete}
            />
            {/* End Pop Up Delete */}
          </section>
        </CardBody>
      </Card>
    </>
  );
};

export default TeamMaster;

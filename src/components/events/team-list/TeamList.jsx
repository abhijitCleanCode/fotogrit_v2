import { useState } from "react";

import TableTeamList from "./TableTeamList";
import FormDetailTeamList from "./FormDetailTeamList";
import { ButtonCollapse, Modal } from "@/components";
import { FilterSearch } from "@/components/form-input";
import { useNavigate } from "react-router-dom";
import TeamMaster from "@/pages/TeamMaster";

const TeamList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    searchValue,
    setSearchValue,
    eventGroupID,
    optionsTeams,
    isAccess,
    currentPage,
    setCurrentPage,
    limitPerPage,
    metaPagination,
    isTeamManager,
    navigateToRoster,
    navigateToOfficial,
    optionsEventGroup,
  } = props;

  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [getData, setGetData] = useState("");

  return (
    <div>
      <TeamMaster 
        optionsEventGroup={optionsEventGroup}
        eventGroupID={eventGroupID}
      />

      {/* <TableTeamList
        openModal={openModal}
        setOpenModal={setOpenModal}
        setGetData={setGetData}
        data={data}
        isLoading={isLoading}
        isSuccess={isSuccess}
        isError={isError}
        error={error}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        metaPagination={metaPagination}
        limitPerPage={limitPerPage}
        isTeamManager={isTeamManager}
        navigateToRoster={navigateToRoster}
        navigateToOfficial={navigateToOfficial}
      /> */}

      {/* MODAL */}
      <Modal
        title="Detail Team List"
        openModal={openModal}
        setOpenModal={setOpenModal}
        className={`overflow-visible`}
        rounded="rounded-xl"
      >
        <FormDetailTeamList
          data={getData}
          eventGroupID={eventGroupID}
          optionsTeams={optionsTeams}
          isAccess={isAccess}
          setOpenModal={setOpenModal}
        />
      </Modal>
      {/* END MODAL */}
    </div>
  );
};

export default TeamList;

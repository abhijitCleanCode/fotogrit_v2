import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, LoaderButtonAction } from "@/components";
import { Input, SelectCustom, SelectDropdown } from "../form-input";

import { useAddNewTeamMasterMutation } from "@/services/api/teamMasterApiSlice";
import { useUpdateTeamListMutation } from "@/services/api/eventsApiSlice";
import { useSelector } from "react-redux";
import { selectCurrentEventGroupID } from "@/services/state/eventsSlice";

const validationSchema = yup
  .object({
    teamName: yup.string(),
    shortName: yup.string().max(10, "Short name must be at most 10 characters"),
    picTeam: yup.string(),
    location: yup.string(),
  })
  .required();

const FormAddTeamMaster = (props) => {
  const {
    data,
    optionsCities,
    setOpenColapse,
    teamListCode,
    optionsEventGroup,
    optionsClubs,
    optionsAgeGroups,
    optionsEventType,
    optionsPools,
    optionsCustomers,
    setSearchQueryOptionCustomerData,
    totalPageOptionCustomerData,
    setPageOptionCustomerData,
    setSearchQueryAgeGroup,
    setPageAgeGroup,
    totalPageOptionAgeData,
    // club
    setPageClub,
    setSearchQueryClub,
    totalPageOptionClubData
  } = props;

  const eventGroupID = useSelector(selectCurrentEventGroupID);
  const teamCodeList =
    data?.data.lenth != 0 ? data?.data[0].teams.map((el) => el.team_id) : [];

  useEffect(() => {
    const eventGroup = optionsEventGroup.find(
      (group) => group.value == eventGroupID
    );
    setEventGroupName(eventGroup.label);
  }, [eventGroupID, optionsEventGroup]);

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    id: "",
    code: "",
    teamName: "",
    shortName: "",
    picTeam: "",
    location: "",
    city: "",
    logo: null,
  };

  const [updateTeamList, { isUpdateTeamLoading }] = useUpdateTeamListMutation();

  const [eventGroupName, setEventGroupName] = useState("");
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedCityValue, setSelectedCityValue] = useState("");
  const [selectedClub, setSelectedClub] = useState({
    value: "",
    label: "Select Club",
    logo: "",
  });
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [selectedPicTeam, setSelectedPicTeam] = useState({
    value: "",
    label: "Select PIC",
    email: "",
    phone: "",
  });

  const [addNewTeamMaster, { isLoading, error: errServer }] =
    useAddNewTeamMasterMutation();

  const handleOnSubmit = async () => {
    try {
      const eventGroup = optionsEventGroup.find(
        (group) => group.value == eventGroupID
      );
      const eventType = optionsEventType.find(
        (type) => type.label == eventGroup.eventType
      );

      if (eventGroup.value == "") {
        toast.error(`"Please select Event Group first"`, {
          position: "top-right",
          theme: "light",
        });
        return;
      }
      if (selectedAgeGroup == null || selectedAgeGroup?.value == "") {
        toast.error(`"Please select Age Group first"`, {
          position: "top-right",
          theme: "light",
        });
        return;
      }

      const formData = new FormData();
      formData.append("name", formInput.teamName);
      formData.append("short_name", formInput.shortName);
      formData.append("pic_id", selectedPicTeam.value);
      formData.append(
        "pic_team",
        selectedPicTeam?.value === "" ? "" : selectedPicTeam?.label
      );
      formData.append("location", formInput.location);
      formData.append("city", selectedCityValue);
      formData.append("logo_team", formInput.logo);
      formData.append("club", selectedClub.value);
      formData.append("age_group", selectedAgeGroup.value);
      formData.append("event_type", eventType.value);

      const response = await addNewTeamMaster(formData).unwrap();

      if (!response.error) {
        // if create new team success, add this team to selected event group

        const updateData = {
          event_group_id: eventGroupID,
          teams: [...teamCodeList, response.data.id],
        };

        await updateTeamList(updateData).unwrap();

        setSelectedAgeGroup(null);
        setSelectedCityValue("");
        setSelectedClub(null);
        setFormInput(initialInputValue);
        reset();
        setOpenColapse(false);

        toast.success(`"${formInput?.teamName}" has been added!`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (err) {
      console.log("formInput",formInput)
      console.error("Failed to save the team", err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    }
  };

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ["teamName", "picTeam", "location", "shortName"];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== "") {
        if (errors[field].type === "required") {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  const handleCancel = () => {
    setFormInput(initialInputValue);

    setOpenColapse(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeSelectedAgeGroup = (data) => {
    const clubName = getClubName(selectedClub.label);
    let teamName = "";
    if (selectedClub.label !== "Select Club" && data) {
      teamName = clubName + " - " + data.label;
    }

    setSelectedAgeGroup(data);

    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      teamName: teamName,
    }));
  };

  const handleChangeSelectedClub = (data) => {
    setSelectedClub(data);

    const clubName = getClubName(data.label);
    let teamName = "";
    if (selectedClub.label !== "Select Club" && selectedAgeGroup) {
      teamName = clubName + " - " + selectedAgeGroup.label;
    }

    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      shortName: clubName.replaceAll(" ", "").slice(0, 10),
      teamName: teamName,
    }));
  };

  useEffect(() => {
    if (teamListCode) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        code: teamListCode,
      }));
    }
  }, [teamListCode]);

  useEffect(() => {
    console.log(formInput);
  }, [formInput]);

  /**
   * @param {string} label in form of 'club_id - club_name'
   * @returns extracted club_name without the id
   */
  const getClubName = (label) => {
    if (label == undefined) return "";

    let teamName = "";
    if (label.includes("-")) {
      teamName = label.split("-")[1].trim();
    } else {
      teamName = label;
    }

    return teamName;
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
        <Input
          type="text"
          label="Event Group"
          name="eventGroupName"
          value={eventGroupName}
          onChange={() => undefined}
          disabled
        />
        <Input
          type="text"
          label="Team Code"
          name="code"
          value={"Auto"}
          onChange={handleChange}
          disabled
        />
        <div className="z-40">
          <SelectDropdown
            name="club"
            data={optionsClubs}
            label="Club ID"
            placeholder="Club ID"
            selectedValue={selectedClub}
            setSelectedValue={handleChangeSelectedClub}
            errServer={errServer?.data}
            errCodeServer="x15001"
            infiniteScroll
             setPageOption={setPageClub}
            setSearchQueryOption={setSearchQueryClub}
            totalPageOptions={totalPageOptionClubData}
          />
        </div>
        <div className="z-30">
          <SelectDropdown
            name="ageGroup"
            data={optionsAgeGroups}
            label="Age Group"
            placeholder="Age Group"
            selectedValue={selectedAgeGroup}
            setSelectedValue={handleChangeSelectedAgeGroup}
            errServer={errServer?.data}
            errCodeServer="x07023"
            infiniteScroll
            setPageOption={setPageAgeGroup}
            setSearchQueryOption={setSearchQueryAgeGroup}
            totalPageOptions={totalPageOptionAgeData}
          />
        </div>
        <Input
          type="text"
          label="Team Name"
          name="teamName"
          value={formInput.teamName}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="xxx029"
          errValidation={errors}
          register={register}
        />
        <Input
          type="text"
          label="Short Name"
          name="shortName"
          value={formInput.shortName}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="x07006"
          errValidation={errors}
          register={register}
        />
        <div className="z-[35]">
          {/* <SelectCustom
            name="picTeam"
            data={optionsCustomers}
            label="PIC Team"
            placeholder="PIC Team"
            selectedValue={selectedPicTeam}
            setSelectedValue={setSelectedPicTeam}
            errServer={errServer?.data}
            errCodeServer="xxx030"
          /> */}
          <SelectDropdown
            name="picTeam"
            data={optionsCustomers}
            label="PIC Team"
            placeholder="PIC Team"
            selectedValue={selectedPicTeam}
            setSelectedValue={setSelectedPicTeam}
            errServer={errServer?.data}
            errCodeServer="xxx030"
            errValidation={errors}
            infiniteScroll
            setPageOption={setPageOptionCustomerData}
            setSearchQueryOption={setSearchQueryOptionCustomerData}
            totalPageOptions={totalPageOptionCustomerData}
          />
        </div>
        {/* <Input
          type="text"
          label="PIC Team"
          name="picTeam"
          value={formInput.picTeam}
          onChange={handleChange}
          errServer={errServer?.data}
          errCodeServer="xxx030"
          errValidation={errors}
          register={register}
        /> */}
      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          background="red"
          className="w-40"
          onClick={handleCancel}
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : "Cancel"}
        </Button>
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : "Add"}
        </Button>
      </div>
    </form>
  );
};

export default FormAddTeamMaster;

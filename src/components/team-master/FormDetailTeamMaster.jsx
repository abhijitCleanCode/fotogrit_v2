import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, LoaderButtonAction, Tooltip } from "@/components";
import {
  Input,
  SelectCustom,
  SelectDropdown,
  SelectInput,
  UpdateImage,
} from "../form-input";
import { Paragraph } from "../typography";

import { useUpdateTeamMasterMutation } from "@/services/api/teamMasterApiSlice";
import { FaCircleInfo } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectCurrentEventGroupID } from "@/services/state/eventsSlice";
import { useGetSingleCustomerDataQuery } from "@/services/api/customerDataApiSlice";

const validationSchema = yup
  .object({
    teamName: yup.string(),
    shortName: yup.string().max(10, "Short name must be at most 10 characters"),
    picTeam: yup.string(),
    location: yup.string(),
  })
  .required();

const FormDetailTeamMaster = (props) => {
  const {
    data,
    setOpenModal,
    setIsOpenPopUpDelete,
    isAccess,
    optionsCities,
    optionsClubs,
    optionsAgeGroups,
    optionsEventType,
    optionsPools,
    optionsCustomers,
    optionsEventGroup,
    eventGroupID,
    setSearchQueryOptionCustomerData,
    totalPageOptionCustomerData,
    setPageOptionCustomerData,
    //club
    setPageClub,
    setSearchQueryClub,
    totalPageOptionClubData,
    // age group
    setPageAgeGroup,
    setSearchQueryAgeGroup,
    totalPageOptionAgeData
  } = props;



  const [optionsPIC, setOptionsPIC] = useState(optionsCustomers);
useEffect(() => {
    setOptionsPIC(optionsCustomers)
  },[optionsCustomers])

  // const eventGroupID = useSelector(selectCurrentEventGroupID);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const initialInputValue = {
    id: "",
    teamCode: "",
    teamName: "",
    shortName: "",
    picTeam: "",
    picTelephone: "",
    picEmail: "",
    location: "",
    city: "",
    logo: null,
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [selectedClub, setSelectedClub] = useState({
    value: "",
    label: "Select Club",
    logo: "",
  });
  const defaultID0 = "d03a050e4841eb38d61da409dc82b35b";
  const [selectedPicTeam, setSelectedPicTeam] = useState({
    value: "",
    label: "Select PIC",
    email: "",
    phone: "",
  });

  const { data: customerData, isLoading: isLoadingCustomerData } =
    useGetSingleCustomerDataQuery(
      {
        id: data?.pic_id,
      },
      {
        skip: !data?.pic_id,
        refetchOnMountOrArgChange: true,
      }
    );

  if (customerData?.data) {
    const findCustomer = optionsPIC.find(
      (item) => item.value === customerData.data.id
    );
    if (!findCustomer) {
      setOptionsPIC([
        ...optionsPIC,
        {
          value: customerData.data.id,
          label: `${customerData.data?.code} ${
            customerData.data?.name ? `- ${customerData.data?.name}` : ""
          }`,
        },
      ]);
    }
  }

  useEffect(() => {

    setSelectedPicTeam({
      value: data?.pic_id,
      label: data?.pic_team,
    });
  }, []);

  const [updateTeamMaster, { isLoading, error: errServer }] =
    useUpdateTeamMasterMutation();

  const handleUpdate = async () => {
    try {
      const eventGroup = optionsEventGroup.find(
        (group) => group.value == eventGroupID
      );
      const eventType = optionsEventType.find(
        (type) => type.label == eventGroup.eventType
      );

      if (selectedClub.value == "") {
        toast.error(`"Please select Club first"`, {
          position: "top-right",
          theme: "light",
        });
        return;
      }

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
      formData.append("id", formInput.id);
      formData.append("name", formInput.teamName);
      formData.append("short_name", formInput.shortName);
      formData.append(
        "pic_id",
        selectedPicTeam?.value ? selectedPicTeam?.value : ""
      );
      formData.append(
        "pic_team",
        selectedPicTeam?.value === "" || selectedPicTeam?.value == undefined
          ? "-"
          : selectedPicTeam?.label
      );
      formData.append("location", "");
      formData.append("city", "");
      formData.append("event_type", eventType.value);
      formData.append("age_group", selectedAgeGroup.value);
      if (selectedClub?.value !== defaultID0) {
        formData.append("club", selectedClub?.value);
      }

      const response = await updateTeamMaster(formData).unwrap();

      if (!response.error) {
        setOpenModal(false);

        const newData = {
          teamCode: formInput.teamCode,
          teamName: formInput.teamName,
          shortName: formInput.shortName,
          picTeam: formInput.picTeam,
          picTelephone: formInput.picTelephone,
          picEmail: formInput.picEmail,
          location: formInput.location,
          city: formInput.city,
        };

        toast.success(`"${formInput?.teamName}" has been updated!`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (err) {
      console.error("Failed to update the team", err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (data) {
      setFormInput((prevState) => ({
        ...prevState,
        id: data?.team_id,
        teamCode: data?.code,
        shortName: data?.short_name,
        teamName: data?.name,
        picTeam: data?.pic_team,
        location: data?.location,
        city: data?.city,
      }));

      const matchedClub = optionsClubs?.find(
        (item) =>
          item?.value === (data?.club_id === defaultID0 ? "" : data?.club_id)
      );
      setSelectedClub({
        label: data?.club_code + " - " + data?.club_name,
        value: data?.club_id,
      });
      const matchedPIC = optionsPIC?.find(
        (item) => item?.value === data?.pic_id
      );

      setSelectedPicTeam(matchedPIC);

      const matchedAgeGroup = optionsAgeGroups?.find(
        (item) => item?.value === data?.age_group_id
      );

      setSelectedAgeGroup({
        label: data?.age_group + "  " + data?.age_group_gender,
        value: data?.age_group_id,
      });
    }
  }, [data, setFormInput]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ["teamName", "picTeam", "location"];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== "") {
        if (errors[field].type === "required") {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue("teamName", data?.name);
      setValue("picTeam", data?.pic_team);
      setValue("shortName", data?.short_name);
      setValue("picTelephone", data?.pic_team_phone);
      setValue("picEmail", data?.pic_team_email);
      setValue("location", data?.location);
      setValue("city", data?.city);
    }
  }, [data, setFormInput, setValue]);

  useEffect(() => {
    setFormInput((prevFormInput) => ({
      ...prevFormInput,
      picEmail: selectedPicTeam?.email || "-",
      picTelephone: selectedPicTeam?.phone || "-",
    }));
  }, [selectedPicTeam]);

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
    <>
      <form
        className="w-full min-h-[500px]"
        onSubmit={handleSubmit(handleUpdate)}
      >
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
          <Input
            type="text"
            label="Team Code"
            name="teamCode"
            value={formInput.teamCode}
            onChange={handleChange}
            disabled
          />
          <div className="z-50">
            <SelectCustom
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
            <SelectCustom
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
            disabled={!isAccess?.can_edit}
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

          <div className="z-[35] sm:z-40 relative">
            <SelectDropdown
              name="picTeam"
              data={optionsPIC}
              label="PIC Team"
              placeholder="PIC Team"
              selectedValue={selectedPicTeam?.value}
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
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          <Button
            background="red"
            className={`w-32 ${isAccess?.can_delete ? "" : "hidden"}`}
            disabled={isLoading ? true : false}
            onClick={() => setIsOpenPopUpDelete(true)}
          >
            {isLoading ? <LoaderButtonAction /> : "Delete"}
          </Button>
          <Button
            type="submit"
            background="black"
            className={`w-32 ${isAccess?.can_edit ? "" : "hidden"}`}
            disabled={isLoading ? true : false}
          >
            {isLoading ? <LoaderButtonAction /> : "Save"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormDetailTeamMaster;

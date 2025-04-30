import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Button, LoaderButtonAction } from "@/components";
import {
  Input,
  MultiSelectCustom,
  SelectDropdown,
  SelectInput,
} from "@/components/form-input";
import { useUpdateRosterListMutation } from "@/services/api/eventsApiSlice";
import { toast } from "react-toastify";
import { Paragraph } from "@/components/typography";
import { MdVerified } from "react-icons/md";
import SelectInputUser from "@/components/form-input/SelectInputUser";
import {
  useGetSingleCustomerDataQuery,
  useSingleCustomerDataQuery,
} from "@/services/api/customerDataApiSlice";

const validationSchema = yup
  .object({
    jerseyNumber: yup
      .number()
      .typeError("Jersey is must be a number")
      .required("Jersey is a required field")
      .nullable(),
  })
  .required();

const FormDetailRosterList = (props) => {
  const {
    data,
    setOpenModal,
    optionsTeams,
    optionsCustomers,
    setIsOpenPopUpDelete,
    isAccess,
    isAdmin,
    disableRoster,
    eventGroupID,
    mainPosition,
    optionsOfficials,

    setPageOptionCustomerData,
    totalPageOptionCustomerData,
    setSearchQueryOptionCustomerData,
  } = props;

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({});
  const [selectedOfficials, setSelectedOfficials] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [errorMessageJersey, setErrorMessageJersey] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPositionError, setSelectedPositionError] = useState("");
  const [selectedCaptain, setSelectedCaptain] = useState("");
  const [selectedCaptainError, setSelectedCaptainError] = useState("");
  const [defaultCustomer, setDefaultCustomer] = useState("0");

  const [optionsCustomersList, setOptionsCustomersList] = useState(optionsCustomers);


  useEffect(() => {
    setOptionsCustomersList(optionsCustomers)
  },[optionsCustomers])
  const { data: customerData, isLoading: isLoadingCustomerData } =
    useGetSingleCustomerDataQuery({
      id: data?.user_id,
    },
    {
      skip: !data?.user_id,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (customerData?.data) {
      const findCustomer = optionsCustomersList.find(
        (item) => item.value === customerData.data.id
      );
      if (!findCustomer) {
        const newCustomer = {
          value: customerData.data.id,
          label: `${customerData.data?.code} ${
            customerData.data?.name ? `- ${customerData.data?.name}` : ""
          }`,
        };
        setOptionsCustomersList([...optionsCustomersList, newCustomer]);
      }

      setDefaultCustomer(findCustomer ? findCustomer.value : "0");
    }
  }, [customerData, optionsCustomersList]);

  const initialInputValue = {
    id: "",
    team_id: "",
    event_group_id: "",
    jersey: "",
    mainposition: "",
    captain: "",
    customer_id: yup.string().nullable(),
  };
  const [formInput, setFormInput] = useState(initialInputValue);

  const [updateRosterList, { isLoading, error: errServer }] =
    useUpdateRosterListMutation();

  const handleUpdate = async () => {
    try {
      let position = selectedPosition ? selectedPosition : "";
      if (selectedPosition && !mainPosition?.some(pos => pos.id === selectedPosition)) {
        position = '';
      }
      let updateData = {
        id: data?.id,
        event_group_id: data?.event_group_id,
        team_id: data?.team_id,
        // customer_id: selectedCustomer?.value === "N/A" ? "" : selectedCustomer?.value ? selectedCustomer?.value : selectedCustomer,
        customer_id: selectedCustomer?.value
          ? selectedCustomer?.value
          : defaultCustomer,
        jersey: formInput.jersey,
        captain: selectedCaptain === "true" ? true : false,
        mainposition: position,
        officials: data?.officials ? data?.officials : [],
      };

      const response = await updateRosterList(updateData).unwrap();

      if (!response.error) {
        setOpenModal(false);
        const matchedTeam = optionsTeams?.find(
          (item) => item.value === selectedTeam
        );
        const matchedCustomer = optionsCustomersList?.find(
          (item) => item.value === selectedCustomer?.value
        );
        setGetDetailUpdated({
          jersey: formInput.jersey,
          team: matchedTeam?.label,
          customer: matchedCustomer?.label,
          // customer: {
          //   label: 'C-07695 - Oliver Matthewshington Pratna',
          //   value: 'f0a5944c6a815b7bb44323d783eede4d',
          // },
        });

        toast.success(`Data has been updated!`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (err) {
      console.error(err);

      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    }
  };

  useEffect(() => {
    if (data) {

      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        id: data?.id,
        team_id: data?.team_id,
        event_group_id: data?.event_code,
        jersey: data?.jersey_number,
        mainposition: data?.mainposition,
        customer_id: data?.user_id,
        captain: data?.captain,
      }));
      setSelectedTeam(data?.team_id);
      setSelectedCustomer(data?.user_id);
      setSelectedCaptain(data?.captain);
      setSelectedPosition(data?.mainposition);
      if (data?.officials) {
        const matchedOptions = optionsOfficials?.filter((option) =>
          data?.officials?.find((official) => official?.id === option?.value)
        );

        if (matchedOptions?.length > 0) {
          setSelectedOfficials(matchedOptions[0].value);
        }
      }
    }
  }, [data, setFormInput]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ["jerseyNumber"];
    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== "") {
        clearErrors(field);
      }
    });
  }, [formInput, clearErrors, errors]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue("rosterCode", data?.id);
      setValue("event_group_id", data?.event_code);
      setValue("jerseyNumber", data?.jersey_number);
      // setValue('customer_id', data?.user_id);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeJerseyNumber = (e) => {
    const { name, value } = e.target;

    const numericValue = value.replace(/[^0-9]/g, "");
    const limitedValue = numericValue.slice(0, 2);

    if (limitedValue.length === 1 && limitedValue !== "0") {
      setErrorMessageJersey(`Must be 2-digit number, e.g., '0${value}'`);
    } else if (limitedValue.length > 2) {
      setErrorMessageJersey("");
    } else {
      setErrorMessageJersey("");
    }

    setFormInput((prevData) => ({
      ...prevData,
      [name]: limitedValue,
    }));
  };

  const isEditDisabled =
    !isAccess?.can_edit || !isAdmin ? disableRoster : false;
  const isDeleteDisabled =
    isAccess?.can_delete && eventGroupID && (isAdmin || !disableRoster);
  const positionData = mainPosition?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const shortCustomer = optionsCustomersList?.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.value === item.value)
  );
  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Roster ID</h5>
          <Paragraph loading={isLoading}>{data?.code || "-"}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code</h5>
          <Paragraph loading={isLoading}>{data?.event_code || "-"}</Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Team</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.team || data?.team || "-"}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Jersey</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.jerseyNumber || data?.jersey_number || "-"}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">User</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.customer || data?.user || "-"}
          </Paragraph>
        </div>
        {/* <div className="flex flex-col gap-2 capitalize">
          <h5 className="font-bold">Status</h5>
          {data?.doc_verified === 'verified' ? (
            <span className="flex items-center gap-0.5 bg-ftgreen-600 text-white py-1 px-2.5 font-medium rounded-full max-w-min text-sm">
              <MdVerified className="text-lg" /> {data?.doc_verified || '-'}
            </span>
          ) : (
            <span className="text-ftbrown font-medium">
              {data?.doc_verified || '-'}
            </span>
          )}
        </div> */}
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
          <Input
            type="text"
            label="Roster ID"
            name="rosterCode"
            value={data?.code}
            onChange={handleChange}
            disabled
          />

          <Input
            type="text"
            label="Group Code"
            name="event_group_id"
            value={formInput.event_group_id}
            onChange={handleChange}
            errCodeServer="x01000"
            errServer={errServer?.data}
            disabled
          />

          <SelectInput
            name="team"
            data={optionsTeams}
            placeholder="Select Team"
            label="Team"
            selectedValue={selectedTeam}
            setSelectedValue={setSelectedTeam}
            errServer={errServer?.data}
            errCodeServer="x08003"
            disabled={isEditDisabled}
          />
          <div className="z-[12]">
            {/* <p className="text-sm text-gray-500 ">Position</p> */}
            <SelectInput
              name="captain"
              data={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
              placeholder="Captain"
              label="Captain"
              selectedValue={selectedCaptain}
              setSelectedValue={setSelectedCaptain}
              errValidation={errors}
              register={register}
            />
            <p className="text-[10px] text-red-600 animate-pulse min-h-5">
              {selectedCaptainError && selectedCaptainError}
            </p>
          </div>
          <div className="w-full">
            <Input
              type="text"
              label="Jersey Number"
              name="jersey"
              value={formInput.jersey}
              onChange={handleChangeJerseyNumber}
              disabled={true}
              errValidation={errors}
              register={register}
            />
            {errorMessageJersey && (
              <p className="text-[10px] text-red-600 animate-pulse">
                {errorMessageJersey}
              </p>
            )}
          </div>
          <div className="z-[12]">
            <p className="text-sm text-gray-500 ">Position</p>
            <SelectInput
              name="mainposition"
              data={positionData}
              placeholder="Position"
              label=""
              selectedValue={selectedPosition}
              setSelectedValue={setSelectedPosition}
              errValidation={errors}
              register={register}
            />
            <p className="text-[10px] text-red-600 animate-pulse min-h-5">
              {selectedPositionError && selectedPositionError}
            </p>
          </div>

         <SelectDropdown
  name="customer_id"
  data={shortCustomer}
  placeholder="Select User"
  label="User"
  selectedValue={selectedCustomer}
  setSelectedValue={setSelectedCustomer}
  errServer={errServer?.data}
  errCodeServer="x08004"
  infiniteScroll
  setPageOption={setPageOptionCustomerData}
  setSearchQueryOption={setSearchQueryOptionCustomerData}
  totalPageOptions={totalPageOptionCustomerData}
/>
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isDeleteDisabled && (
            <Button
              background="red"
              className="w-32"
              disabled={isLoading}
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              {isLoading ? <LoaderButtonAction /> : "Delete"}
            </Button>
          )}
          {isAccess?.can_edit && (
            <Button
              type="submit"
              background="black"
              className={`w-32 `}
              disabled={isLoading}
            >
              {isLoading ? <LoaderButtonAction /> : "Save"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailRosterList;

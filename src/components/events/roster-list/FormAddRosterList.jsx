import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Input,
  SelectDropdown,
  SelectInput,
} from "@/components/form-input";
import { Button, LoaderButtonAction } from "@/components";
import { useAddNewRosterListMutation } from "@/services/api/eventsApiSlice";
import { useDispatch } from "react-redux";

import SelectInputUser from "@/components/form-input/SelectInputUser";

const validationSchema = yup
  .object({
    jerseyNumber: yup
      .number()
      .typeError("must be a number")
      .required("Jersey number is required")
      .nullable(),
    // captain: yup.string().required('Captain is required'),
    // position: yup.string().required('Position is required'),
    // customerID: yup.string().required('User is required'),
  })
  .required();

const FormAddRosterList = (props) => {
  const {
    optionsTeams,
    setIsOpenNewData,
    optionsCustomers,
    rosterCode,
    eventGroupID,
    eventGroupData,
    filterSelectedRosterTeam,
    mainPosition,

    setPageOptionCustomerData,
    totalPageOptionCustomerData,
    setSearchQueryOptionCustomerData,
  } = props;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();
  const selectedTeamData = optionsTeams.find(
    (item) => item.value === filterSelectedRosterTeam
  );
  const [selectedCaptain, setSelectedCaptain] = useState(false);
  const [selectedCaptainError, setSelectedCaptainError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedCustomerError, setSelectedCustomerError] = useState("");
  const [errorMessageJersey, setErrorMessageJersey] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedPositionError, setSelectedPositionError] = useState("");
  const eventCode = eventGroupData?.find(
    (item) => item?.id === eventGroupID
  )?.code;
  const teamCode = optionsTeams?.find(
    (item) => item?.value === filterSelectedRosterTeam
  )?.label;

  const initialInputValue = {
    rosterCode: "",
    eventGroupID: "",
    teamID: "",
    jerseyNumber: "",
    customerID: "",
  };

  const [formInput, setFormInput] = useState(initialInputValue);

  const [addNewRosterList, { isLoading, error: errServer }] =
    useAddNewRosterListMutation();
  const positionData = mainPosition?.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const handleOnSubmit = async () => {
    // Show error if jersey number validation fails
    let isValid = true;
    if (errorMessageJersey) {
      toast.error(`Failed: Jersey Number ${errorMessageJersey}`, {
        position: "top-right",
        theme: "light",
      });
      return;
    }

    // if (!selectedPosition) {
    //   setSelectedPositionError('Position is required');
    //   isValid = false;
    // } else {
    //   setSelectedPositionError('');
    // }
    // Prepare the form data
    let jerseyNumber = formInput.jerseyNumber.toString().padStart(2, "0");
    if (!isValid) return; //  Prevent submission if there are validation errors
    try {
      const newData = {
        event_group_id: eventGroupID,
        team_id: selectedTeamData?.value,
        customer_id: selectedCustomer.value || "",
        jersey: jerseyNumber,
        mainposition: selectedPosition,
        captain: selectedCaptain,
      };

      // Send data via mutation
      const response = await addNewRosterList(newData).unwrap();

      // Handle success response
      if (!response.error) {
        reset(); // Reset form after success
        setFormInput(initialInputValue); // Clear the form input
        setSelectedCaptain("");
        setSelectedCustomer("");
        setSelectedPosition("");
        setIsOpenNewData(false); // Close the modal or form section

        toast.success("Roster has been added successfully!", {
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

  useEffect(() => {
    console.log("selectedCaptain", selectedCaptain);
  }, [selectedCaptain]);

  const handleCancel = () => {
    reset();
    setSelectedCaptain("");
    setSelectedCustomer("");
    setIsOpenNewData(false);
  };
  console.log(
    "selectedCustomer",
    selectedCustomer,
    selectedPosition,
    selectedCaptain
  );
  return (
    <tr className="border-b border-gray-200">
      {/* Form fields */}
      <td className="min-w-40 max-w-40 text-left px-6 pt-4 pb-0 text-gray-500 ">
        {eventCode}
        <p className="block min-h-5"></p>
      </td>
      <td className="text-left max-w-40 px-6 pt-4 pb-0 text-gray-500">
        {teamCode}
        <p className="block min-h-5"></p>
      </td>
      <td className="min-w-40 max-w-40  text-left px-6 pt-4 pb-0 text-gray-500">
        {rosterCode}

        <p className="block min-h-5"></p>
      </td>
      <td className="min-w-40 max-w-40  text-left px-6 pt-4 pb-0 text-gray-500">
        <div className="w-full">
          <Input
            type="text"
            label=""
            name="jerseyNumber"
            value={formInput.jerseyNumber}
            onChange={handleChangeJerseyNumber}
            errValidation={""}
            register={register}
            placeholder="Jersey N0"
            inputMode="numeric"
          />

          <p className="text-[10px] text-red-600 animate-pulse min-h-5">
            {errors.jerseyNumber && errors.jerseyNumber.message}
          </p>
        </div>
      </td>

      {/* Captain Selection */}
      <td className="min-w-40 max-w-40  text-left px-6 pt-4 pb-0 text-gray-500">
        <div className="z-[12]">
          <SelectInput
            name="captain"
            data={[
              { label: "Yes", value: true },
              { label: "No", value: false },
            ]}
            placeholder="Captain"
            label=""
            selectedValue={selectedCaptain}
            setSelectedValue={setSelectedCaptain}
            errValidation={errors}
            register={register}
          />
          <p className="text-[10px] text-red-600 animate-pulse min-h-5">
            {selectedCaptainError && selectedCaptainError}
          </p>
        </div>
      </td>

      {/* Position Selection */}
      <td className="text-left px-6 pt-4 pb-0 text-gray-500">
        <div className="z-[12]">
          <SelectInput
            name="position"
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
      </td>

      {/* User Selection */}
      <td className="min-w-48 max-w-48 text-left px-6 pt-4 pb-0 text-gray-500">
        <div className="z-[11]">
          <SelectDropdown
            name="customerID"
            data={optionsCustomers}
            placeholder="Select User"
            label=""
            selectedValue={selectedCustomer}
            setSelectedValue={setSelectedCustomer}
            errServer={errServer?.data}
            errCodeServer="x08004"
            infiniteScroll
            setPageOption={setPageOptionCustomerData}
            setSearchQueryOption={setSearchQueryOptionCustomerData}
            totalPageOptions={totalPageOptionCustomerData}
          />
          <p className="text-[10px] text-red-600 animate-pulse min-h-5">
            {selectedCustomerError && selectedCustomerError}
          </p>
        </div>
      </td>

      {/* Save & Cancel buttons */}
      <td className="text-left px-6 pt-4 pb-5 text-gray-500 flex gap-2">
        <Button
          background="red"
          disabled={isLoading ? true : false}
          onClick={handleCancel}
        >
          {isLoading ? <LoaderButtonAction /> : "Cancel"}
        </Button>
        <Button
          type="submit"
          background="black"
          onClick={handleSubmit(handleOnSubmit)}
        >
          {isLoading ? <LoaderButtonAction /> : "Save"}
        </Button>
      </td>
    </tr>
  );
};

export default FormAddRosterList;

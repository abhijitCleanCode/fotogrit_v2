import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// form related imports
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { add_new_organization_type_schema } from "./schemaValidation";
// components
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
import { ButtonIcon } from "../abhijit-component";
import { useAddNewOrganizationTypeMutation } from "@/services/api/generalSettingOrganizationTypeApiSlice";

const AddNewOrganizationForm = (props) => {
  const { switchView, isConfirm, setIsConfirm, serverErrors } = props;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(add_new_organization_type_schema),
    mode: "onChange", // Validate on change
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [addNewOrganizationType] = useAddNewOrganizationTypeMutation();

  useEffect(() => {
    if (isConfirm) {
      handleFormSubmit();
    }
  }, [isConfirm]);
  const handleFormSubmit = async (data) => {
    console.log("data :: ", data);

    setIsLoading(true);
    try {
      const formData = new FormData();

      // formData.append("code", data.code);
      formData.append("name", data.name);
      // formData.append("description", data.description);

      const response = await addNewOrganizationType(formData).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        reset();

        toast.success(`${data.name} has been added!`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Failed:", err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[52vh] p-4 mt-[32px] bg-white drop-shadow-md border-b border-gray-300 px-3 py-2">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 gap-4 sm:grid-cols-1 gap-y-2"
        noValidate
      >
        <FormInputAbhijit
          type="text"
          label="Organization Type Code"
          placeholder="OT001"
          {...register("code")}
          error={errors.code?.message || serverErrors?.code}
          autoComplete="off"
          autoFocus
          disabled={true}
          // value={formInput.name}
          // onChange={handleChange}
          // errServer={errServer?.data}
          // errCodeServer="x06052" // already exist
          // errValidation={errors}
          // register={register}
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

        <div className="absolute bottom-0 right-0 pb-2 mr-2 mt-4 flex justify-end item-end gap-4">
          <ButtonIcon type="button" onClick={() => {}} disabled={isSubmitting}>
            Cancel
          </ButtonIcon>
          <ButtonIcon
            type="submit"
            // disabled={!isValid || !isSubmitting}
            // isLoading={isSubmitting}
          >
            Add
          </ButtonIcon>
        </div>
      </form>
    </div>
  );
};

export default AddNewOrganizationForm;

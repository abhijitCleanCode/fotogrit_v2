import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// form related imports
import { useForm } from "react-hook-form";
import { edit_organization_type_schema } from "./schemaValidation";
import { useUpdateOrganizationTypeMutation } from "@/services/api/generalSettingOrganizationTypeApiSlice";
import { yupResolver } from "@hookform/resolvers/yup";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
import { ButtonIcon } from "../abhijit-component";

const EditOrganizationTypeForm = (props) => {
  const { switchView, onSubmit, serverErrors, selectedOrganizationType } =
    props;

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    control,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(edit_organization_type_schema),
    mode: "onChange", // Validate on change
    defaultValues: {
      code: selectedOrganizationType?.code || "",
      id: selectedOrganizationType?.id || "",
      name: selectedOrganizationType?.name || "",
      description: selectedOrganizationType?.description || "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [updateOrganizationType] = useUpdateOrganizationTypeMutation();

  const handleFormSubmit = async (data) => {
    console.log("data :: ", data);

    try {
      const formData = new FormData();

      formData.append("id", data.id);
      formData.append("name", data.name);
      // formData.append("description", data.description);

      const response = await updateOrganizationType(formData).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        reset();

        toast.success(`${data.name} has been updated!`, {
          position: "top-right",
          theme: "light",
        });

        // switchView("list");
      }
    } catch (error) {
      console.error("Failed:", err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
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
  );
};

export default EditOrganizationTypeForm;

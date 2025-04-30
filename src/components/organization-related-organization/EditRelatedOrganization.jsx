// form related imports
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { add_new_related_organization_schema } from "./schemaValidation";

import { ButtonIcon, DropDown } from "../abhijit-component";

import { IoIosArrowUp } from "react-icons/io";

const organizationOptions = [
  { value: "ngo", label: "Non-Profit Organization" },
  { value: "corp", label: "Corporation" },
  { value: "gov", label: "Government Agency" },
  { value: "edu", label: "Educational Institution" },
];

const EditRelatedOrganization = (props) => {
  const { switchView, onSubmit, serverErrors, setCurrentView } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(add_new_related_organization_schema),
    mode: "onChange", // Validate on change
    defaultValues: {
      code: "",
      relationship: "",
    },
  });

  const handleFormSubmit = async (data) => {
    console.log("data :: ", data);

    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.log("Submission error: ", error);
    }
  };

  return (
    <div className="mt-[32px] space-y-8">
      <ButtonIcon icon={IoIosArrowUp} iconPosition="left">
        Edit related organization
      </ButtonIcon>

      <div className="relative min-h-[52vh] p-4 mt-[32px] bg-white drop-shadow-md border-b border-gray-300 px-3 py-2">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 gap-4 sm:grid-cols-1 gap-y-2"
          noValidate
        >
          <DropDown label="Organization Code" options={organizationOptions} />
          <DropDown
            label="Organization Relationship"
            options={organizationOptions}
          />

          <div className="absolute bottom-0 right-0 pb-2 mr-2 mt-4 flex justify-end item-end gap-4">
            <ButtonIcon
              type="button"
              onClick={() => {
                setCurrentView("Delete_Relationship");
              }}
              // disabled={isSubmitting}
            >
              Delete
            </ButtonIcon>
            <ButtonIcon
              type="submit"
              // disabled={!isValid || !isSubmitting}
              // isLoading={isSubmitting}
            >
              Save
            </ButtonIcon>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRelatedOrganization;

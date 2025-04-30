import { useForm } from "react-hook-form";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
import { ButtonIcon } from "../abhijit-component";

const AddNewMembers = (props) => {
  const { switchView, onSubmit, serverErrors } = props;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    // resolver: yupResolver(add_new_organization_type_schema),
    mode: "onChange", // Validate on change
    defaultValues: {
      membership_code: "",
      user_code: "",
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
    <div className="relative min-h-[52vh] p-4 mt-[32px] bg-white drop-shadow-md border-b border-gray-300 px-3 py-2">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 gap-4 sm:grid-cols-1 gap-y-2"
        noValidate
      >
        <FormInputAbhijit
          type="text"
          label="Membership Code"
          placeholder="Auto"
          {...register("membership_code")}
          error={errors.code?.message || serverErrors?.code}
          autoComplete="off"
          autoFocus
        />
        <FormInputAbhijit
          type="text"
          label="User Code"
          placeholder="Auto"
          {...register("user_code")}
          error={errors.code?.message || serverErrors?.code}
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

export default AddNewMembers;

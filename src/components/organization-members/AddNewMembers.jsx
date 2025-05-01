import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
import { ButtonIcon } from "../abhijit-component";
import {
  useAddNewOrgMembersMutation,
  useGetUsersListQuery,
} from "@/services/api/orgMembersApiSlice";
import { SelectDropdown } from "../form-input";
import { toast } from "react-toastify";

const AddNewMembers = (props) => {
  const { switchView, onSubmit, serverErrors, selectedOrganization } = props;
  console.log(
    "addnewMembers :: selectedOrganization :: ",
    selectedOrganization?.value
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
    watch,
    control,
    clearErrors,
  } = useForm({
    // resolver: yupResolver(add_new_organization_type_schema),
    mode: "onChange", // Validate on change
    defaultValues: {
      org: selectedOrganization?.value || "",
      user: "",
    },
  });

  const [selectedMember, setSelectedMember] = useState("");

  const { data: users } = useGetUsersListQuery();
  const optionsUsers = users?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? ` ${item?.name}` : ""}`,
  }));

  const [addNewOrgMembers] = useAddNewOrgMembersMutation();
  const handleFormSubmit = async (data) => {
    data.org = selectedOrganization?.value || "";
    console.log("data :: ", data);

    try {
      const formData = new FormData();
      formData.append("org", data.org);
      formData.append("user", data.user);

      const response = await addNewOrgMembers(formData).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        reset();
        toast.success(`User has been added!`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Failed:", error);
      toast.error(`Failed: ${error?.data?.message}`, {
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
          label="Membership Code"
          placeholder="Auto"
          {...register("membership_code")}
          error={errors.code?.message || serverErrors?.code}
          disabled
        />
        <div className="[z-21]">
          <Controller
            control={control}
            name="user"
            render={({ field }) => {
              useEffect(() => {
                setSelectedMember(field.value);
              }, [field.value]);

              return (
                <SelectDropdown
                  field={field}
                  name="user"
                  data={optionsUsers}
                  label="User Code"
                  placeholder="Select User"
                  selectedValue={selectedMember}
                  setSelectedValue={(val) => {
                    console.log(val);
                    setSelectedMember(val?.value);
                    field.onChange(val?.value);
                  }}
                  error={errors.org_type?.message || serverErrors?.org_type}
                  setSearchQueryOption={() => {}}
                  infiniteScroll
                  setPageOption={() => {}}
                />
              );
            }}
          />
        </div>

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

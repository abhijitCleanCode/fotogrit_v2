// form related imports
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { add_new_related_organization_schema } from "./schemaValidation";

import { ButtonIcon, DropDown } from "../abhijit-component";

import { IoIosArrowUp } from "react-icons/io";
import { useEffect, useState } from "react";
import { SelectDropdown } from "../form-input";
import { useGetOrganizationListQuery } from "@/services/api/orgMainOrgApiSlice";
import { useAddOrgRelationMutation } from "@/services/api/orgRelatedOrgApiSlice";
import { toast } from "react-toastify";

const AddNewRelatedOrganization = (props) => {
  const {
    switchView,
    onSubmit,
    serverErrors,
    setIsOpenAddNewOrganization,
    parentOrganization,
  } = props;
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    control,
    clearErrors,
    reset,
  } = useForm({
    // resolver: yupResolver(add_new_related_organization_schema),
    mode: "onChange",
    defaultValues: {
      id: "",
      parent_org_id: parentOrganization.value,
    },
  });

  const [subSelectedOrg, setSubSelectedOrg] = useState("");
  const [organizationRelation, setOrganizationRelation] = useState("");

  const {
    data: organizationList,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrganizationListQuery({});
  const optionsOrganizationList = organizationList?.data?.orgs
    ?.filter((org) => org?.id !== parentOrganization.value)
    ?.map((org) => ({
      value: org,
      label: org?.name,
    }));
  if (Array.isArray(optionsOrganizationList)) {
    optionsOrganizationList.unshift({ value: "", label: "Select Parent" });
  }

  const relationOptions = [{ label: "Child", value: "Child" }];

  const [addOrgRelation] = useAddOrgRelationMutation({});
  const handleFormSubmit = async (data) => {
    data.parent_org_id = parentOrganization.value;
    console.log("data :: ", data);

    try {
      const formData = new FormData();
      formData.append("id", data.id?.id);
      formData.append("name", data.id?.name);
      formData.append("parent_org_id", data.parent_org_id);

      const response = await addOrgRelation(formData).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        reset();

        toast.success(`Organization Relation has been added!`, {
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
    <div className="mt-[32px] space-y-8">
      <div className="relative min-h-[52vh] p-4 mt-[32px] bg-white drop-shadow-md border-b border-gray-300 px-3 py-2">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 gap-4 sm:grid-cols-1 gap-y-2"
          noValidate
        >
          <div className="z-[21]">
            <Controller
              control={control}
              name="id"
              render={({ field }) => {
                const selectedOption = optionsOrganizationList?.find(
                  (opt) => opt.value === field.value
                );

                return (
                  <SelectDropdown
                    field={field}
                    name="id"
                    data={optionsOrganizationList}
                    label="Organization Code"
                    placeholder="Select Organization Code"
                    selectedValue={selectedOption} // Pass the full option object
                    setSelectedValue={(val) => {
                      console.log("val :: ", val);
                      field.onChange(val?.value); // Store only the value in form
                    }}
                    setSearchQueryOption={() => {}}
                    infiniteScroll
                    setPageOption={() => {}}
                  />
                );
              }}
            />
          </div>
          <div className="z-[21]">
            <Controller
              control={control}
              name="relation"
              render={({ field }) => {
                const selectedOption = relationOptions.find(
                  (opt) => opt.value === field.value
                );

                return (
                  <SelectDropdown
                    field={field}
                    name="relation"
                    data={[{ label: "Child", value: "Child" }]}
                    label="Organization Relationship"
                    placeholder="Select Relationship"
                    selectedValue={selectedOption}
                    setSelectedValue={(val) => {
                      field.onChange(val?.value);
                    }}
                    setSearchQueryOption={() => {}}
                    infiniteScroll={false}
                    setPageOption={() => {}}
                  />
                );
              }}
            />
          </div>

          <div className="absolute bottom-0 right-0 pb-2 mr-2 mt-4 flex justify-end item-end gap-4">
            <ButtonIcon
              type="button"
              onClick={() => {
                setIsOpenAddNewOrganization((prev) => !prev);
              }}
              // disabled={isSubmitting}
            >
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
    </div>
  );
};

export default AddNewRelatedOrganization;

//! abhijit changes
import { useState, useEffect } from "react";
// form related imports
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { add_new_organization_schema } from "./schemaValidation";
// components
import { PopUpDelete } from "..";
import { ButtonIcon } from "../abhijit-component";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
// icons
import { IoIosArrowUp } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";
import { SelectDropdown, UploadImage } from "../form-input";
import {
  useDeleteOrganizationMutation,
  useUpdateOrganizationMutation,
} from "@/services/api/orgMainOrgApiSlice";
import { toast } from "react-toastify";

const FileUploadField = ({ register, errors, setValue, watch }) => {
  const logo = watch("logo");
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setValue("logo", e.dataTransfer.files[0], { shouldValidate: true });
    }
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setValue("logo", e.target.files[0], { shouldValidate: true });
    }
  };
  const removeImage = () => {
    setValue("logo", null, { shouldValidate: true });
  };

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-500">
        Organization Logo
      </label>

      {logo ? (
        <div className="relative group">
          <img
            src={URL.createObjectURL(logo)}
            alt="Organization Logo Preview"
            className="w-full h-40 object-contain border rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove label"
          >
            <IoIosClose className="w-5 h-5 text-[#FA7275]" />
          </button>
        </div>
      ) : (
        <div
          className={`flex flex-col items-center justify-center border-2 ${
            dragActive ? "border-[#A67C52]" : "border-dashed border-gray-300"
          } rounded-lg p-4 w-full h-40 cursor-pointer transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label
            htmlFor="logo-upload"
            className="flex flex-col items-center justify-center space-y-2 cursor-pointer w-full h-full"
          >
            <div className="text-gray-400">
              <FiUploadCloud size={24} />
            </div>
            <div className="text-sm text-center">
              <span className="text-blue-600 font-medium">Click to upload</span>{" "}
              or drag and drop
              <br />
              <span className="text-xs text-gray-500">
                SVG, PNG, JPG or GIF (max 2MB)
              </span>
            </div>
            <input
              id="logo-upload"
              type="file"
              accept=".svg,.png,.jpg,.jpeg,.gif"
              className="sr-only"
              onChange={handleChange}
            />
          </label>
        </div>
      )}

      {/* Error message */}
      {errors.logo && (
        <p className="text-[#FA7275] text-sm mt-" role="alert">
          {errors.logo.message}
        </p>
      )}
    </div>
  );
};

// main form component
const FormEditOrganization = ({
  onSubmit,
  onCancel,
  isLoading = false,
  serverErrors,
  initialValues,
  optionsOrgTypes,
  optionsOrganizations,
  cities,
  setCurrentView,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    control,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(add_new_organization_schema),
    mode: "onChange",
    defaultValues: {
      id: initialValues.id || "",
      code: initialValues.code || "",
      name: initialValues.name || "",
      short_name: initialValues.short_name || "",
      legal_document_number: initialValues.legal_document_number || "",
      org_email: initialValues.org_email || "",
      org_type: initialValues.org_type || "",
      parent_org_id: initialValues.parent_org_id || "",
      city: initialValues.city || "",
      location: initialValues.location || "",
      pic: initialValues.pic || "",
      description: "",
      website: initialValues.website || "",
      instagram: initialValues.instagram || "",
      facebook: initialValues.facebook || "",
      tiktok: initialValues.tiktok || "",
      logo: initialValues.logo || "",
    },
  });

  const [isOpenPopUpDelete, setIsOpenPopUpDelete] = useState(false);

  const [selectedOrgType, setSelectedOrgType] = useState("");
  const [selectedCityValue, setSelectedCityValue] = useState("");
  const [selectedParentOrg, setSelectedParentOrg] = useState("");
  const [selectedOrgLogo, setSelectedOrgLogo] = useState("");
  const [errorImg, setErrorImg] = useState(null);

  const [updateOrganization] = useUpdateOrganizationMutation();
  const handleFormSubmit = async (data) => {
    console.log("edit org data :: ", data);

    try {
      const formData = new FormData();
      formData.append("id", data.id);
      formData.append("code", data.code);
      formData.append("name", data.name);
      formData.append("short_name", data.short_name);
      formData.append("legal_document_number", data.legal_document_number);
      formData.append("org_email", data.org_email);
      formData.append("org_type", data.org_type);
      formData.append("parent_org_id", data.parent_org_id);
      formData.append("city", data.city);
      formData.append("location", data.location);
      formData.append("pic", data.pic);
      formData.append("description", data.description);
      formData.append("website", data.website);
      formData.append("instagram", data.instagram);
      formData.append("facebook", data.facebook);
      formData.append("tiktok", data.tiktok);

      if (selectedOrgLogo) {
        formData.append("logo", selectedOrgLogo);
      }

      // If editing and no new logo was selected, keep the existing logo
      if (!selectedOrgLogo && initialValues.logo) {
        formData.append("logo", initialValues.logo);
      }

      const response = await updateOrganization(formData).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        reset();

        toast.success(`${data.name} has been updated!`, {
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
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        setErrorImg(null);
        setSelectedOrgLogo(file);
        setValue("logo", file); // Update react-hook-form value
        clearErrors("logo");
      } else {
        setErrorImg("Invalid file type. Please select an image.");
        setSelectedOrgLogo(null);
      }
    }
  };

  const [deleteOrganization] = useDeleteOrganizationMutation();
  const handleDelete = async () => {
    try {
      const response = await deleteOrganization({
        id: initialValues.id,
      }).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        toast.success(`${initialValues.name} has been deleted!`, {
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

  // social field protocols
  const [protocols, setProtocols] = useState({
    website: "https://",
    instagram: "https://",
    facebook: "https://",
    tiktok: "https://",
  });
  const handleSocialInputChange = (field, inputValue) => {
    const manualProtocol = inputValue.startsWith("http://")
      ? "http://"
      : inputValue.startsWith("https://")
      ? "https://"
      : null;

    const protocolToUse = manualProtocol || protocols[field] || "https://";

    const domain = inputValue.replace(/^https?:\/\//, "");

    setProtocols((prev) => ({
      ...prev,
      [field]: protocolToUse,
    }));

    setValue(field, protocolToUse + domain, { shouldValidate: true });
  };
  const getDomainOnly = (field) =>
    watch(field)?.replace(/^https?:\/\//, "") || "";

  return (
    <div className="mt-[32px]">
      <ButtonIcon
        icon={IoIosArrowUp}
        iconPosition="left"
        onClick={() => setCurrentView("All_Organizations_list")}
      >
        Edit Organization
      </ButtonIcon>
      <div className="space-y-8 relative min-h-[70vh] p-4 py-8 mt-8 bg-white shadow-lg rounded-md">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:grid-cols-1 gap-y-2"
          noValidate
        >
          {/* basic information */}
          <FormInputAbhijit
            type="text"
            label="Organization Code"
            placeholder="Enter Organization Code"
            {...register("code")}
            error={errors.code?.message || serverErrors?.code}
            autoComplete="off"
            autoFocus
          />
          <FormInputAbhijit
            type="text"
            label="Organization Name"
            placeholder="Enter Organization Name"
            {...register("name")}
            error={errors.name?.message || serverErrors?.name}
          />
          <FormInputAbhijit
            type="text"
            label="Organization Shortname"
            placeholder="Enter Organization Shortname"
            {...register("short_name")}
            error={errors.short_name?.message || serverErrors?.short_name}
          />
          <FormInputAbhijit
            type="text"
            label="Legal Document Number"
            placeholder="Enter Legal Document Number"
            {...register("legal_document_number")}
            // error={errors.legal_document_number?.message || serverErrors?.shortname}
          />
          <div className="z-[21]">
            <Controller
              control={control}
              name="org_type"
              render={({ field }) => {
                useEffect(() => {
                  setSelectedOrgType(field.label);
                }, [field.value]);
                return (
                  <SelectDropdown
                    field={field}
                    name="org_type"
                    data={optionsOrgTypes}
                    label="Organization Type"
                    placeholder="Select Organization Type"
                    selectedValue={selectedOrgType}
                    setSelectedValue={(val) => {
                      console.log(val);
                      setSelectedOrgType(val?.label);
                      field.onChange(val?.label);
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
          <div className="ms:z-10">
            <Controller
              control={control}
              name="parent_org_id"
              render={({ field }) => {
                useEffect(() => {
                  setSelectedParentOrg(field.value);
                }, [field.value]);
                return (
                  <SelectDropdown
                    field={field}
                    name="parent_org_id"
                    data={optionsOrganizations}
                    label="Parent Organization"
                    placeholder="Select Parent Organization"
                    selectedValue={selectedParentOrg}
                    setSelectedValue={(val) => {
                      setSelectedParentOrg(val?.label);
                      field.onChange(val?.value);
                    }}
                    error={errors.city?.message || serverErrors?.city}
                    setSearchQueryOption={() => {}}
                    infiniteScroll
                    setPageOption={() => {}}
                  />
                );
              }}
            />
          </div>
          <div className="ms:z-10">
            <Controller
              control={control}
              name="city"
              render={({ field }) => {
                useEffect(() => {
                  setSelectedCityValue(field.value);
                }, [field.value]);
                return (
                  <SelectDropdown
                    field={field}
                    name="city"
                    data={cities}
                    label="City"
                    placeholder="Select City"
                    selectedValue={selectedCityValue}
                    setSelectedValue={(val) => {
                      setSelectedCityValue(val?.label);
                      field.onChange(val?.value);
                    }}
                    error={errors.city?.message || serverErrors?.city}
                    setSearchQueryOption={() => {}}
                    infiniteScroll
                    setPageOption={() => {}}
                  />
                );
              }}
            />
          </div>
          <FormInputAbhijit
            type="text"
            label="Location"
            placeholder="Enter Organization Location"
            {...register("location")}
            error={errors.location?.message || serverErrors?.location}
          />
          <FormInputAbhijit
            type="text"
            label="Organization PIC"
            placeholder="Enter Organization PIC"
            {...register("pic")}
            error={errors.pic?.message || serverErrors?.pic}
          />
          <FormInputAbhijit
            type="text"
            label="Description"
            placeholder="Enter Organization Description"
            {...register("description")}
            error={errors.description?.message || serverErrors?.description}
          />

          {/* Social Media Fields */}
          {["website", "instagram", "facebook", "tiktok"].map((field) => (
            <div className="space-y-1" key={field}>
              <label className="text-sm font-medium text-gray-500 capitalize">
                {field}
              </label>
              <div className="flex border border-gray-400 rounded-md overflow-hidden shadow-sm">
                <span className="px-3 py-2 bg-gray-100 text-gray-500 text-sm border-r">
                  {protocols[field]}
                </span>
                <Controller
                  name={field}
                  control={control}
                  render={({ field: { ref, ...fieldProps } }) => (
                    <input
                      {...fieldProps}
                      type="text"
                      placeholder={
                        field === "website"
                          ? "airone.com"
                          : `${field}.com/username`
                      }
                      className="px-3 py-2 bg-white text-black outline-none focus:bg-gray-100 duration-200 w-full rounded-[0.5rem]"
                      value={getDomainOnly(field)}
                      onChange={(e) =>
                        handleSocialInputChange(field, e.target.value)
                      }
                    />
                  )}
                />
              </div>
              {errors[field] && (
                <p className="text-[#FA7275] text-sm mt-1">
                  {errors[field].message}
                </p>
              )}
            </div>
          ))}

          <div className="absolute bottom-0 right-0 pb-2 mr-2 mt-4 flex flex-col justify-end item-end gap-4">
            <UploadImage
              label="Organization Logo"
              name="logo"
              onChange={handleImageChange}
              selectedImage={selectedOrgLogo}
              setSelectedImage={setSelectedOrgLogo}
              errorImg={errorImg}
              setErrorImg={setErrorImg}
              accept="image/jpg,image/jpeg"
              height="h-28 sm:h-[168px]"
              objectFit="object-contain"
              errServer={serverErrors?.data}
              errCodeServer="xxx025"
            />
            {/* form action */}
            <div className="flex justify-end item-end gap-4">
              <ButtonIcon
                type="button"
                onClick={() => setIsOpenPopUpDelete(true)}
                variant="secondary"
                // disabled={isLoading}
              >
                Delete
              </ButtonIcon>
              <ButtonIcon
                type="submit"
                variant="primary"
                // disabled={!isValid || isLoading}
                // isLoading={isLoading}
              >
                Add
              </ButtonIcon>
            </div>
          </div>
        </form>
      </div>

      <PopUpDelete
        handleDelete={handleDelete}
        isLoading={isLoading}
        setIsOpenPopUpDelete={setIsOpenPopUpDelete}
        isOpenPopUpDelete={isOpenPopUpDelete}
        data={initialValues.name} // or organizationId if you prefer
        message="Are you sure you want to delete this organization?"
      />
    </div>
  );
};

export default FormEditOrganization;

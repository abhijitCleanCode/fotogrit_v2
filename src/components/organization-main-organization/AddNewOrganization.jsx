//! abhijit changes
import { useEffect, useState } from "react";
// form related imports
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { add_new_organization_schema } from "./schemaValidation";
// components
import { ButtonIcon } from "../abhijit-component";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
// icons
import { IoIosArrowUp } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";
import { SelectDropdown, UploadImage } from "../form-input";
import { useAddNewOrganizationMutation } from "@/services/api/orgMainOrgApiSlice";
import { toast } from "react-toastify";

const FileUploadField = ({ register, errors }) => {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-500">
        Organization Logo
      </label>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 w-full h-[160px] cursor-pointer hover:border-gray-400 transition">
        <label
          htmlFor="logo-upload"
          className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
        >
          <div className="text-gray-400">
            <span>
              <FiUploadCloud />
            </span>
          </div>
          <div className="text-sm text-center">
            <span className="text-[#A67C52]">Click to Upload</span> or drag and
            drop
            <br />
            <span className="text-xs text-gray-400">
              SVG, PNG, JPG or GIF (300x300)
            </span>
          </div>

          <input
            id="logo-upload"
            type="file"
            accept=".svg,.png,.jpg,.jpeg,.gif"
            className="sr-only"
            {...register("logo")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              setValue("logo", file, { shouldValidate: true });
            }}
          />
        </label>
      </div>

      {/* Error message */}
      {/* {errors.logo && (
        <p className="text-[#FA7275] text-sm mt-1">{errors.logo.message}</p>
      )} */}
    </div>
  );
};

const AddNewOrganization = (props) => {
  const {
    onSubmit,
    onCancel,
    isLoading = false,
    serverErrors,
    optionsOrgTypes,
    optionsOrganizations,
    cities,
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
    resolver: yupResolver(add_new_organization_schema),
    mode: "onChange",
    defaultValues: {
      // code: "",
      name: "",
      short_name: "",
      legal_document_number: "",
      org_email: "",
      org_type: "",
      parent_org_id: "",
      city: "",
      location: "",
      pic: "",
      description: "",
      website: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      logo: "",
    },
  });

  const [selectedOrgType, setSelectedOrgType] = useState("");
  const [selectedCityValue, setSelectedCityValue] = useState("");
  const [selectedParentOrg, setSelectedParentOrg] = useState("");
  const [selectedOrgLogo, setSelectedOrgLogo] = useState("");
  const [errorImg, setErrorImg] = useState(null);

  const [addNewOrganization] = useAddNewOrganizationMutation();
  const handleFormSubmit = async (data) => {
    console.log("create org data :: ", data);

    try {
      const formData = new FormData();
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

      const response = await addNewOrganization(formData).unwrap();
      console.log("response :: ", response);
      if (response.message === "success") {
        reset();

        toast.success(`${data.name} has been added!`, {
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
      }
    } else {
      setErrorImg("Invalid file type. Please select an image.");
      setSelectedOrgLogo(null);
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
    <div className="space-y-8 relative min-h-[70vh] p-4 py-8 mt-8 bg-white shadow-lg rounded-md">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 gap-4 sm:grid-cols-1 gap-y-2"
        noValidate
      >
        {/* basic Information */}
        <FormInputAbhijit
          type="text"
          label="Organization Code"
          placeholder="Auto"
          // {...register("code")}
          // error={errors.code?.message || serverErrors?.code}
          // autoComplete="off"
          // autoFocus
          disabled
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
          error={
            errors.legal_document_number?.message || serverErrors?.shortname
          }
        />
        <FormInputAbhijit
          type="text"
          label="Organization Email"
          placeholder="Enter Organization Email"
          {...register("org_email")}
          error={errors.org_email?.message || serverErrors?.shortname}
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
          error={errors.pic?.message || serverErrors?.PIC}
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
              onClick={onCancel}
              variant="secondary"
              disabled={isLoading}
            >
              Cancel
            </ButtonIcon>
            <ButtonIcon
              type="submit"
              variant="primary"
              // disabled={!isValid || isLoading}
              isLoading={isLoading}
            >
              Add
            </ButtonIcon>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewOrganization;

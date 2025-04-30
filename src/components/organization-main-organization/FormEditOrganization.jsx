//! abhijit changes
import { useState } from "react";
// form related imports
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { add_new_organization_schema } from "./schemaValidation";
// components
import { ButtonIcon } from "../abhijit-component";
import FormInputAbhijit from "../abhijit-component/FormInputAbhijit";
// icons
import { IoIosArrowUp } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi";

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

const SocialMediaInput = ({
  label,
  field,
  register,
  errors,
  watch,
  setValue,
}) => {
  const handleChange = (e) => {
    const { value } = e.target;
    const normalizeValue = value.startsWith("http")
      ? value
      : `https://${value}`;
    setValue(field, normalizeValue, { shouldValidate: true });
  };

  return (
    <div className="space-y-1">
      <label htmlFor={field} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <span className="px-3 py-2 bg-gray-100 text-gray-500 text-sm border-r">
          https://
        </span>
        <input
          id={field}
          type="text"
          {...register(field)}
          onChange={handleChange}
          placeholder={
            field === "instagram"
              ? "instagram.com/username"
              : field === "facebook"
              ? "facebook.com/username"
              : field === "tiktok"
              ? "tiktok.com/@username"
              : "yourdomain.com"
          }
          className="px-3 py-2 bg-white text-gray-900 outline-none w-full rounded-r"
          aria-describedby={`${field}-error`}
        />
      </div>
      {errors[field] && (
        <p
          id={`${field}-error`}
          className="text-[#FA7275] text-sm mt-1"
          role="alert"
        >
          {errors[field].message}
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
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(add_new_organization_schema),
    mode: "onChange",
    defaultValues: {
      code: "",
      name: "",
      shortname: "",
      type: "",
      city: "",
      location: "",
      pic: "",
      description: "",
      website: "",
      instagram: "",
      facebook: "",
      tiktok: "",
      logo: null,
    },
  });

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      setSubmitSuccess(true);
      // reset success message after 3 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleDelete = async () => {};

  const handleSocialInputChange = (field, value) => {
    setValue(field, value, { shouldValidate: true });
  };

  return (
    <div className="mt-[32px]">
      <ButtonIcon icon={IoIosArrowUp} iconPosition="left">
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
            {...register("shortname")}
            error={errors.shortname?.message || serverErrors?.shortname}
          />
          <FormInputAbhijit
            type="text"
            label="Organization Type"
            placeholder="Enter Organization Type"
            {...register("type")}
            error={errors.type?.message || serverErrors?.type}
          />
          <FormInputAbhijit
            type="text"
            label="City"
            placeholder="Enter Organization City"
            {...register("city")}
            error={errors.city?.message || serverErrors?.city}
          />
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

          {/* social media*/}
          <SocialMediaInput
            label="Website"
            field="website"
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <SocialMediaInput
            label="Instagram"
            field="instagram"
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <SocialMediaInput
            label="Facebook"
            field="facebook"
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <SocialMediaInput
            label="TikTok"
            field="tiktok"
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <div className="absolute bottom-0 right-0 pb-2 mr-2 mt-4 flex flex-col justify-end item-end gap-4">
            <FileUploadField
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
            {/* form action */}
            <div className="flex justify-end item-end gap-4">
              <ButtonIcon
                type="button"
                onClick={onCancel}
                variant="secondary"
                disabled={isLoading}
              >
                Delete
              </ButtonIcon>
              <ButtonIcon
                type="submit"
                variant="primary"
                disabled={!isValid || isLoading}
                isLoading={isLoading}
              >
                Add
              </ButtonIcon>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditOrganization;

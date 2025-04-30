import React, { useId } from "react";

const FormInputAbhijit = React.forwardRef(function FormInputAbhijit(
  {
    label,
    type = "text",
    placeholder = "",
    className = "",
    rounded = "rounded-[0.5rem]",
    value,
    onChange,
    error,
    ...props
  },
  ref
) {
  const id = useId();

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={id} className="text-gray-500">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`px-3 py-2 bg-white text-black outline-none focus:bg-gray-100 duration-200 border border-gray-400 w-full ${rounded} ${className}`}
        ref={ref} // This will give access of state of this component(input) to it's parent componend. That's why forwardRef is use
        {...props}
        id={id}
      />
      {error && (
        <p className="text-[#FA7275] text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default FormInputAbhijit;

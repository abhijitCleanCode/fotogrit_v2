import { useId, forwardRef } from "react";
import { Menu } from "@headlessui/react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

const DropDown = forwardRef(
  (
    {
      label,
      options,
      value,
      onChange,
      placeholder = "Select an option",
      className = "",
      rounded = "rounded-[0.5rem]",
      disabled = false,
      error,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const selectedOption = options.find((option) => option.value === value);

    return (
      <div className={`w-full space-y-2 ${className}`} ref={ref} {...props}>
        {label && (
          <label htmlFor={id} className="text-gray-500">
            {label}
          </label>
        )}

        <Menu as="div" className="relative">
          {({ open }) => (
            <>
              <Menu.Button
                id={id}
                disabled={disabled}
                className={`flex items-center justify-between w-full px-3 py-2 bg-white text-left text-black outline-none focus:bg-gray-100 duration-200 border ${
                  error ? "border-[#FA7275]" : "border-gray-400"
                } ${rounded} ${
                  disabled ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
                }`}
              >
                <span className={!selectedOption ? "text-gray-400" : ""}>
                  {selectedOption ? selectedOption.label : placeholder}
                </span>
                <FiChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Menu.Button>

              <Menu.Items
                className={`absolute z-10 mt-1 w-full bg-white shadow-lg border border-gray-200 ${rounded} max-h-60 overflow-auto focus:outline-none`}
              >
                <div className="py-1">
                  {options.map((option) => (
                    <Menu.Item key={option.value} disabled={option.disabled}>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => onChange?.(option.value)}
                          className={`flex items-center justify-between w-full px-3 py-2 text-left ${
                            active ? "bg-gray-100" : ""
                          } ${
                            option.disabled
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-gray-900"
                          }`}
                          disabled={option.disabled}
                        >
                          {option.label}{" "}
                          {value === option.value && (
                            <FiCheck className="w-4 h-4 ml-2" />
                          )}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </>
          )}
        </Menu>

        {error && <p className="text-[#FA7275] text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

export default DropDown;

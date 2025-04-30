import React from "react";

function ButtonIcon({
  children,
  type = "button",
  bgColor = "bg-[#A67C52]",
  textColor = "text-white",
  className = "",
  icon: Icon, // Renamed to uppercase to indicate it's a React component
  iconPosition = "left",
  ...props
}) {
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-[0.5rem] outline-none font-medium flex items-center justify-center gap-2 ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {Icon && iconPosition === "left" && (
        <Icon className="h-5 w-5" aria-hidden="true" />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

export default ButtonIcon;

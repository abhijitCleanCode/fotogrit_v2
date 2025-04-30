import React, { useEffect, useState } from "react";

// component re renders with new active tabs

// The Tabs component is the core that manages state and renders both the tab headers and content panels.
const Tabs = ({ children, defaultActiveTab, setDefaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(0); // Uses useState(0) to track active tab index (defaults to first tab)

  // Listens to defaultActiveTab prop changes via useEffect to update the active tab
  useEffect(() => {
    if (defaultActiveTab) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabActive = (index) => {
    setActiveTab(index); // update local state
    setDefaultActiveTab(index); // notify parent
  };

  return (
    <>
      {/* tab header stlying */}
      <div className="flex pt-1 bg-ftgreen-700 h-[50px] sm:justify-center items-center w-full overflow-x-auto">
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const { label } = child.props;
          return (
            // individual tab stlying
            <div
              key={index}
              className={`${
                activeTab === index ? "font-bold text-black" : "text-white "
              } text-[16px] cursor-pointer px-3 h-full w-full flex justify-center items-center transition-opacity duration-500 relative`}
              onClick={() => handleTabActive(index)}
            >
              {/* active tab indicator */}
              {index === activeTab && (
                <img
                  src="/images/union-tabs-2.png"
                  alt="bg tabs header"
                  className="absolute bottom-0 w-full h-full"
                />
              )}
              <span className="z-10 text-center text-[0.5rem] sm:text-xs md:text-sm lg:text-base px-2">
                {label}
              </span>
            </div>
          );
        })}
      </div>
      {/* content panel stlying */}
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return (
          // only the active panel content is shown
          <div key={index} hidden={activeTab !== index} className="p-3">
            {child.props.children}
          </div>
        );
      })}
    </>
  );
};

const Tab = ({ children }) => {
  return <>{children}</>;
};

const TabPanel = ({ children }) => {
  return <>{children}</>;
};

export { Tabs, Tab, TabPanel };

// children: The Tab components containing the content
// performance optimization:
// Uses React.Children.map and React.isValidElement for safe child iteration
// Only renders the active content panel (others are hidden)
// Efficient diffing with proper key assignment

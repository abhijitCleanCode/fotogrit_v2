import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const HorizontalScrollTabs = ({ tabLinks }) => {
  //   const navigate = useNavigate();
  //   const location = useLocation();
  const [activeTab, setActiveTab] = useState(0);

  // Syncing tab with URL
  //   useEffect(() => {
  //     const index = tabLinks.findIndex((tab) =>
  //       location.pathname.includes(tab.url)
  //     );
  //     setActiveTab(index >= 0 ? index : 0);
  //   }, [location.pathname, tabLinks]);

  //   const handleTabChange = (index) => {
  //     setActiveTab(index);
  //     navigate(tabLinks[index].url);
  //   };

  return (
    <div className="w-full">
      <Tabs defaultActiveTab={activeTab} setDefaultActiveTab={setActiveTab}>
        {tabLinks.map((tab, index) => (
          <Tab key={`tab-${tab.url}`} label={tab.name}>
            <TabPanel>
              <tab.component />
            </TabPanel>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
};

// this Tabs, tab and Tabpanel architecture is same as original component
const Tabs = ({ children, defaultActiveTab, setDefaultActiveTab }) => {
  const [activeTab, setActiveTab] = useState(0); // track currently active tab index

  // listen to defaultActiveTab prop changes via useEffect to update the active tab
  useEffect(() => {
    if (defaultActiveTab !== undefined) {
      setActiveTab(defaultActiveTab);
    }
  }, [defaultActiveTab]);

  const handleTabActive = (index) => {
    setActiveTab(index); // update local state
    setDefaultActiveTab && setDefaultActiveTab(index); // notify parent
  };

  return (
    <>
      {/* create a horizontal list of clickable tabs */}
      <div className="flex pt-1 sm:justify-center items-center w-full overflow-x-auto pb-2">
        {/* Loops through all the child components passed into this parent component. */}
        {React.Children.map(children, (child, index) => {
          // check if each child is a valid React element, if not, skip it
          if (!React.isValidElement(child)) return null;
          const { label } = child.props;
          // individual tab styling
          return (
            // create each tab button
            <div
              key={index}
              onClick={() => handleTabActive(index)}
              className={`cursor-pointer px-3 py-1.5 h-full w-full flex justify-center items-center transition-opacity duration-500 ${
                activeTab === index ? "border-b-2 border-[#A67C52]" : "" // add active-tab class only if this tab is the currently active one
              }`}
            >
              {label}
            </div>
          );
        })}
      </div>
      {/* loop through the children again to render the content */}
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        return (
          // only the active panel content is shown
          <div key={index} hidden={activeTab !== index} className="mt-[32px]">
            {child.props.children}
          </div>
        );
      })}
    </>
  );
};

const Tab = ({ children, label }) => {
  return <>{children}</>;
};

const TabPanel = ({ children }) => {
  return <>{children}</>;
};

export default HorizontalScrollTabs;

export { Tabs, Tab, TabPanel };

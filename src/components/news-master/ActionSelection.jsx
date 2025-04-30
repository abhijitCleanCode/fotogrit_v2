import React, { useState } from "react";
import { Button } from "@/components";
import { IoIosArrowForward } from "react-icons/io";
import { RiCloseLine } from "react-icons/ri";
import Select, { components } from "react-select";

// CustomModal.jsx
const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[99]">
      <div className="w-full flex justify-around items-center">
        <div className="bg-white px-4 rounded-lg shadow-lg relative z-[99]  w-[70vw] h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-4 pt-3 sticky top-0 bg-white z-[99]">
            <div className="flex items-center gap-2 ">
              <div className="flex items-center justify-center w-6 h-6 p-1 text-sm text-white bg-black rounded-md group">
                <IoIosArrowForward />
              </div>
              <h5 className="font-medium">Internal Page</h5>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center p-1 text-black bg-transparent rounded-md group text-lg bg-red-50 hover:bg-red-100 hover:text-red-600 transition-all duration-75 group absolute top-2 right-2"
            >
              <RiCloseLine />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const ActionSelection = ({
  actionType,
  setActionType,
  externalLink,
  setExternalLink,
  internalPageSelectData,
  selectedInternalPage,
  setSelectedInternalPage,
  selectedDropdownValues,
  setSelectedDropdownValues,
  inputValues,
  setInputValues,
  displaySelected,
  setDisplaySelected,
  selectedGroupId,
  setSelectedGroupId,
  eventCodeList,
  data,
  optionsUserList,
  selectedDropdownValues2,
  setSelectedDropdownValues2,
  eventGroupData,

  // user_code
  setPageOption,
  setSearchQueryOption,
  totalPageOptions,

  // event_code
  setPageEventGroupData,
  totalPageEventGroupData,
  setSearchQueryEventGroupData,

  // event_list
  setPageEventListData,
  totalPageEventListData,
  setSearchQueryEventListData,
}) => {
  const [isActionModalOpen, setActionIsModalOpen] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(100);

  const handleActionTypeChange = (value) => {
    setActionType(value);

    if (value === "internal") {
      setActionIsModalOpen(true);
    }
  };

  const handleExternalLinkChange = (e) => setExternalLink(e.target.value);

  const handleInternalPageChange = (e) => {
    const selectedPage = e.target.value;
    console.log("selectedPage", selectedPage);
    setSelectedInternalPage(selectedPage);
    setSelectedDropdownValues(selectedPage);
    setDisplaySelected(selectedPage);
  };

  const handleDropdownChange = (e, label) => {
    const value = e.target.value.trim();
    console.log("handleDropdownChange", label, value);

    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
    setSelectedGroupId(value);
    const groupName = eventCodeList?.find(
      (item) => item.value === value
    )?.label;
    const groupShortName = eventGroupData?.find(
      (item) => item.id === value
    )?.name;

    if (selectedInternalPage === label) {
      setDisplaySelected(
        `${label} ${groupName ? `| ${groupName}` : ""} ${
          groupShortName ? `| ${groupShortName}` : ""
        }`
      );
    }
    if (value == "Own Profile Page") {
      setDisplaySelected(value);
    }
    const selectUserData = optionsUserList?.find(
      (item) => item.value == value
    )?.label;
    const selectUserCode = selectUserData?.split("|")[0]?.trim();
    console.log(
      "selectUserData",
      selectUserData?.split("|")[0]?.trim(),
      selectedDropdownValues
    );
    if (selectedDropdownValues["Specific User Page"] == "Specific User Page") {
      setDisplaySelected(`Specific User Page | ${selectUserCode}`);
    }
  };
  const handleDropdownChangeSpecific = (e, label) => {
    const value = e.target.value.trim();
    console.log("handleDropdownChange", label, value);

    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
    setSelectedGroupId(value);
    const groupName = eventCodeList?.find(
      (item) => item.value === value
    )?.label;
    const groupShortName = eventGroupData?.find(
      (item) => item.id === value
    )?.name;

    if (selectedInternalPage === label) {
      setDisplaySelected(
        `${label} ${groupName ? `| ${groupName}` : ""} ${
          groupShortName ? `| ${groupShortName}` : ""
        }`
      );
    }
    if (value == "Own Profile Page") {
      setDisplaySelected(value);
    }
    const selectUserData = optionsUserList?.find(
      (item) => item.value == value
    )?.label;
    const selectUserCode = selectUserData?.split("|")[0]?.trim();

    if (label == "Specific User Page") {
      setDisplaySelected(`Specific User Page | ${selectUserCode}`);
    }
  };

  const handleDropdownChange2 = (e, label) => {
    const value = e.target.value;

    setSelectedDropdownValues2((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));

    setSelectedGroupId(value);

    if (selectedInternalPage === label) {
      setDisplaySelected(`${label} ${value ? `|${value}` : ""}`);
    }
    const selectUserData = optionsUserList?.find(
      (item) => item.value == value
    )?.label;
    const selectUserCode = selectUserData?.split("|")[0]?.trim();
    const eidValue =
      selectedDropdownValues["Search all my photos using face recognition"];
    const groupName = eventCodeList?.find(
      (item) => item.value === eidValue
    )?.label;

    if (label == "Search all my photos using face recognition") {
      setDisplaySelected(
        `Search all my photos using face recognition | ${groupName} | ${selectUserCode}`
      );
    }
  };

  const handleInputChange = (e, label) => {
    const value = e.target.value;
    setInputValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));

    // Update displaySelected with the new input value
    if (selectedInternalPage === label) {
      setDisplaySelected(`${label} | ${value}`);
    }
  };
  const handleSave = () => {
    setActionIsModalOpen(false);
  };

  const handleLoadMore = () => {
    setItemsToShow((prev) => prev + 100);
  };

  const CustomMenuList = (props) => {
    const { children } = props;
    return (
      <div>
        <components.MenuList {...props}>{children}</components.MenuList>
      </div>
    );
  };
  const handleSearchChange = (newValue) => {
    console.log("handleSearchChange", newValue);
    setPageOption(1);
    setSearchQueryOption(newValue);
  };
  const handleSearchChangeEventGroup = (newValue) => {
    console.log("handleSearchChange", newValue);
    setPageEventGroupData(1);
    setSearchQueryEventGroupData(newValue);
  };
  const handleSearchChangeEventList = (newValue) => {
    console.log("handleSearchChange", newValue);
    setPageEventListData(1);
    setSearchQueryEventListData(newValue);
  };
  return (
    <div className="flex-1   w-full min-w-[200px]">
      <div>Action When Clicked</div>
      <div className="mt-2">
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => handleActionTypeChange("external")}
            className={`w-5 h-5 bg-white rounded-full border border-gray-500 flex items-center justify-center`}
          >
            <div
              className={`w-3 h-3 bg-gray-500 rounded-full ${
                actionType === "external" ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>
          <div
            className={`pl-2 cursor-pointer ${
              actionType === "external" ? "bg-blue-100" : ""
            }`}
            onClick={() => handleActionTypeChange("external")}
          >
            External Link
          </div>
        </div>
        {actionType === "external" && (
          <input
            type="text"
            placeholder="Enter external link"
            className="border border-gray-300 rounded p-1 block text-sm  max-w-[200px] w-full mt-2"
            value={externalLink || data?.link_code}
            onChange={handleExternalLinkChange}
          />
        )}
      </div>
      <div className="mt-4">
        <div className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => handleActionTypeChange("internal")}
            className={`w-5 h-5 bg-white rounded-full border border-gray-500 flex items-center justify-center`}
          >
            <div
              className={`w-3 h-3 bg-gray-500 rounded-full ${
                actionType === "internal" ? "opacity-100" : "opacity-0"
              }`}
            ></div>
          </div>
          <div
            className={`pl-2 cursor-pointer ${
              actionType === "internal" ? "bg-blue-100" : ""
            }`}
            onClick={() => handleActionTypeChange("internal")}
          >
            Internal Page
          </div>
        </div>

        <CustomModal
          isOpen={isActionModalOpen}
          onClose={() => setActionIsModalOpen(false)}
        >
          {internalPageSelectData.map((item, index) => (
            <div key={index} className="flex flex-col gap-1 pb-3">
              <label className="text-[#595959] text-xs flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="internalPage"
                  value={item.label}
                  checked={selectedInternalPage == item.label}
                  onChange={handleInternalPageChange}
                />
                <p className="text-sm inline-block"> {item.label}</p>
              </label>
              {item.type === "Dropdown" &&
                item.value &&
                Array.isArray(item.value) &&
                (item.label === "Specific User Page" ? (
                  <>
                    <Select
                      // value={item.value.find(option => option.value === selectedDropdownValues[item.label]) || null}
                      onChange={(selectedOption) =>
                        handleDropdownChangeSpecific(
                          { target: { value: selectedOption.value } },
                          item.label
                        )
                      }
                      options={item.value}
                      isDisabled={selectedInternalPage !== item.label}
                      className="text-sm mt-0 w-full"
                      onInputChange={handleSearchChange}
                    />
                  </>
                ) : (
                  <Select
                    // value={item.value.find(option => option.value === selectedDropdownValues[item.label]) || null}
                    onChange={(selectedOption) =>
                      handleDropdownChange(
                        { target: { value: selectedOption.value } },
                        item.label
                      )
                    }
                    options={item.value}
                    isDisabled={selectedInternalPage !== item.label}
                    className="text-sm mt-0 w-full"
                    components={{ MenuList: CustomMenuList }}
                    label={item.label}
                    allOptions={item.value}
                    itemsToShow={itemsToShow}
                    onInputChange={handleSearchChangeEventGroup}
                  />
                ))}
              {item.type === "Input" && (
                <input
                  type="text"
                  placeholder="Enter value"
                  className="border border-gray-300 rounded py-1 px-2 block text-sm w-full"
                  value={inputValues[item.label] || ""}
                  onChange={(e) => handleInputChange(e, item.label)}
                  disabled={selectedInternalPage !== item.label}
                />
              )}

              {item.type === "Dropdown" &&
                item.value_two &&
                Array.isArray(item.value_two) &&
                selectedDropdownValues[item.label] && (
                  <Select
                    // value={item.value_two.find(option => option.value === selectedDropdownValues2[item.label]) || null}
                    onChange={(selectedOption) =>
                      handleDropdownChange2(
                        { target: { value: selectedOption.value } },
                        item.label
                      )
                    }
                    options={item.value_two}
                    isDisabled={selectedInternalPage !== item.label}
                    className="text-sm mt-0 w-full"
                    onInputChange={handleSearchChangeEventList}
                  />
                )}
            </div>
          ))}
          <div className="flex justify-end pb-4 mt-4 sticky bottom-0 bg-white">
            <Button
              type="button"
              background="blue"
              className="w-40"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </CustomModal>
      </div>
      {/* Display the selected internal page and value */}
      {actionType !== "external" && displaySelected && (
        <div className="mt-2 text-sm text-gray-700">
          Selected: {displaySelected}
        </div>
      )}
    </div>
  );
};

export default ActionSelection;

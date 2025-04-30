import React, { useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import Select, { components } from 'react-select';

const SelectInputUser = (props) => {
  const {
    label,
    placeholder,
    data = [],
    selectedValue,
    setSelectedValue,
    errServer,
    errCodeServer,
    disabled,
    infiniteScroll,
    setPageOption,
    setSearchQueryOption,
    totalPageOptions,
    isCreateNewData,
    setOpenCreateNewData,
    setIsEventNameChanged,
  } = props;

  const [displayedData, setDisplayedData] = useState(data.slice(0, 100)); // Start with 100 items
  const [allDataLoaded, setAllDataLoaded] = useState(false);

  const loadMoreData = () => {
    const newLength = displayedData.length + 100;
    if (newLength >= data.length) {
      setDisplayedData(data);
      setAllDataLoaded(true);
    } else {
      setDisplayedData(data.slice(0, newLength));
    }
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption?.value);
    setIsEventNameChanged(true);
  };

  const handleOpenNewData = () => {
    setSelectedValue('');
    setOpenCreateNewData(true);
  };

  const MenuList = (props) => {
    return (
      <components.MenuList {...props}>
        {props.children}
        {!allDataLoaded && (
          <div className="sticky bottom-0 bg-white ">
            <button
              type="button"
              className="p-2 px-3 flex flex-col items-center justify-center w-full text-white text-left bg-gray-400 hover:bg-ftbrown hover:text-white transition-all duration-100 font-medium "
            onClick={loadMoreData}
            >
              <div>Load More</div>
            <div className='xs'>({displayedData.length}/{data.length})</div>
            </button>
          </div>
        )}
        {isCreateNewData && (
          <button
            type="button"
            className="p-2 px-3 flex items-center justify-between w-full text-left hover:bg-ftbrown hover:text-white transition-all duration-100 font-medium text-ftbrown"
            onClick={handleOpenNewData}
          >
            Create New Data <FaCirclePlus />
          </button>
        )}
      </components.MenuList>
    );
  };

  const customStylesSelect = {
    control: (provided, state) => ({
      ...provided,
      border: 'none',
      outline: 'none',
      borderRadius: '12px',
      textTransform: 'capitalize',
      backgroundColor: disabled
        ? 'rgb(0 0 0 / 0.26);'
        : 'rgb(209 213 219 / 0.5)',
      boxShadow: 'inset 3px 3px 5px rgba(0, 0, 0, 0.15)',
      padding: '0px 3px 0px 0px',
      '&:hover': {
        border: 'none',
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      padding: '1px',
      margin: '0px 3px',
      borderRadius: '6px',
      cursor: 'pointer',
    }),
  };

  return (
    <div className="flex flex-col text-sm ">
      {label && <label className="text-gray-500 ">{label || 'Label'}</label>}
      <Select
        className="basic-single"
        classNamePrefix="select"
        name="color"
        value={data.find((option) => option.value === selectedValue)}
        options={displayedData}
        onChange={handleSelectChange}
        placeholder={placeholder}
        styles={customStylesSelect}
        isDisabled={disabled}
        onMenuScrollToBottom={infiniteScroll && loadMoreData}
        components={{ MenuList }}
      />
      {errServer?.status === errCodeServer ? (
        <span className="text-[10px] animate-pulse text-red-600">
          {errServer?.message}
        </span>
      ) : null}
    </div>
  );
};

export default SelectInputUser;

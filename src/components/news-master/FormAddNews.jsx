import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { DatePickerCustom, Input, UploadImage } from '@/components/form-input';
import { Button, LoaderButtonAction, Modal } from '@/components';
import CustomModal from '@/components/CustomModal';

import { useAddNewSponsorMutation } from '@/services/api/othersApiSlice';
import { useAddNewNewsMutation } from '@/services/api/newsApiSlice';
import { useGetEventListQuery } from '@/services/api/eventsApiSlice';
import ActionSelection from './ActionSelection';
import UploadImageNews from '../form-input/UploadImageNews';

const validationSchema = yup
  .object({
    // code: yup.string().required('Code is is a required field'),
    // start_date: yup.string().required('Start Date is is a required field'),
    // end_date: yup.string().required('End Date is is a required field'),
    // logo: yup.string().required('Upload News Image is is a required field'),
    // link: yup.string().required('External Link is is a required field'),
  })
  .required();

const FormAddNews = (
  { setOpenColapse,
    data,
    eventCodeList,
    actionType,
    setActionType,
    externalLink,
    setExternalLink,
    internalPageSelectData,
    selectedInternalPage,
    setSelectedInternalPage,
    selectedDropdownValues,
    setSelectedDropdownValues,
    displaySelected,
    setDisplaySelected,
    inputValues,
    setInputValues,
    selectedGroupId,
    setSelectedGroupId,
    optionsUserList,
    selectedDropdownValues2,
    setSelectedDropdownValues2,
    eventGroupData,
    // user_code
    setSearchQueryOptionCustomerData,
    totalPageOptionCustomerData,
    setPageOptionCustomerData,

    // event_code

    setPageEventGroupData,
    totalPageEventGroupData,
    setSearchQueryEventGroupData,

    // event_list
    setPageEventListData,
    totalPageEventListData,
    setSearchQueryEventListData,
  }) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });
  useEffect(() => {
    setActionType('')
    setSelectedInternalPage('')
    setSelectedDropdownValues({})
    setDisplaySelected('')
  }, [])
  const maxCode = data?.data?.reduce((max, item) => {
    return item.code.localeCompare(max) > 0 ? item.code : max;
  }, '');

  const [actionError, setActionError] = useState('');
  const newCode = maxCode ? `N${String(parseInt(maxCode.slice(1)) + 1).padStart(3, '0')}` : 'N001';


  const initialInputValue = {
    name: '',
    logo: null,
    link: '',
    start_date: '',
    end_date: '',
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);

  const [addNewNews, { isLoading, error: errServer }] =
    useAddNewNewsMutation();


  const [internalPage, setInternalPage] = useState('');

  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');


  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal visibility

  const handleOnSubmit = async () => {

    if (!formInput.start_date || !formInput.end_date) {
      toast.error(`Please fill in the start date and end date`, {
        position: 'top-right',
        theme: 'light',
      });
      return;
    }
    if (!selectedImage) {
      setErrorImg('Please select an image');
      return;
    }
    if (actionType === 'external' && !externalLink) {
      setActionError('Please fill in the external link')
      return;
    } else if (actionType === 'internal' && !displaySelected) {
      setActionError('Please select the internal page to fill in the value')
      return;
    }

    let internalPageLink;
    const selectLinkType = displaySelected && displaySelected.split('|')[0]?.trim();
    const selectLinkCode = displaySelected && displaySelected.split('|')[1]?.trim();
    const selectYTLink = displaySelected && displaySelected.split('|')[2]?.trim();
    if (actionType === 'internal') {
      if (selectLinkType == 'Event Group Results & Standing Webpage') {
        internalPageLink = `/event-details?c=${selectLinkCode}&u=1&etab=resultStanding`
      } else if (selectLinkType === 'Event Group Club & Players Webpage') {
        internalPageLink = `/event-details?c=${selectLinkCode}&u=1&etab=clubPlayer`
      } else if (selectLinkType === 'Event Group Schedule Webpage') {
        internalPageLink = `/event-details?c=${selectLinkCode}&u=1&etab=schedule`
      } else if (selectLinkType === 'Event Detail Media') {
        internalPageLink = `/media?eid=${selectLinkCode}`
      } else if (selectLinkType === 'Event Detail Boxscore') {
        internalPageLink = `/score?eid=${selectLinkCode}`
      } else if (selectLinkType === 'Event Detail Watch') {
        internalPageLink = `?yt=${selectYTLink}&ytEid=${selectLinkCode}`
      } else if (selectLinkType === 'Own Profile Page') {
        internalPageLink = `Own Profile Page`
      } else if (selectLinkType === 'Specific User Page') {
        internalPageLink = `/players?c=${selectLinkCode}&specific=true`
      }  else if (selectLinkType === 'Edit Profile' && selectLinkCode === 'Home') {
        internalPageLink = `Edit Profile | Home`
      } else if (selectLinkType === 'Edit Profile' && selectLinkCode === 'Edit profile visibility') {
        internalPageLink = `Edit Profile | Edit profile visibility`
      } else if (selectLinkType === 'Edit Profile' && selectLinkCode === 'Upload own documents') {
        internalPageLink = `Edit Profile | Upload own documents`
      } else if (selectLinkType === 'Search all my photos using face recognition') {
        // search_user_face?user_code=C-00295&eg_code=GC109
        internalPageLink = `/search_user_face&eg_code=${selectLinkCode}`
      } else {
        internalPageLink = ''
      }
    }
    try {
      const formData = new FormData();
      formData.append('code', maxCode);
      formData.append('image_news', formInput.logo);
      formData.append('start_date', new Date(formInput.start_date).toISOString()); // Add startDate in ISO 8601 format
      formData.append('end_date', new Date(formInput.end_date).toISOString());
      formData.append('link_type', actionType);     // Add link
      formData.append('link_code', actionType === 'external' ? externalLink : internalPageLink);     // Add link



      const response = await addNewNews(formData).unwrap();

      if (!response.error) {
        setFormInput(initialInputValue);
        reset();
        setOpenColapse(false);
        setActionType('');
        setExternalLink('');
        setSelectedInternalPage('');
        setDisplaySelected('');
        setSelectedDropdownValues({});
        setInputValues({});
        toast.success(`"${formInput.name}" has been added!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleStartDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      start_date: date,
      end_date: '',
    }));
  };

  const handleEndDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      end_date: date,
    }));
  };
  const handleCancel = () => {
    setFormInput(initialInputValue);
    setOpenColapse(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          logo: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    } else {
      setErrorImg('Please select an image.');
      setSelectedImage(null);
    }
  };

  const handleActionTypeChange = (e) => {
    const newActionType = e.target.value;
    setActionType(newActionType);

    // Open the modal if the internal action type is selected
    if (newActionType === 'internal') {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };

  const handleExternalLinkChange = (e) => {
    setExternalLink(e.target.value);
  };

  const handleInternalPageChange = (e) => {
    const selectedPage = e.target.value;
    setSelectedInternalPage(selectedPage);
    setSelectedDropdownValue(''); // Reset dropdown value when changing the radio selection

    // Update displaySelected with the selected page and its value
    const selectedValue = selectedDropdownValues[selectedPage] || '';
    setDisplaySelected(`${selectedPage} | ${selectedValue}`);
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

  const handleDropdownChange = (e, label) => {

    const value = e.target.value;
    setSelectedDropdownValues((prevValues) => ({
      ...prevValues,
      [label]: value,
    }));
    setSelectedGroupId(value)
    const groupName = eventCodeList?.find((item) => item.value === value)?.label;
    // Update displaySelected with the new dropdown value
    if (selectedInternalPage === label) {
      setDisplaySelected(`${label}   ${groupName ? `| ${groupName}` : ''}`);
    }
  };
  const handleDropdownChange2 = (e, label) => {

    const value = e.target.value;

    setSelectedGroupId(value)

    // Update displaySelected with the new dropdown value
    if (selectedInternalPage === label) {
      setDisplaySelected(`${label}   ${value ? `| ${value}` : ''}`);
    }
  };










  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['name'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);


  const dropdownData = [
    { label: 'EG0751', value: 'EG0751' },
    { label: 'EG0752', value: 'EG0752' },
    { label: 'EG0753', value: 'EG0753' }
  ];


  const handleSave = () => {

    setIsModalOpen(false);
  };

  useEffect(() => {
    if (data) {
      setFormInput((prevFormInput) => ({
        ...prevFormInput,

        name: newCode || '',
      }));
    }
  }, [data]);

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)}>
      <div className="flex  gap-4 gap-y-2">
        <div className='max-w-[80px] w-full'>
          <Input
            type="text"
            label="Code"
            name="code"
            value={maxCode}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled
          />
        </div>
        <div className='max-w-[200px] w-full min-w-[100px]'>
          <DatePickerCustom
            label="Start Date"
            name="start_date"
            value={formInput.start_date}
            onChange={handleStartDateChange}
            placeholder="Select Start Date"
            showMonthDropdown
            showYearDropdown
          // disabled={!isAccess?.can_edit}
          />
        </div>
        <div className='max-w-[200px] w-full min-w-[100px]'>
          <DatePickerCustom
            label="End Date"
            name="end_date"
            value={formInput.end_date}
            onChange={handleEndDateChange}
            placeholder="Select End Date"
            showMonthDropdown
            showYearDropdown
          // disabled={!isAccess?.can_edit}
          />
        </div>
        <div className="max-w-[230px] w-full min-w-[100px] h-[103px] aspect-[65/24] relative overflow-hidden">
          <UploadImageNews
            label="Upload News Image (65:24 ratio)"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            errorImg={errorImg}
            setErrorImg={setErrorImg}
            accept="image/jpg, image/jpeg"
            className="h-[103px]"
          />
        </div>


        <div className='max-w-[400px] w-full'>
          <ActionSelection
            actionType={actionType}
            setActionType={setActionType}
            externalLink={externalLink}
            setExternalLink={setExternalLink}
            internalPageSelectData={internalPageSelectData}
            selectedInternalPage={selectedInternalPage}
            setSelectedInternalPage={setSelectedInternalPage}
            selectedDropdownValues={selectedDropdownValues}
            setSelectedDropdownValues={setSelectedDropdownValues}
            inputValues={inputValues}
            setInputValues={setInputValues}
            displaySelected={displaySelected}
            setDisplaySelected={setDisplaySelected}
            selectedGroupId={selectedGroupId}
            eventCodeList={eventCodeList}
            setSelectedGroupId={setSelectedGroupId}
            optionsUserList={optionsUserList}
            selectedDropdownValues2={selectedDropdownValues2}
            setSelectedDropdownValues2={setSelectedDropdownValues2}
            eventGroupData={eventGroupData}

            // user_code
            setPageOption={setPageOptionCustomerData}
            setSearchQueryOption={setSearchQueryOptionCustomerData}
            totalPageOptions={totalPageOptionCustomerData}

            // event_code
            setSearchQueryEventGroupData={setSearchQueryEventGroupData}
            totalPageEventGroupData={totalPageEventGroupData}
            setPageEventGroupData={setPageEventGroupData}

            // event_list
            setSearchQueryEventListData={setSearchQueryEventListData}
            totalPageEventListData={totalPageEventListData}
            setPageEventListData={setPageEventListData}

          />
          <div className='mt-2'>
            <div className='text-sm text-red-500'>
              {actionError}
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <div className="flex justify-end w-full gap-4 py-2 mt-4 ">
            <Button
              background="red"
              className="w-40"
              disabled={isLoading}
              onClick={handleCancel}
            >
              {isLoading ? <LoaderButtonAction /> : 'Cancel'}
            </Button>
            <Button
              type="submit"
              background="black"
              className="w-40"
              disabled={isLoading}
            >
              {isLoading ? <LoaderButtonAction /> : 'Add'}
            </Button>
          </div>
        </div>
      </div>


    </form>
  );
};

export default FormAddNews;

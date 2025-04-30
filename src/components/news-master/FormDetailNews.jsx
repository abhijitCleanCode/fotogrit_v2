import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Paragraph } from '../typography';
import { Button, LoaderButtonAction } from '@/components';
import { DatePickerCustom, Input, UpdateImage } from '@/components/form-input';

import { useUpdateSponsorMutation } from '@/services/api/othersApiSlice';
import ActionSelection from './ActionSelection';
import { useUpdateNewsMutation } from '@/services/api/newsApiSlice';

// const validationSchema = yup
//   .object({
//     name: yup.string().required('Name is a required field'),
//   })
//   .required();

const FormDetailNews = (props) => {
  const {
    data,
    isAccess,
    setOpenModal,
    setIsOpenPopUpDelete,
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
    eventListData,
    selectedDropdownValues2,
    setSelectedDropdownValues2,
    eventGroupData,


      setSearchQueryOptionCustomerData,
    totalPageOptionCustomerData,
    setPageOptionCustomerData,
  } = props;

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    // resolver: yupResolver(),
  });
  console.log("eventCodeList", eventCodeList)
  const initialInputValue = {
    code: '',
    start_date: '',
    end_date: '',
    link_type: null,
    link_code: null,
    link_media: null,
  };
  // const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorImg, setErrorImg] = useState(null);
  const [formEventGroup, setFormEventGroup] = useState({

    code: data?.code,
    start_date: new Date(data?.start_date),
    end_date: new Date(data?.end_date),
    link_type: data?.link_type,
    link_code: data?.link_code,
    link_media: data?.link_media,

  });
  const [updateNews, { isLoading, error: errServer }] =
    useUpdateNewsMutation();

  const handleUpdate = async () => {
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
      } else if (selectLinkType === 'Edit Profile' && selectLinkCode === 'Home') {
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
      formData.append('id', data?.id);
      formData.append('code', data?.code);
      formData.append('start_date', new Date(formEventGroup.start_date).toISOString());
      formData.append('end_date', new Date(formEventGroup.end_date).toISOString());
      formData.append('link_type', actionType);
      formData.append('image_news', formEventGroup.image_news);
      formData.append('link_code', actionType === 'external' ? externalLink : internalPageLink);     // Add link

      const response = await updateNews(formData).unwrap();

      if (!response.error) {
        setOpenModal(false);
        toast.success(`"${formEventGroup.code}" has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
        setActionType('');
        setExternalLink('');
        setSelectedInternalPage('');
        setDisplaySelected('');
        setSelectedDropdownValues({});
        setInputValues({});
      }
    } catch (err) {
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const findEventValue = (linkCode) => {
    const eventValue = eventCodeList?.find((item) => item.label == linkCode)?.value;
    return eventValue;
  }
  const findEventIDValue = (linkCode) => {
    const eventValue = eventListData?.find((item) => item.label == linkCode)?.value;
    return eventValue;
  }
  useEffect(() => {
    if (data) {
      setFormEventGroup((prevFormInput) => ({
        ...prevFormInput,
        code: data?.code,
        start_date: new Date(data?.start_date),
        end_date: new Date(data?.end_date),
        link_type: data?.link_type,
        link_code: data?.link_code,
        link_media: data?.link_media,
      }));
    }
    if (data?.link_type.trim() === 'internal') {
      setActionType('internal')



    }
    let displaySelectedText;
    if (data?.link_type.trim() == 'internal' && data?.link_code.includes('schedule')) {
      const gcValue = data?.link_code.split('GC')[1].split('&')[0];
      setActionType('internal')
      setSelectedInternalPage(`Event Group Schedule Webpage`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Event Group Schedule Webpage`]: findEventValue(`GC${gcValue}`),
      }));
      setDisplaySelected(`Event Group Schedule Webpage | GC${gcValue}`)

    } else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('resultStanding')) {
      const gcValue = data?.link_code.split('GC')[1].split('&')[0];
      setActionType('internal')
      setSelectedInternalPage(`Event Group Results & Standing Webpage`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Event Group Results & Standing Webpage`]: findEventValue(`GC${gcValue}`),
      }));
      setDisplaySelected(`Event Group Results & Standing Webpage| GC${gcValue}`)
    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('clubPlayer')) {
      const gcValue = data?.link_code.split('GC')[1].split('&')[0];
      setActionType('internal')
      setSelectedInternalPage(`Event Group Club & Players Webpage`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Event Group Results & Standing Webpage`]: findEventValue(`GC${gcValue}`),
      }));
      setDisplaySelected(`Event Group Results & Standing Webpage| GC${gcValue}`)
    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('ytEid')) {
      const eidValue = data?.link_code.split('ytEid=')[1];
      setActionType('internal')
      setSelectedInternalPage(`Event Detail Watch`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Event Detail Watch`]: findEventValue(`${eidValue}`),
      }));
      setDisplaySelected(`Event Detail Watch| ${eidValue}`)
    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('score')) {
      const gcValue = data?.link_code.split('EC')[1].split('&')[0];
      setActionType('internal')
      setSelectedInternalPage(`Event Detail Boxscore`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Event Detail Boxscore`]: findEventIDValue(`EC${gcValue}`),
      }));
      // setSelectedDropdownValues((prevValues) => ({
      //   ...prevValues,
      //   [`Event Detail Boxscore`]: findEventIDValue(`EC${gcValue}`),
      // }));
      setDisplaySelected(`Event Detail Boxscore| EC${gcValue}`)
    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('Own Profile Page') && !data?.link_code.includes('specific')) {
      setActionType('internal')
      setSelectedInternalPage(`Own Profile Page`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Own Profile Page`]: 'Own Profile Page',
      }));
      setDisplaySelected(`Own Profile Page`)
    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('specific')) {

      const params = new URLSearchParams(data?.link_code.split('?')[1]);
      const cValue = params.get('c');
      setActionType('internal')
      setSelectedInternalPage(`Specific User Page`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Specific User Page`]: 'Specific User Page',
      }));
      setDisplaySelected(`Specific User Page | ${cValue}`)
    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('Edit profile visibility')) {
      setActionType('internal')
      setSelectedInternalPage(`Edit Profile | Edit profile visibility`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Edit Profile | Edit profile visibility`]: 'Edit Profile | Edit profile visibility',
      }));
      setDisplaySelected(`Edit Profile | Edit profile visibility`)

    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('Home')) {
      setActionType('internal')
      setSelectedInternalPage(`Edit Profile | Home`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Edit Profile | Home`]: 'Edit Profile | Home',
      }));
      setDisplaySelected(`Edit Profile | Home`)

    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('Upload own documents')) {
      setActionType('internal')
      setSelectedInternalPage(`Edit Profile | Upload own documents`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Edit Profile | Upload own documents`]: 'Edit Profile | Upload own documents',
      }));
      setDisplaySelected(`Edit Profile | Upload own documents`)


    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('search_user_face')) {
      const userCodeMatch = data?.link_code.match(/user_code=([^&]*)/);
      const eidValue = userCodeMatch ? userCodeMatch[1] : '';
      const egValue = data?.link_code.split('eg_code=')[1];
      setActionType('internal')
      setSelectedInternalPage(`Search all my photos using face recognition`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Search all my photos using face recognition`]: 'Search all my photos using face recognition',
      }));
      setDisplaySelected(`Search all my photos using face recognition ${eidValue ? `| ${eidValue}` : ''} | ${egValue}`)

    }
    else if (data?.link_type.trim() == 'internal' && data?.link_code.includes('media')) {
      // const gcValue = data?.link_code.split('EC')[1].split('&')[0];
      setActionType('internal')
      setSelectedInternalPage(`Event Detail Media`)
      setSelectedDropdownValues((prevValues) => ({
        ...prevValues,
        [`Event Detail Media`]: '',
      }));
      // setSelectedDropdownValues((prevValues) => ({
      //   ...prevValues,
      //   [`Event Detail Boxscore`]: findEventIDValue(`EC${gcValue}`),
      // }));
      setDisplaySelected(`Event Detail Media`)
      // displaySelectedText = `Event Detail Media`;
    } else {
      setDisplaySelected('')
    }
    if (data?.link_type.trim() === 'external') {
      setActionType('external')
    }
  }, [data, setFormEventGroup]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (data) {
      setValue('name', data?.name);
    }
  }, [data, setFormEventGroup]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = ['name'];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formEventGroup[field] !== '') {
        if (errors[field].type === 'required') {
          clearErrors(field);
        }
      }
    });
  }, [formEventGroup, clearErrors, errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEventGroup((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormEventGroup((prevState) => ({
          ...prevState,
          image_news: file,
        }));
      } else {
        setErrorImg('Invalid file type. Please select an image.');
        setSelectedImage(null);
      }
    }
  };

  const imageData = data?.logo || '/images/logo-fotogrit.png';


  const handleStartDateChange = (date) => {
    setFormEventGroup((prevState) => ({
      ...prevState,
      start_date: date,
      end_date: '', // Clear end date when start date changes
    }));
  };

  const handleEndDateChange = (date) => {
    setFormEventGroup((prevState) => ({
      ...prevState,
      end_date: date,
    }));
  };

  return (
    <div>
      <div className='flex '>

      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="flex gap-3">
          <div className="flex flex-col gap-2">
            <h5 className="font-bold">Code</h5>
            <Paragraph loading={isLoading} className="capitalize">
              {data?.code || '-'}
            </Paragraph>
          </div>
          <DatePickerCustom
            label="Publishing Start Date"
            name="dateStart"
            value={formEventGroup.start_date}
            onChange={handleStartDateChange}
            placeholder="Select Publishing Start Date"
            errServer={errServer?.data}
            errCodeServer="x01005"
            errValidation={errors}
            register={register}
          // disabled={!isAccess?.can_edit}
          />
          <DatePickerCustom
            label="Publishing End Date"
            name="end_date"
            value={formEventGroup.end_date}
            onChange={handleEndDateChange}
            placeholder="Select Publishing End Date"
            errServer={errServer?.data}
            errCodeServer="x01005"
            errValidation={errors}
            register={register}
          // disabled={!isAccess?.can_edit}
          />

          <div className='max-w-[230px] w-full min-w-[100px] h-[103px] aspect-[65/24] relative overflow-hidden'>

            <UpdateImage
              label="News Image"
              onChange={handleImageChange}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              dataImage={formEventGroup.link_media}
              disabled={!isAccess?.can_edit}
              height="h-[103px]"
              errorImg={errorImg}
              setErrorImg={setErrorImg}
              accept="image/jpg, image/jpeg"
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
            data={data}
            optionsUserList={optionsUserList}
            selectedDropdownValues2={selectedDropdownValues2}
              setSelectedDropdownValues2={setSelectedDropdownValues2}
              eventGroupData={eventGroupData}

              setPageOption={setPageOptionCustomerData}
            setSearchQueryOption={setSearchQueryOptionCustomerData}
            totalPageOptions={totalPageOptionCustomerData}
          />
        </div>

        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">

          {/* {isAccess?.can_edit && (

          )} */}

          <Button
            type="submit"
            background="black"
            className={`w-32`}
            disabled={isLoading}
          >
            {isLoading ? <LoaderButtonAction /> : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormDetailNews;

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";

import { Button, LoaderButtonAction } from "@/components";
import {
  DatePickerCustom,
  Input,
  MultiSelect,
  SelectCustom,
  SelectDropdown,
  SelectInput,
  UpdateImage,
} from "@/components/form-input";
import TextArea from "@/components/form-input/TextArea";
import { Paragraph } from "@/components/typography";

import { formatDateYearToDay } from "@/helpers/FormatDateYearToDay";
import { selectTypeOfPayment } from "@/constants";
import { formatDate } from "@/helpers/FormatDate";
import { CurrencyFormat, removeCurrencyFormat } from "@/helpers/CurrencyFormat";

import { useUpdateEventListMutation } from "@/services/api/eventsApiSlice";
import { setEventListID } from "@/services/state/eventsSlice";
import { FetchData } from "@/helpers/FetchData";
import { FaEye } from "react-icons/fa";
import { checkFileType } from "@/helpers/CheckFileType";
import { useGetPreorderQuery } from "@/services/api/serviceRequestApiSlice";
import PreorderRow from "./PreorderRow";

const validationSchema = yup
  .object({
    eventName: yup.string().required("Event Name is a required field").max(50),
    picEvent: yup.string().required("Event PIC is a required field").max(50),
    dateStart: yup.string().required("Start date is a required field").max(50),
    dateFinish: yup.string().required("End date is a required field").max(50),
    location: yup.string().required("Location is a required field").max(200),
    timeStart: yup.string().required("Start Time is a required field"),
    timeFinish: yup.string().required("Finish Time is a required field"),
    photoPrice: yup
      .string()
      .required("Photo price is a required field")
      .nullable(),
    videoPrice: yup
      .string()
      .required("Video price is a required field")
      .nullable(),
  })
  .required();

const FormDetailEventList = (props) => {
  const {
    data: eventData,
    setOpenModal,
    setIsOpenPopUpDelete,
    optionsTeams,
    optionsCities,
    optionsEventMatch,
    eventGroupID,
    setCurrentActiveTab,
    isAccessStreamContabo,
    isAccessFaceReqognition,
    isAccess,
    setIsOpenPopUpShowThumbnail,
    eventGroupData,
    // city
    setPageCity,
    setSearchQueryCity,
    totalPageOptionCityData,
    // category
    setPageEventMatch,
    setSearchQueryEventMatch,
    totalPageOptionEventMatchData,
    // pic event
    optionsUsers,
    setSearchQueryOptionUsers,
    totalPageOptionUsers,
    setPageUsers,
  } = props;
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const dispatch = useDispatch();

  const initialInputValue = {
    ID: "",
    groupCode: "",
    eventCode: "",
    eventName: "",
    teamA: "",
    teamB: "",
    picEvent: "",
    dateStart: "",
    dateFinish: "",
    timeStart: "",
    timeFinish: "",
    photoPrice: "",
    videoPrice: "",
    location: "",
    city: "",
    typeOfPayment: "",
    photographer: "",
    linkYouTube: "",
    linkMedia: "",
    description: "",
    image: null,
    thumbnailTime: "00:00",
  };
  const [formInput, setFormInput] = useState(initialInputValue);
  const [selectedTeamA, setSelectedTeamA] = useState("");
  const [selectedTeamB, setSelectedTeamB] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedEventMatch, setSelectedEventMatch] = useState("");
  const [getDetailUpdated, setGetDetailUpdated] = useState({});
  const [imageChanged, setImageChanged] = useState(false);
  const [errorImg, setErrorImg] = useState(null);
  const [selectedPicEvent, setSelectedPicEvent] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updateEventList, { isLoading, error: errServer }] =
    useUpdateEventListMutation();
  const matchedEventGroupCode = eventGroupData?.find(
    (item) => item.id === eventGroupID
  );

  const stringZero = "d03a050e4841eb38d61da409dc82b35b";

  const fileExtensionCoverImage = eventData?.cover_image
    .split(".")
    .pop()
    .toLowerCase();
  const typeOfMedia = selectedImage && checkFileType(selectedImage);

  // Get pre order if there's event id
  const { data: preorderData } = useGetPreorderQuery(
    {
      event: eventData?.id,
    },
    {
      skip: !eventData?.id,
    }
  );

  const [preorders, setPreorders] = useState([]);

  useEffect(() => {
    if (preorderData) {
      setPreorders(preorderData.data || []);
    }
  }, [preorderData]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("id", formInput.ID);
      formData.append("event_group_id", eventGroupID);
      formData.append("name", formInput.eventName);
      formData.append("pic_event", selectedPicEvent?.label || "");
      formData.append(
        "date_start",
        formInput.dateStart ? formatDateYearToDay(formInput.dateStart) : ""
      );
      formData.append(
        "date_finish",
        formInput.dateFinish ? formatDateYearToDay(formInput.dateFinish) : ""
      );
      formData.append("time_start", formInput.timeStart);
      formData.append("time_finish", formInput.timeFinish);
      formData.append(
        "photo_price",
        removeCurrencyFormat(formInput.photoPrice)
      );
      formData.append(
        "video_price",
        removeCurrencyFormat(formInput.videoPrice)
      );
      formData.append("location", formInput.location);
      formData.append("city", selectedCity.value);
      formData.append("payment_method", selectedPayment);
      formData.append("photographer", formInput.photographer);
      formData.append("link_youtube", formInput.linkYouTube);
      formData.append("link_media", formInput.linkMedia);
      formData.append("description", formInput.description);
      formData.append(
        "match_category_id",
        stringZero === selectedEventMatch ? "" : selectedEventMatch.value
      );

      if (selectedImage) {
        formData.append("image", formInput.image);
      }
      if (
        eventData?.team_a_name !== "" ||
        selectedTeamA !== "d03a050e4841eb38d61da409dc82b35b"
      ) {
        formData.append("team_a_id", selectedTeamA);
      }
      if (
        eventData?.team_b_name !== "" ||
        selectedTeamB !== "d03a050e4841eb38d61da409dc82b35b"
      ) {
        formData.append("team_b_id", selectedTeamB);
      }

      if (typeOfMedia === "video") {
        const [minutes, seconds] = formInput.thumbnailTime.split(":");
        formData.append("minutes", minutes);
        formData.append("seconds", seconds);
      }

      const response = await updateEventList(formData);

      if (!response.error) {
        setOpenModal(false);
        const newData = {
          eventName: formInput.eventName,
          dateStart: formatDate(formInput.dateStart),
          dateFinish: formatDate(formInput.dateFinish),
          timeStart: formInput.timeStart,
          timeFinish: formInput.timeFinish,
          location: formInput.location,
        };

        // Check if the event logo is changed, then add it to the newData
        if (imageChanged) {
          newData.image = formInput?.image;
        }

        setGetDetailUpdated(newData);

        toast.success(`"${formInput?.eventName}" has been updated!`, {
          position: "top-right",
          theme: "light",
        });
      } else {
        toast.error(`Failed: ${response?.error?.data?.message}`, {
          position: "top-right",
          theme: "light",
        });
      }
    } catch (err) {
      console.error("Failed to save the event list", err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleStreamContabo = async (id) => {
    try {
      const url = `/restricted/api/v1/events/stream-contabo/${id}`;
      const response = await FetchData(url);

      if (!response?.error) {
        window.open(`/stream-contabo`, "_blank", "noopener noreferrer");
        toast.success(
          `Streaming in queue, processing will be done in background`,
          {
            position: "top-right",
            theme: "light",
          }
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed: ${error?.data?.message}`, {
        position: "top-right",
        theme: "light",
      });
    }
  };

  const handleRecognition = async (id) => {
    try {
      const url = `/restricted/api/v1/recog/col-pick?event_id=${id}`;
      const response = await FetchData(url);

      if (!response?.error) {
        const link = response?.data?.redirect_url;
        window.open(link, "_blank", "noopener noreferrer");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangePrice = (e) => {
    const { name, value } = e.target;

    // Remove characters other than digits (0-9)
    const numericValue = value.replace(/[^0-9]/g, "");
    // Format the price as desired, for example: "Rp 10,000"
    const formattedPrice = `Rp ${numericValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;

    setFormInput((prevData) => ({
      ...prevData,
      [name]: formattedPrice,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        setErrorImg(null);
        setSelectedImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          image: file,
        }));
      } else {
        setErrorImg("Invalid file type. Please select an image.");
        setSelectedImage(null);
      }

      setImageChanged(true);
    }
  };

  const handleStartDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      dateStart: date,
      dateFinish: "",
    }));
  };

  const handleEndDateChange = (date) => {
    setFormInput((prevState) => ({
      ...prevState,
      dateFinish: date,
    }));
  };
  const handleToMedia = () => {
    console.log("eventData?.id", eventData?.id);
    setOpenModal(false);
    setCurrentActiveTab(4);
    dispatch(setEventListID(eventData?.id));
  };

  useEffect(() => {
    if (eventData) {
      const existingCity = optionsCities?.find(
        (option) => option.value === eventData?.event_city
      );

      // If city exists, set it as selected
      if (existingCity) {
        setSelectedCity(existingCity);
      } else {
        setSelectedCity({
          value: eventData?.event_city,
          label: eventData?.event_city,
        });
      }

      const existingPicEvent = optionsUsers?.find(
        (option) => option.label === eventData?.pic_event
      );

      if (existingPicEvent) {
        setSelectedPicEvent(existingPicEvent);
      } else {
        setSelectedPicEvent({
          value: eventData?.pic_event,
          label: eventData?.pic_event,
        });
      }
      // Rest of the existing useEffect code
      setSelectedPayment(eventData?.payment_type || "");
      setSelectedTeamA(eventData?.team_a_id || "");
      setSelectedTeamB(eventData?.team_b_id || "");
      setSelectedEventMatch({
        value: eventData?.match_category_id,
        label: eventData?.match_category,
      });
      setFormInput((prevFormInput) => ({
        ...prevFormInput,
        ID: eventData?.id || "",
        groupCode: eventData?.group_code || "",
        eventCode: eventData?.event_code || "",
        eventName: eventData?.event_name || "",
        picEvent: eventData?.pic_event || "",
        dateStart: new Date(eventData?.date_start),
        dateFinish: new Date(eventData?.date_finish),
        timeStart: eventData?.time_start || "",
        timeFinish: eventData?.time_finish || "",
        photoPrice: CurrencyFormat(eventData?.photo_price || 0),
        videoPrice: CurrencyFormat(eventData?.video_price || 0),
        location: eventData?.event_location || "",
        linkYouTube: eventData?.link_youtube || "",
        linkMedia: eventData?.link_media,
        description: eventData?.description || "",
        image: eventData?.thumbnail || "",
      }));
    }
  }, [
    eventData,
    setFormInput,
    setSelectedCity,
    setSelectedPayment,
    setSelectedTeamA,
    setSelectedTeamB,
    matchedEventGroupCode,
  ]);

  // Default Value for validation react hook form
  useEffect(() => {
    if (eventData) {
      setValue("eventName", eventData?.event_name);
      setValue("picEvent", eventData?.pic_event);
      setValue("dateStart", formatDateYearToDay(eventData?.date_start));
      setValue("dateFinish", formatDateYearToDay(eventData?.date_finish));
      setValue("location", eventData?.event_location);
      setValue("photoPrice", CurrencyFormat(eventData?.photo_price));
      setValue("videoPrice", CurrencyFormat(eventData?.video_price));
      if (eventData?.time_start) {
        setValue("timeStart", CurrencyFormat(eventData?.time_start));
      }
      if (eventData?.time_finish) {
        setValue("timeFinish", CurrencyFormat(eventData?.time_finish));
      }
    }
  }, [eventData, setFormInput]);

  // Removing required error when input is filled.
  useEffect(() => {
    const fieldsToCheck = [
      "eventName",
      "picEvent",
      "dateStart",
      "dateFinish",
      "location",
      "photoPrice",
      "videoPrice",
      "timeStart",
      "timeFinish",
    ];

    fieldsToCheck.forEach((field) => {
      if (errors[field] && formInput[field] !== "") {
        if (errors[field].type === "required") {
          clearErrors(field);
        }
        if (errors[field].type === "typeError") {
          clearErrors(field);
        }
      }
    });
  }, [formInput, clearErrors, errors]);

  const imageData =
    getDetailUpdated?.image ||
    eventData?.thumbnail ||
    "/images/logo-fotogrit.png";

  const [defaultInputValue, setDefaultInputValue] = useState(null);
  const [eventNameDefaultData, setEventNameDefaultData] = useState("");

  useEffect(() => {
    setDefaultInputValue(eventNameDefaultData);
  }, [eventNameDefaultData]);
  const selectedOptionTeamA = optionsTeams
    ?.find((option) => option.value === selectedTeamA)
    ?.label?.replace(/^\S+\s*/, "")
    ?.replace(/\s*-\s*.*/, "");
  const selectedOptionTeamB = optionsTeams
    ?.find((option) => option.value === selectedTeamB)
    ?.label?.replace(/^\S+\s*/, "")
    ?.replace(/\s*-\s*.*/, "");
  const ageGroupTeamAFull = optionsTeams
    ?.find((option) => option.value === selectedTeamA)
    ?.label.split(" - ");
  const ageGroupTeamBFull = optionsTeams
    ?.find((option) => option.value === selectedTeamB)
    ?.label.split(" - ");
  const ageGroupTeamA = ageGroupTeamAFull?.slice(1).join(" ");
  const ageGroupTeamB = ageGroupTeamBFull?.slice(1).join(" ");
  const ageGroup =
    ageGroupTeamA == ageGroupTeamB
      ? ageGroupTeamA
      : `${ageGroupTeamA}  ${ageGroupTeamB}`;

  const isFirstRender = useRef(true);

  const [isEventNameChanged, setIsEventNameChanged] = useState(false);

  useEffect(() => {
    // Create a ref to track if it's the first render
    if (isFirstRender.current) {
      isFirstRender.current = false; // Set the ref to false to allow future executions
      return;
    }

    // Ensure the effect runs only after the first render
    if (selectedOptionTeamA !== "Team" && selectedOptionTeamB !== "Team") {
      setEventNameDefaultData(
        `${selectedOptionTeamA} vs ${selectedOptionTeamB} - age group`
      );
      if (isEventNameChanged) {
        setFormInput((prevData) => ({
          ...prevData,
          ["eventName"]: `${selectedOptionTeamA} vs ${selectedOptionTeamB} - ${ageGroup}`,
        }));
      }
    }
  }, [selectedOptionTeamA, isEventNameChanged, selectedOptionTeamB]);

  return (
    <div className="w-full ">
      <div className="grid grid-cols-1 gap-2 mb-6 text-sm sm:grid-cols-3 lg:grid-cols-6">
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Group Code</h5>
          <Paragraph loading={isLoading}>{eventData?.group_code}</Paragraph>
        </div>
        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Code</h5>
          <Paragraph loading={isLoading}>{eventData?.event_code}</Paragraph>
          <div className="flex flex-col w-full gap-1">
            {isAccessStreamContabo?.can_menu ? (
              <button
                className="block w-full p-3 text-center text-white rounded-lg bg-secondary hover:bg-opacity-80 disabled:opacity-50 disabled:bg-gray-500"
                onClick={() => handleStreamContabo(eventData?.id)}
              >
                <p>Stream Contabo</p>
              </button>
            ) : null}
            {isAccessFaceReqognition?.can_menu ? (
              <button
                className="block w-full p-3 text-center text-white rounded-lg bg-secondary hover:bg-opacity-80"
                onClick={() => handleRecognition(eventData?.id)}
              >
                <p>Facial Recognition</p>
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Event Name</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.eventName || eventData?.event_name}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Date & Time</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.dateStart
              ? `${getDetailUpdated?.dateStart}, ${getDetailUpdated?.timeStart}`
              : `${formatDate(eventData?.date_start)}, ${
                  eventData?.time_start
                }`}{" "}
            s/d <br />
            {getDetailUpdated?.dateFinish
              ? `${getDetailUpdated?.dateFinish}, ${getDetailUpdated?.timeFinish}`
              : `${formatDate(eventData?.date_finish)}, ${
                  eventData?.time_finish
                }`}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Location</h5>
          <Paragraph loading={isLoading}>
            {getDetailUpdated?.location || eventData?.event_location}
          </Paragraph>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Thumbnail</h5>

          <div
            className={`w-full h-24 overflow-hidden rounded-md group cursor-pointer relative ${
              fileExtensionCoverImage === "mp4" ? "border-2 border-red-600" : ""
            }`}
          >
            <div className="absolute inset-0 z-20 items-center justify-center hidden  bg-black/40 group-hover:flex">
              <div
                className="inline-block px-2 py-1 text-xs  bg-white/60 hover:text-blue-600 rounded-full"
                onClick={() => setIsOpenPopUpShowThumbnail(true)}
              >
                <FaEye />
              </div>
            </div>

            <img
              src={
                getDetailUpdated?.image
                  ? URL.createObjectURL(getDetailUpdated.image)
                  : imageData
              }
              alt={`img-${eventData?.group_code}`}
              className="object-cover rounded-sm object-center w-full h-full group-hover:scale-105 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h5 className="font-bold">Created By</h5>
          <Paragraph loading={isLoading}>{eventData?.created_by}</Paragraph>
        </div>

        {/* <div className="flex flex-col gap-2">
          <h5 className="font-bold">Media</h5>
          <button
            onClick={handleToMedia}
            className="px-3 py-2 text-xs text-center text-white transition-all duration-300 rounded-lg bg-secondary hover:bg-opacity-80 hover:shadow-md"
          >
            View Media
          </button>
        </div> */}

        <div className="flex flex-col gap-2 col-span-3">
          <h5 className="font-bold">Media</h5>
          <table className="border-collapse">
            <tr>
              <td className="p-1">Accessibility</td>
              <td className="p-1">Access Code</td>
              <td className="p-1">Users with Access</td>
              <td className="p-1">Media</td>
            </tr>
            <tr>
              <td className="border border-slate-400 p-1">Public</td>
              <td className="border border-slate-400 p-1">Code: N/A</td>
              <td className="border border-slate-400 p-1"></td>
              <td className="border border-slate-400 p-1">
                <button
                  onClick={handleToMedia}
                  className="px-3 py-2 text-xs text-center text-white transition-all duration-300 rounded-lg bg-secondary hover:bg-opacity-80 hover:shadow-md"
                >
                  See media
                </button>
              </td>
            </tr>
            {preorders.map((preorder) => (
              <PreorderRow
                key={preorder.id}
                preorder={preorder}
                optionsUsers={optionsUsers}
                onMediaClick={handleToMedia}
              />
            ))}
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleUpdate)}>
        <div className="grid grid-flow-row-dense grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
          <Input
            type="text"
            label="Group Code"
            name="code"
            value={formInput.groupCode}
            onChange={handleChange}
            disabled
            errServer={errServer?.data}
            errCodeServer="x06004"
          />

          <Input
            type="text"
            label="Event Code"
            name="eventCode"
            value={formInput.eventCode}
            onChange={handleChange}
            disabled
          />

          <div className="sm:col-span-2">
            {formInput.eventName || !defaultInputValue ? (
              <Input
                type="text"
                label="Event Name"
                name="eventName"
                value={formInput.eventName}
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="x06005"
                errValidation={errors}
                register={register}
                disabled={!isAccess?.can_edit}
              />
            ) : (
              <Input
                type="text"
                label="Event Name"
                name="eventName"
                onChange={handleChange}
                errServer={errServer?.data}
                errCodeServer="x06005"
                errValidation={errors}
                // register={register}
                disabled={!isAccess?.can_edit}
                defaultValue={defaultInputValue}
              />
            )}
          </div>

          <div className="">
            <SelectInput
              name="team"
              data={optionsTeams}
              placeholder="Select Team A"
              label="Team A"
              selectedValue={selectedTeamA}
              setSelectedValue={setSelectedTeamA}
              errServer={errServer?.data}
              errCodeServer="x06002"
              disabled={!isAccess?.can_edit}
              setIsEventNameChanged={setIsEventNameChanged}
            />
          </div>

          <div className="">
            <SelectInput
              name="team"
              data={optionsTeams}
              placeholder="Select Team B"
              label="Team B"
              selectedValue={selectedTeamB}
              setSelectedValue={setSelectedTeamB}
              errServer={errServer?.data}
              errCodeServer="x06003"
              disabled={!isAccess?.can_edit}
              setIsEventNameChanged={setIsEventNameChanged}
            />
          </div>

          <div className="">
            <DatePickerCustom
              label="Start Date"
              name="dateStart"
              value={formInput.dateStart}
              onChange={handleStartDateChange}
              placeholder="Select Start Date"
              errServer={errServer?.data}
              errCodeServer="x06000"
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />
          </div>

          <div className="">
            <DatePickerCustom
              label="Finish Date"
              name="dateFinish"
              value={formInput.dateFinish}
              onChange={handleEndDateChange}
              placeholder="Select Finish Date"
              errServer={errServer?.data}
              errCodeServer="x06001"
              min={formInput.dateStart}
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />
          </div>
          {formInput.picEvent || !matchedEventGroupCode?.pic_organizer ? (
            <Input
              type="text"
              label="Event PIC"
              name="picEvent"
              value={formInput.picEvent}
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x06009"
              errValidation={errors}
              register={register}
            />
          ) : (
            <Input
              type="text"
              label="Event PIC"
              name="picEvent"
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x06009"
              errValidation={errors}
              defaultValue={matchedEventGroupCode?.pic_organizer}
            />
          )}
          <Input
            type="time"
            label="Start Time"
            name="timeStart"
            value={formInput.timeStart}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />

          <Input
            type="time"
            label="Finish Time"
            name="timeFinish"
            value={formInput.timeFinish}
            onChange={handleChange}
            errValidation={errors}
            register={register}
            disabled={!isAccess?.can_edit}
          />

          <Input
            type="text"
            label="Photo Price"
            name="photoPrice"
            value={formInput.photoPrice}
            onChange={handleChangePrice}
            disabled={!isAccess?.can_edit}
            errValidation={errors}
            register={register}
          />

          <Input
            type="text"
            label="Video Price"
            name="videoPrice"
            value={formInput.videoPrice}
            onChange={handleChangePrice}
            disabled={!isAccess?.can_edit}
            errValidation={errors}
            register={register}
          />

          <div className="sm:col-span-2">
            <Input
              type="text"
              label="Event Location"
              name="location"
              value={formInput.location}
              onChange={handleChange}
              errServer={errServer?.data}
              errCodeServer="x06007"
              errValidation={errors}
              register={register}
              disabled={!isAccess?.can_edit}
            />
          </div>

          <div className="">
            <SelectCustom
              name="city"
              data={optionsCities}
              placeholder="Select City"
              label="City"
              selectedValue={selectedCity}
              setSelectedValue={setSelectedCity}
              errServer={errServer?.data}
              errCodeServer="x06013"
              disabled={!isAccess?.can_edit}
              infiniteScroll
              setPageOption={setPageCity}
              setSearchQueryOption={setSearchQueryCity}
              totalPageOptions={totalPageOptionCityData}
            />
          </div>

          {/* <div className="">
            <SelectInput
              name="payment"
              data={selectTypeOfPayment}
              placeholder="Select Payment"
              label="Type Of Payment"
              selectedValue={selectedPayment}
              setSelectedValue={setSelectedPayment}
              disabled={!isAccess?.can_edit}
            />
          </div> */}

          {/* <Input
            type="text"
            label="Photographer"
            name="photographer"
            value={formInput.photographer}
            onChange={handleChange}
            disabled
          /> */}

          <Input
            type="text"
            label="Link Youtube"
            name="linkYouTube"
            value={formInput.linkYouTube}
            onChange={handleChange}
            disabled={!isAccess?.can_edit}
          />

          <div className="sm:col-span-2 lg:col-span-1">
            <Input
              type="text"
              label="Link Media"
              name="eventLocation"
              value={formInput.linkMedia}
              onChange={handleChange}
              disabled
            />
          </div>

          <TextArea
            label="Description"
            name="description"
            rows={6}
            value={formInput.description}
            onChange={handleChange}
            disabled={!isAccess?.can_edit}
          />

          <UpdateImage
            label="Event Thumbnail"
            name="eventLogo"
            height="h-[136px]"
            onChange={handleImageChange}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            dataImage={formInput.image}
            disabled={!isAccess?.can_edit}
            errServer={errServer?.data}
            errCodeServer="xxx025"
            errorImg={errorImg}
            setErrorImg={setErrorImg}
            accept="image/jpg,image/jpeg"
            // accept="image/jpg,image/jpeg,video/mp4"
          />

          {typeOfMedia === "video" && (
            <Input
              type="time"
              label="Set Thumbnail Time"
              name="thumbnailTime"
              value={formInput.thumbnailTime}
              onChange={handleChange}
            />
          )}

          <SelectCustom
            name="eventMatch"
            data={optionsEventMatch}
            placeholder="Select event match"
            label="Event Match Category"
            selectedValue={selectedEventMatch}
            setSelectedValue={setSelectedEventMatch}
            errServer={errServer?.data}
            errCodeServer="x06050"
            infiniteScroll
            setPageOption={setPageEventMatch}
            setSearchQueryOption={setSearchQueryEventMatch}
            totalPageOptions={totalPageOptionEventMatchData}
          />
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold">Media</h3>
        </div>

        <div className="flex justify-end w-full gap-4 py-2 mt-4">
          {isAccess?.can_delete && (
            <Button
              background="red"
              className={`w-32`}
              disabled={isLoading ? true : false}
              onClick={() => setIsOpenPopUpDelete(true)}
            >
              {isLoading ? <LoaderButtonAction /> : "Delete"}
            </Button>
          )}

          {isAccess?.can_delete && (
            <Button
              type="submit"
              background="black"
              className={`w-32 `}
              disabled={isLoading ? true : false}
            >
              {isLoading ? <LoaderButtonAction /> : "Save"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormDetailEventList;

import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { Checkbox, SelectCustom } from "@/components/form-input";
import { useUploadImagesMutation } from "@/services/api/uploadApiSlice";
import getApiUrl from "@/helpers/GetApiUrl";
import { useGetPreorderQuery } from "@/services/api/serviceRequestApiSlice";

const FormAddMediaList = (props) => {
  const {
    optionsEvents,
    setIsOpenPopUpUploading,
    setIsUploadCompleted,
    eventGroupID,
    setSearchQueryEvent,
    totalPageOptionEvent,
    setPageEvent,
  } = props;

  const API_URL = getApiUrl;

  const fileInputRef = useRef();
  const [selectedEvent, setSelectedEvent] = useState("");

  const [uploadImages, { isLoading }] = useUploadImagesMutation();

  const [isPublic, setIsPublic] = useState(false);
  const [isPreorder, setIsPreorder] = useState(false);
  const [selectedPreorder, setSelectedPreorder] = useState("");

  const { data: preorderData } = useGetPreorderQuery(
    {
      event: selectedEvent?.value,
    },
    {
      skip: !selectedEvent?.value,
    }
  );

  const [preorders, setPreorders] = useState([]);

  useEffect(() => {
    if (preorderData) {
      console.log("preorderData", preorderData);
      setPreorders(preorderData.data || []);
    }
  }, [preorderData]);

  const preorderOptions = preorders.map((preorder) => preorder.code);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      try {
        const allowedFormats = ["image/jpg", "image/jpeg", "video/mp4"];
        const invalidFiles = files.filter(
          (file) => !allowedFormats.includes(file.type)
        );

        if (invalidFiles.length > 0) {
          toast.error(
            `Invalid file format. Only images (JPEG, JPG) and videos (MP4) are allowed.`,
            {
              position: "top-right",
              theme: "light",
            }
          );
          return;
        }

        setIsOpenPopUpUploading(true);

        const formData = new FormData();
        formData.append("event_id", selectedEvent?.value);
        if (isPreorder) {
          console.log("preorderData", preorderData);
          const preorder = preorderData.data.find(
            (preorder) => preorder.code === selectedPreorder
          );
          console.log("preorder", preorder);
          formData.append("preorder_id", preorder.id);
        } else {
          formData.append("preorder_id", '');
        }
        files.forEach((image) => {
          formData.append("images", image);
        });

        const response = await uploadImages({
          url: `${API_URL}/restricted/api/v1/event/media-list`,
          data: formData,
        }).unwrap();

        if (!response.error) {
          setSelectedEvent("");

          toast.success(`Media has been added!`, {
            position: "top-right",
            theme: "light",
          });
          setIsUploadCompleted(true);
        }
      } catch (err) {
        setIsOpenPopUpUploading(false);
        console.error(err);
        toast.error(`Failed to save the media`, {
          position: "top-right",
          theme: "light",
        });
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    setSelectedEvent("");
  }, [eventGroupID]);

  const handlePublicChange = (e) => {
    const isChecked = e.target.checked;
    setIsPublic(isChecked);
    if (isChecked) {
      setIsPreorder(false);
      setSelectedPreorder("");
    }
  };

  const handlePreorderChange = (e) => {
    const isChecked = e.target.checked;
    setIsPreorder(isChecked);
    if (isChecked) {
      setIsPublic(false);
    }
  };

  return (
    <form>
      <div className="grid grid-flow-row-dense grid-cols-3 gap-4 sm:grid-cols-3 lg:grid-cols-4 gap-y-2">
        <div className="z-10 sm:col-span-1">
          <SelectCustom
            name="eventCode"
            data={optionsEvents}
            placeholder="Select Event"
            label="Event Code "
            selectedValue={selectedEvent}
            setSelectedValue={setSelectedEvent}
            infiniteScroll
            setSearchQueryOption={setSearchQueryEvent}
            totalPageOptions={totalPageOptionEvent}
            setPageOption={setPageEvent}
          />
        </div>

        <div className="sm:col-span-1 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <Checkbox
                id="public"
                checked={isPublic}
                onChange={handlePublicChange}
                className="mr-2"
              />
              <label htmlFor="public">Public</label>
            </div>

            <div className="flex flex-row gap-2">
              <div className="flex items-center">
                <Checkbox
                  id="preorder"
                  checked={isPreorder}
                  onChange={handlePreorderChange}
                  className="mr-2"
                />
                <label htmlFor="preorder">Preorder/Private</label>
              </div>
              {isPreorder && (
                <select
                  value={selectedPreorder}
                  onChange={(e) => setSelectedPreorder(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Preorder</option>
                  {preorderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="cursor-pointer group">
            <div
              className={`px-4 py-2 text-center rounded-md group-hover:bg-opacity-80 transition-all duration-300 ${
                isLoading === true || selectedEvent === ""
                  ? "bg-opacity-60 bg-gray-800"
                  : "bg-black "
              }`}
              onClick={handleFileInputClick}
            >
              <span className="text-white ">Upload</span>
            </div>

            <input
              id="upload"
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/jpg,image/jpeg,video/mp4"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading || selectedEvent === ""}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default FormAddMediaList;

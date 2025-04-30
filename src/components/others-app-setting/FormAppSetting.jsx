import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import { Input, UpdateImage } from '../form-input';
import { Button, LoaderButtonAction } from '@/components';
import { SkeletonTextEditor } from '../Skeleton';

import {
  useGetAppSettingQuery,
  useUpdateAppSettingMutation,
} from '@/services/api/appSettingApiSlice';

const FormAppSetting = () => {
  const [editorReady, setEditorReady] = useState(false);
  const [selectedLogoApp, setSelectedLogoApp] = useState(null);
  const [selectedLogoCMS, setSelectedLogoCMS] = useState(null);
  const [selectedLogoEventThumbnail, setSelectedLogoEventThumbnail] = useState(null);
  const [selectedLogoNewsImage, setSelectedLogoNewsImage] = useState(null);
  const [errorImgApp, setErrorImgApp] = useState(null);
  const [errorImgCMS, setErrorImgCMS] = useState(null);
  const [errorImgEventThumbnail, setErrorImgEventThumbnail] = useState(null);
  const [errorImgNewsImage, setErrorImgNewsImage] = useState(null);
const getCacheBustedUrl = (url) => {
  return `${url}?timestamp=${new Date().getTime()}`;
};

  const { data } = useGetAppSettingQuery();

  const [formInput, setFormInput] = useState({
    printingInfo: '',
    appLogo: null,
    cmsLogo: null,
    androidVersion: '',
    iosVersion: '',
    thumbnailTime: '',
    news_duration_sec: '',
    thumbnail: null,
    default_news: null,
  });

  useEffect(() => {
    if (data) {
      setFormInput({
        printingInfo: data?.data?.printing_info,
        appLogo: data?.data?.app_logo,
        cmsLogo: data?.data?.cms_logo,
        androidVersion: data?.data?.android_version,
        iosVersion: data?.data?.ios_version,
        thumbnailTime: data?.data?.event_media_time,
        news_duration_sec: data?.data?.news_duration_sec,
        default_news: data?.data?.default_news,
        thumbnail: data?.data?.thumbnail,
      });
    }
  }, [data]);

  const [updateAppSetting, { isLoading }] = useUpdateAppSettingMutation();

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formNewData = new FormData();
      formNewData.append('printing_info', 'printingInfo');
      formNewData.append('app_logo', formInput.appLogo);
      formNewData.append('cms_logo', formInput.cmsLogo);
      formNewData.append('android_version', formInput.androidVersion);
      formNewData.append('ios_version', formInput.iosVersion);
      formNewData.append('event_media_time', formInput.thumbnailTime);
      formNewData.append('thumbnail', formInput.thumbnail);
      formNewData.append('news_duration_sec', formInput.news_duration_sec);
      formNewData.append('default_news', formInput.default_news);

      const response = await updateAppSetting(formNewData);

      if (!response.error) {
        toast.success(`App Setting has been updated!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to update the app setting', err);
      toast.error(`Failed to update the app setting`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };

  const handleEditorChange = (content, editor) => {
    setFormInput((prevState) => ({
      ...prevState,
      printingInfo: content,
    }));
  };

  const handleEditorReady = () => {
    setEditorReady(true);
  };

  const handleLogoAppChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImgApp(null);
        setSelectedLogoApp(file);
        setFormInput((prevState) => ({
          ...prevState,
          appLogo: file,
        }));
      } else {
        setErrorImgApp('Invalid file type. Please select an image.');
        setSelectedLogoApp(null);
      }
    }
  };

  const handleLogoCMSChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImgCMS(null);
        setSelectedLogoCMS(file);
        setFormInput((prevState) => ({
          ...prevState,
          cmsLogo: file,
        }));
      } else {
        setErrorImgCMS('Invalid file type. Please select an image.');
        setSelectedLogoCMS(null);
      }
    }
  };
  const handleLogoEventThumbnail = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImgEventThumbnail(null);
        setSelectedLogoEventThumbnail(file);
        setFormInput((prevState) => ({
          ...prevState,
          thumbnail: file,
        }));
      } else {
        setErrorImgEventThumbnail('Invalid file type. Please select an image.');
        setSelectedLogoEventThumbnail(null);
      }
    }
  };
  const handleLogoNewsImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith('image/')) {
        setErrorImgNewsImage(null);
        setSelectedLogoNewsImage(file);
        setFormInput((prevState) => ({
          ...prevState,
          default_news: file,
        }));
      } else {
        setErrorImgNewsImage('Invalid file type. Please select an image.');
        setSelectedLogoNewsImage(null);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleUpdate}>
      {/* <label htmlFor="editor" className="mb-4 text-sm text-gray-500">
        Photo Printing Info
      </label>
      {!editorReady && <SkeletonTextEditor />}

      {isLoading ? (
        <SkeletonTextEditor />
      ) : (
        <Editor
          apiKey="a27gox3ayknpotqotx8aincrc7wb9vrytttb9apj95m1xygu"
          initialValue={data?.data?.printing_info}
          init={{
            height: 300,
            menubar: false,
            branding: false,
            statusbar: false,
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'preview',
              'help',
              'wordcount',
            ],
            toolbar:
              ' blocks | ' +
              'bold italic link | bullist numlist | alignleft aligncenter ' +
              'alignright alignjustify | image table ' +
              'undo redo | help',
          }}
          onEditorChange={handleEditorChange}
          onInit={() => handleEditorReady()}
        />
      )} */}

      <div className="flex flex-col gap-8 ">
        <div className="w-full ">
          {isLoading ? (
            <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse" />
          ) : (
            <div className='flex flex-col lg:flex-row gap-y-5'>
              <div className='min-w-52 text-xl text-gray-700 font-bold'>Logos</div>
              <div className='flex flex-1 gap-6 flex-col lg:flex-row'>
                <div className='max-w-96 w-full'>
                  <UpdateImage
                    label="Logo for Application"
                    name="appLogo"
                    onChange={handleLogoAppChange}
                    selectedImage={selectedLogoApp}
                    setSelectedImage={setSelectedLogoApp}
                    height="h-40"
                    dataImage={getCacheBustedUrl(data?.data?.app_logo)}
                    // dataImage={data?.data?.app_logo}
                    errorImg={errorImgApp}
                    setErrorImg={setErrorImgApp}
                    objectFit="object-contain"
                  />
                </div>
                <div className='max-w-96 w-full'>
                  <UpdateImage
                    label="Logo for CMS"
                    name="cmsLogo"
                    onChange={handleLogoCMSChange}
                    selectedImage={selectedLogoCMS}
                    setSelectedImage={setSelectedLogoCMS}
                    height="h-40"
                    dataImage={getCacheBustedUrl(data?.data?.cms_logo)}
                    // dataImage={data?.data?.cms_logo}
                    errorImg={errorImgCMS}
                    setErrorImg={setErrorImgCMS}
                    objectFit="object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full ">
          {isLoading ? (
            <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse" />
          ) : (
            <div className='flex flex-col lg:flex-row gap-y-5'>
              <div className='min-w-52 text-xl text-gray-700 font-bold'>Thumbnails
              </div>
              <div className='flex flex-1 gap-6 flex-col lg:flex-row'>
                <div className='max-w-96 w-full'>
                  <UpdateImage
                    label="Default Event Thumbnail"
                    name="thumbnail"
                    onChange={handleLogoEventThumbnail}
                    selectedImage={selectedLogoEventThumbnail}
                    setSelectedImage={setSelectedLogoEventThumbnail}
                    height="h-40"
                    dataImage={getCacheBustedUrl(data?.data?.thumbnail)}
                    // dataImage={data?.data?.thumbnail}
                    errorImg={errorImgEventThumbnail}
                    setErrorImg={setErrorImgEventThumbnail}
                    objectFit="object-contain"
                  />
                </div>
                <div className='max-w-96 w-full'>
                  <Input
                    type="time"
                    label="Media Thumbnail Time"
                    name="thumbnailTime"
                    value={formInput.thumbnailTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full ">
          {isLoading ? (
            <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse" />
          ) : (
            <div className='flex flex-col lg:flex-row gap-y-5'>
              <div className='min-w-52 text-xl text-gray-700 font-bold'>App version</div>
              <div className='flex flex-1 gap-6 flex-col lg:flex-row'>

                <div className='max-w-96 w-full'>
                  <Input
                    type="text"
                    label="Android Version"
                    name="androidVersion"
                    value={formInput.androidVersion}
                    onChange={handleChange}
                  />
                </div>
                <div className='max-w-96 w-full'>
                  <Input
                    type="text"
                    label="IOS Version"
                    name="iosVersion"
                    value={formInput.iosVersion}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full ">
          {isLoading ? (
            <div className="w-full h-40 bg-gray-300 rounded-md animate-pulse" />
          ) : (
            <div className='flex flex-col lg:flex-row gap-y-5'>
              <div className='min-w-52 text-xl text-gray-700 font-bold'>News</div>
              <div className='flex flex-1 gap-6 flex-col lg:flex-row'>

                <div className='max-w-96 w-full'>
                  <Input
                    type="time"
                    label="Duration between news"
                    name="news_duration_sec"
                    value={formInput.news_duration_sec}
                    onChange={handleChange}
                  />
                </div>
                <div className='max-w-96 w-full'>
                  <UpdateImage
                    label="Default news image"
                    name="default_news"
                    onChange={handleLogoNewsImage}
                    selectedImage={selectedLogoNewsImage}
                    setSelectedImage={setSelectedLogoNewsImage}
                    height="h-40"
                      // dataImage={data?.data?.default_news}
                       dataImage={getCacheBustedUrl(data?.data?.default_news)}
                    errorImg={errorImgNewsImage}
                    setErrorImg={setErrorImgNewsImage}
                    objectFit="object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>


      </div>

      <div className="flex justify-end w-full gap-4 py-2 mt-4">
        <Button
          type="submit"
          background="black"
          className="w-40"
          disabled={isLoading ? true : false}
        >
          {isLoading ? <LoaderButtonAction /> : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default FormAppSetting;

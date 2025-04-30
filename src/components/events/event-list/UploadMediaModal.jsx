import { useState } from 'react';
import { Button } from '@/components';

const UploadMediaModal = ({
  isOpen,
  onClose,
  onUpload,
  isLoading,
  selectedEventId
}) => {
  const [isPublic, setIsPublic] = useState(false);
  const [isPreorder, setIsPreorder] = useState(false);
  const [selectedPreorder, setSelectedPreorder] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);


  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = () => {
    onUpload({
      files: selectedFiles,
      isPublic,
      isPreorder,
      preorderCode: selectedPreorder,
      eventId: selectedEventId
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white rounded-lg p-6 w-[460px]">
        <h2 className="text-xl text-center font-bold mb-4">What is the accessibility of the media you are uploading to?
        </h2>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="public">Public</label>
          </div>

          <div className="flex flex-row gap-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="preorder"
                checked={isPreorder}
                onChange={(e) => setIsPreorder(e.target.checked)}
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
              </select>
            )}
          </div>

          {/* File Upload Column */}
          <div className="flex items-center mt-5">
            <label className="cursor-pointer">
              <div className="px-4 py-2 bg-black text-white rounded hover:bg-opacity-80 transition-all duration-300">
                Select Files
              </div>
              <input
                type="file"
                multiple
                accept="image/jpg,image/jpeg,video/mp4"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button background="red" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            background="black" 
            onClick={handleUpload}
            disabled={isLoading || !selectedFiles}
          >
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadMediaModal;
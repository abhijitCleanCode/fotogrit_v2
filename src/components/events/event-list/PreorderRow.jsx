import { useState, useEffect } from "react";
import { MultiSelect } from "@/components/form-input";
import { useUpdatePreorderMutation } from "@/services/api/serviceRequestApiSlice";

const PreorderRow = ({ preorder, optionsUsers, onMediaClick }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [updatePreorder] = useUpdatePreorderMutation();

  console.log("preorder", preorder);

  const handleUserChange = async (newSelectedUsers) => {
    // console.log("newSelectedUsers", newSelectedUsers);
    setSelectedUsers(newSelectedUsers);
    try {
      await updatePreorder({
        id: preorder.id,
        event_id: preorder.event_id,
        event_group_id: preorder.event_group_id,
        allowed_users: newSelectedUsers.map(user => user.value)
      });
    } catch (error) {
      console.error('Failed to update preorder:', error);
      // Optionally revert the selection if the API call fails
      setSelectedUsers(preorder.users);
    }
  };

  useEffect(() => {
    if (preorder.allowed_users) {
      // todo get the user name from the api
      // currenlty only id, need to get the name
      setSelectedUsers(preorder.allowed_users);
    }
  }, [preorder]);
  
  return (
    <tr key={preorder.id}>
      <td className="border border-slate-400 p-1">{preorder.code}</td>
      <td className="border border-slate-400 p-1">
        Code: <strong>{preorder.access_code}</strong>
      </td>
      <td className="border border-slate-400 p-1">
        <MultiSelect
          label=" "
          placeholder="Select user"
          options={optionsUsers}
          selectedOptions={selectedUsers}
          setSelectedOptions={handleUserChange}
          className="w-full"
        />
      </td>
      <td className="border border-slate-400 p-1">
        <button 
          onClick={onMediaClick} 
          className="px-3 py-2 text-xs text-center text-white transition-all duration-300 rounded-lg bg-secondary hover:bg-opacity-80 hover:shadow-md"
        >
          See media
        </button>
      </td>
    </tr>
  );
};

export default PreorderRow; 
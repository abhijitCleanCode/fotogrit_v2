import { Button } from '.';
import Tooltip from './Tooltip';
import { IoIosArrowForward } from 'react-icons/io';

const ButtonGroupRoster = (props) => {
  const getErrorMessage = () => {
    if (!props.eventGroupID) {
      return "Please select an event group first";
    }
    if (!props.filterSelectedRosterTeam) {
      return "Please select a roster team first";
    }
    // if (!props.isAdmin) {
    //   return "Only admin users can edit this item";
    // }
    return null;
  };

  const errorMessage = getErrorMessage();

  return (
    <>
      <div className='flex gap-2 justify-center min-w-fit'>
        <Tooltip
          text={errorMessage || "Edit"}
          position="top"
          className={errorMessage ? "text-red-500" : ""}
        >
          <Button
            onClick={() => {
              if (!errorMessage) {
                props?.setGetData(props);
                props?.setOpenModal(true);
              }
            }}
            type="submit"
            background="black"
            className={`w-fit ${errorMessage ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            Edit
          </Button>
        </Tooltip>

        <Button
          background="red"
          className="w-fit"
          onClick={() => {
            props?.setGetData(props);
            props?.setIsOpenPopUpDelete(true);
          }}
        >
          Delete
        </Button>
      </div>
    </>
  );
};

export default ButtonGroupRoster;

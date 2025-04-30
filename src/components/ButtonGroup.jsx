import { Button } from '.';
import Tooltip from './Tooltip';
import { IoIosArrowForward } from 'react-icons/io';

const ButtonGroup = (props) => {
  return (
    <>
      <div className='flex gap-2 justify-center min-w-fit'>
        <Tooltip text="open" position="top" disabled={props?.disabled}>

          <Button
            onClick={() => {
              props?.setGetData(props);
              props?.setOpenModal(true);
            }}
            type="submit"
            background="black"
            className={`w-fit`}
            disabled={props?.disabled}
          >Edit </Button>
        </Tooltip>
        <Button

          background="red"
          className="w-fit"
        // disabled={isLoading}
          onClick={() => {
            props?.setGetData(props);
            props?.setIsOpenPopUpDelete(true);
          }}
        >Delete </Button>
      </div>
    </>
  );
};

export default ButtonGroup;

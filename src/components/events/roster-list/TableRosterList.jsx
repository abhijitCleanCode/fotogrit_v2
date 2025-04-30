import { useState } from 'react';
import { MdArrowDropUp, MdArrowDropDown } from 'react-icons/md'; // Import icons for sorting
import { Pagination } from '@/components';
import { ErrorFetchingData } from '@/components/Errors';
import { SkeletonTable } from '../../Skeleton';
import ButtonGroupRoster from '@/components/ButtonGroupRoster';

const TableRosterList = (props) => {
  const {
    data,
    positions,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    setCurrentPage,
    metaPagination,
    limitPerPage,
    currentPage,
    eventGroupID,
    teamAddForm,
    setIsOpenPopUpDelete,
    isAdmin,
    eventGroupData,
    filterSelectedRosterTeam
  } = props;

  const totalPages = metaPagination?.total_page;
  const totalRecords = metaPagination?.total_record;

  // Sorting state
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const eventCode = (id) => {
     return eventGroupData?.find((item) => item?.id === id)?.code;
  }
  // const eventCode = eventGroupData?.find((item) => item?.id === eventGroupID)?.code;
  // const teamCode = optionsTeams?.find((item) => item?.value === filterSelectedRosterTeam)?.label;
  // Sorting handler
  const handleSort = (column) => {
    const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  };

  const getPosition = (position) => {
    return positions?.find((item) => item?.id === position)?.name;
  }

  // Sort data based on the selected column and direction
  const sortedData = data && [...data]?.sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortColumn] > b[sortColumn] ? 1 : -1;
    }
    return a[sortColumn] < b[sortColumn] ? 1 : -1;
  });

  // Sorting icon logic
  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <MdArrowDropUp className='text-2xl'  /> : <MdArrowDropDown className='text-2xl' />;
  };
  const activeButton = !isAdmin || !eventGroupID || !filterSelectedRosterTeam;
  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <div className="overflow-x-auto h-[calc(100vh-20rem)]">
            <table className="min-w-full border-collapse">
              {/* Table Head */}
              <thead>
                <tr className="bg-white border-b border-gray-200">
                  <th
                    className="min-w-40 max-w-40  px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                        <div className='flex items-center'>
                          Group Code {renderSortIcon('code')}
                    </div>
                  </th>
                  <th
                    className="min-w-40 max-w-40 px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('team_code')}
                  >
                    <div className='flex items-center'>
                          Team Code {renderSortIcon('team_code')}
                    </div>
                  </th>
                  <th
                    className="min-w-40 max-w-40  px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('code')}
                  >
                    <div className='flex items-center'>
                          Roster ID {renderSortIcon('code')}
                    </div>
                  </th>
                  <th
                    className="min-w-20 max-w-20 px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('jersey_number')}
                  >
                    <div className='flex items-center'>
                          Jersey No {renderSortIcon('jersey_number')}
                    </div>
                  </th>
                  <th
                    className="min-w-40 max-w-40  px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('captain')}
                  >
                    <div className='flex items-center'>
                          Captain {renderSortIcon('captain')}
                    </div>
                  </th>
                  <th
                    className="min-w-40 max-w-40 px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('position')}
                  >
                    <div className='flex items-center'>
                          Position {renderSortIcon('position')}
                    </div>
                  </th>
                  <th
                    className="min-w-56 max-w-56  px-6 py-3 text-left text-sm font-extrabold text-black cursor-pointer"
                    onClick={() => handleSort('user')}
                  >
                    <div className='flex items-center'>
                          User {renderSortIcon('user')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-extrabold text-black">
                    Action
                  </th>
                </tr>
              </thead>

            <tbody>
              {teamAddForm}
              {sortedData.length > 0 ? (
                <>
                  {sortedData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="min-w-40 max-w-40 px-6 py-4 whitespace-nowrap">
                        {/* {row.code} */}
                        {eventCode(row.event_group_id)}
                      {/* {row.event_code} */}
                      </td>
                      <td className="min-w-40 max-w-40 px-6 py-4 whitespace-nowrap overflow-hidden text-ellipsis">
                        {`${row?.team_code} ${row?.team}`}
                      </td>
                      <td className="min-w-40 max-w-40 px-6 py-4 whitespace-nowrap">{row.code}</td>
                      <td className="min-w-40 max-w-40 px-6 py-4 whitespace-nowrap">
                        {row.jersey_number || '-'}
                      </td>
                      <td className="min-w-40 max-w-40 px-6 py-4 whitespace-nowrap">
                        {row.captain || '-'}
                      </td>
                      <td className="min-w-40 max-w-40 px-6 py-4 whitespace-nowrap">
                        {getPosition(row.mainposition) || '-'}
                      </td>
                      <td className="min-w-48 max-w-48 px-6 py-4 whitespace-nowrap overflow-hidden">
                        {row.user_code ? `${row.user_code} - ` : ''} {row.user || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <ButtonGroupRoster
                          setGetData={setGetData}
                          setOpenModal={setOpenModal}
                          isAdmin={isAdmin}
                          eventGroupID={eventGroupID}
                          filterSelectedRosterTeam={filterSelectedRosterTeam}
                          setIsOpenPopUpDelete={setIsOpenPopUpDelete}
                          {...row}
                        />
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableRosterList;

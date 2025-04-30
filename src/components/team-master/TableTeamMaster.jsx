import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';

const TableTeamMaster = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    limitPerPage,
    setCurrentPage,
    currentPage,
    isEventGroupSelected
  } = props;

  const teams = isEventGroupSelected ? data?.data.length != 0 ? data?.data[0].teams : [] : [];
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  // Columns Table
  const columns = [
    {
      name:  (
        <div className="flex flex-col gap-[2px] py-2 text-center">
          <p>Team</p>
          <p>Code</p>
        </div>
      ),
      selector: (row) => row.code,
      cell: (row) => row.code || '-',
      sortable: true,
      width: '100px',
    },
    {
      name: 'Team Logo',
      selector: (row) => row.logo_team,
      cell: (row) =>
        row.logo_team ? (
          <div className="w-full h-full p-2">
            <div className="w-16 h-16 overflow-hidden mx-auto rounded-sm">
              <img
                src={row.logo_team}
                alt={row.name}
                className="object-cover object-center w-full h-full"
              />
            </div>
          </div>
        ) : (
          <div className="p-2">
            <img
              src="/images/logo-fotogrit.png"
              alt="image placeholder"
              className="object-fill w-14 h-14"
            />
          </div>
        ),
      width: '160px',
      center: true,
    },
    {
      name: 'Team Name',
      selector: (row) => row.name,
      cell: (row) => row?.name,
      sortable: true,
    },
    {
      name: 'PIC Team',
      selector: (row) => row.pic_team || '-',
      sortable: true,
    },
    {
      name: 'Club Name',
      selector: (row) => row.club_name || '-',
      sortable: true,
    },
    {
      name: 'Action',
      center: true,
      width: '80px',
      cell: (props) => (
        <ButtonAction
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          {...props}
        />
      ),
    },
  ];

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <SkeletonTable />
      ) : isSuccess ? (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={teams}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Add/Modify Team" />}
          />

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

export default TableTeamMaster;

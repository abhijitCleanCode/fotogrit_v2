import DataTable from 'react-data-table-component';

import { SkeletonTable } from '../Skeleton';
import { Button, ButtonAction, Pagination } from '@/components';
import { customTableStyles } from '@/constants/tableStyle';
import { ErrorFetchingData, NoDataMessage } from '@/components/Errors';
import ButtonGroup from '../ButtonGroup';
import { useState } from 'react';

const TableNews = (props) => {
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
    setIsOpenPopUpDelete
  } = props;
  console.log('News_Data', data);

  const dataTable = [...(data?.data || [])].sort((a, b) => b.code.localeCompare(a.code));

  const meta = data?.meta;
  const isAdmin = true;
  const activeButton = !isAdmin;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;
  const whenClicked = (linkType, linkCode) => {
    let displaySelectedText;
    if (linkType == 'internal' && linkCode.includes('schedule')) {
      const gcValue = linkCode.split('GC')[1].split('&')[0];
      displaySelectedText = `Event Group Schedule Webpage | GC${gcValue}`;
    } else if (linkType == 'internal' && linkCode.includes('resultStanding')) {
      const gcValue = linkCode.split('GC')[1].split('&')[0];
      displaySelectedText = `Event Group Results & Standing Webpage | GC${gcValue}`;
    } else if (linkType == 'internal' && linkCode.includes('clubPlayer')) {
      const gcValue = linkCode.split('GC')[1].split('&')[0];
      displaySelectedText = `Event Group Club & Players Webpage | GC${gcValue}`;
    } else if (linkType == 'internal' && linkCode.includes('ytEid')) {
      const eidValue = linkCode.split('ytEid=')[1];
      displaySelectedText = `Event Detail Watch | ${eidValue}`;
    } else if (linkType == 'internal' && linkCode.includes('score')) {
      const eidValue = linkCode.split('eid=')[1];
      displaySelectedText = `Event Detail Boxscore | ${eidValue}`;
    } else if (linkType == 'internal' && linkCode.includes('Own Profile Page') && !linkCode.includes('specific')) {
      displaySelectedText = `Own Profile Page`;
    } else if (linkType == 'internal' && linkCode.includes('specific')) {
      const playerCode = linkCode.split('c=')[1].split('&')[0];
      displaySelectedText = `Specific User Page | ${playerCode}`;
    } else if (linkType == 'internal' && linkCode.includes('Edit profile visibility')) {
      displaySelectedText = `Edit Profile | Edit profile visibility`;
    } else if (linkType == 'internal' && linkCode.includes('Home')) {
      displaySelectedText = `Edit Profile | Home`;
    } else if (linkType == 'internal' && linkCode.includes('Upload own documents')) {
      displaySelectedText = `Edit Profile | Upload own documents`;
    } else if (linkType == 'internal' && linkCode.includes('search_user_face')) {
      const userCodeMatch = linkCode.match(/user_code=([^&]*)/);
      const eidValue = userCodeMatch ? userCodeMatch[1] : '';
      const egValue = linkCode.split('eg_code=')[1];
      displaySelectedText = `Search all my photos using face recognition ${eidValue ? `| ${eidValue}` : ''} | ${egValue}`;
    } else if (linkType == 'external') {
      displaySelectedText = `External`;
    } else if (linkType == 'internal' && linkCode.includes('media')) {
      const eidValue = linkCode.split('eid=')[1];
      displaySelectedText = `Event Detail Media | ${eidValue}`;
    } else {
      displaySelectedText = '';
    }

    return displaySelectedText;
  }
  const columns = [
    {
      name: 'News Code',
      selector: (row) => row.code,
      cell: (row) => row.code || '-',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Publishing Start Date',
      selector: (row) => row.start_date,
      cell: (row) => new Date(row.start_date).toLocaleDateString() || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Publishing End Date',
      selector: (row) => row.end_date,
      cell: (row) => new Date(row.end_date).toLocaleDateString() || '-',
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Picture',
      selector: (row) => row.link_media,
      cell: (row) =>
        row.link_media ? (
          <div className="w-full h-full p-2">
            <div className="min-w-[65px] h-[24px] overflow-hidden mx-auto rounded-sm">
              <img
                src={row.link_media}
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
      width: '180px',
      center: true,
    },
    {
      name: 'Action when Clicked',
      selector: (row) => `${row.link_type}: ${row.link_code}`,
      cell: (row) => whenClicked(row.link_type, row.link_code),
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Number of clicks',
      selector: (row) => row.clicks,
      cell: (row) => row.clicks || 0,
      sortable: true,
      minWidth: '160px',
      wrap: true,
    },
    {
      name: 'Actions',
      minWidth: '250px',

      cell: (row) => (
        // <div className="flex gap-2">
        //   <Button background="black">
        //     Edit
        //   </Button>
        //   <Button


        //     background="red">
        //     Delete
        //   </Button>

        // </div>
        <ButtonGroup
          setGetData={setGetData}
          setOpenModal={setOpenModal}
          disabled={activeButton}
          // disabled={!eventGroupID}
          setIsOpenPopUpDelete={setIsOpenPopUpDelete}
          {...row}
        />
      ),

      center: true,
    }
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
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title="Sponsor" />}
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

export default TableNews;

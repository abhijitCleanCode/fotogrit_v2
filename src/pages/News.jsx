import { Collapse, Modal, PopUpDelete } from '@/components';
import { Card, CardBody } from '@/components/Card';
import FormAddNews from '@/components/news-master/FormAddNews';
import FormDetailNews from '@/components/news-master/FormDetailNews';
import { SkeletonBlock, SkeletonBreadcrumb, SkeletonTable } from '@/components/Skeleton';
import FormAddSponsor from '@/components/sponsor-master/FormAddSponsor';
import FormDetailSponsor from '@/components/sponsor-master/FormDetailSponsor';
import useDebounce from '@/hooks/useDebounce';
import { useGetAllCustomerDataNoLimitQuery, useGetAllCustomerDataQuery, useGetCustomerDataListQuery, useGetUserDataListQuery, useOptionsAllUsersQuery } from '@/services/api/customerDataApiSlice';
import { useGetEventGroupOwnedQuery } from '@/services/api/eventGroupApiSlice';
import { useGetEventListQuery, useGetRosterListQuery, useGetTeamListQuery } from '@/services/api/eventsApiSlice';
import { useDeleteNewsMutation, useGetNewsListQuery } from '@/services/api/newsApiSlice';
import { useDeleteSponsorMutation, useGetSponsorsQuery } from '@/services/api/othersApiSlice';
import { useGetMyProfileQuery } from '@/services/api/profileSettingApiSlice';
import { selectCurrentModules } from '@/services/state/authSlice';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const LazyBreadcrumb = lazy(() => import('@/components/Breadcrumb'));
const LazyFilterSearch = lazy(() =>
  import('@/components/form-input/FilterSearch')
);
const LazyButtonCollapse = lazy(() => import('@/components/ButtonCollapse'));
const LazyTableNews = lazy(() =>
  import('@/components/news-master/TableNews')
);
const breadcrumbItems = [];

const News = () => {
  const [isOpenNewData, setIsOpenNewData] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popUpDelete, setPopUpDelete] = useState(false);
  const [getDetailData, setGetDetailData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [limitPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [actionType, setActionType] = useState('external');
  const [externalLink, setExternalLink] = useState('');
  const [selectedInternalPage, setSelectedInternalPage] = useState('');
  const [displaySelected, setDisplaySelected] = useState(''); // New state to display selected item
  const [inputValues, setInputValues] = useState({});
  const [selectedDropdownValues, setSelectedDropdownValues] = useState({});
  const [selectedDropdownValues2, setSelectedDropdownValues2] = useState({});
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const modules = useSelector(selectCurrentModules);
  const isAccessThisPage = modules[42];
  const { data } = useGetMyProfileQuery();
  const dataProfile = data?.data;

  const [pageEventGroupData, setPageEventGroupData] = useState(1);
  const [searchQueryEventGroupData, setSearchQueryEventGroupData] = useState('');
  const debouncedSearchEventGroupData = useDebounce(searchQueryEventGroupData, 100);


  const { data: eventGroupList } = useGetEventGroupOwnedQuery({
    page: pageEventGroupData,
    searchTerm: debouncedSearchEventGroupData,
    limit: 100,
  });

  const eventGroupData = eventGroupList?.data?.event_groups;

  const eventCodeList = eventGroupData?.map((item) => ({
    label: item?.code,
    value: item?.id
  })).filter((item, index, self) =>
    index === self.findIndex((t) => t.value === item.value)
  );

  const eventCodeListWithName = eventGroupData?.map((item) => ({
    label: item?.code + ' | ' + item?.name,
    value: item?.id
  })).filter((item, index, self) =>
    index === self.findIndex((t) => t.value === item.value)
  );
 const [pageEventListData, setPageEventListData] = useState(1);
  const [searchQueryEventListData, setSearchQueryEventListData] = useState('');
  const debouncedSearchEventListData = useDebounce(searchQueryEventListData, 100);

  const {
    data: eventList,
    isLoading: isLoadingEventList,
    isSuccess: isSuccessEventList,
    isError: isErrorEventList,
    error: errorEventList,
  } = useGetEventListQuery({
    eventGroup: selectedGroupId,
    searchTerm: debouncedSearchEventListData,
    page: pageEventListData,
    limit: 100,
  });


  const eventListData = eventList?.data?.events?.map(item => ({
    label: item.event_code,
    value: item.event_code
  })).filter((item, index, self) =>
    index === self.findIndex((t) => t.value === item.value)
  )

  const eventListDataWithName = eventList?.data?.events?.map(item => ({
    label: item.event_code + ' | ' + item.event_name,
    value: item.event_code + ' | ' + item.event_name
  })).filter((item, index, self) =>
    index === self.findIndex((t) => t.value === item.value)
  )

  const eventListWatchData = eventList?.data?.events?.map(item => ({
    value: item.event_code + '|' + (item.link_youtube ? item.link_youtube : 'NO WATCH LINK'),
    label: item.event_code + '|' + (item.link_youtube ? item.link_youtube : 'NO WATCH LINK')
  })).filter((item, index, self) =>
    index === self.findIndex((t) => t.value === item.value)
  )


  // Options Customers
  const [pageCustomerData, setPageCustomerData] = useState(1);
  const [searchQueryCustomerData, setSearchQueryCustomerData] = useState('');
  const debouncedSearchCustomerData = useDebounce(searchQueryCustomerData, 200);
  const { data: customers } = useGetAllCustomerDataQuery({
    searchTerm: debouncedSearchCustomerData,
  });
  const totalPageOptionCustomerData = customers?.meta?.total_page;
  const optionsUserList = customers?.data?.map((item) => ({
    value: item?.id,
    label: `${item?.code} ${item?.name ? `| ${item?.name}` : ""}`,

  }));
  if (Array.isArray(optionsUserList)) {
    optionsUserList.unshift({ value: "", label: "Select User" });
  }


  const internalPageSelectData = [
    {
      label: 'Event Group Results & Standing Webpage',
      type: 'Dropdown',
      value: eventCodeListWithName,
      optionType: 1
    },
    {

      label: 'Event Group Club & Players Webpage',
      type: 'Dropdown',
      value: eventCodeListWithName,
      optionType: 1
    },
    {

      label: 'Event Group Schedule Webpage',
      type: 'Dropdown',
      value: eventCodeListWithName,

      optionType: 1
    },
    {
      label: 'Event Detail Media',
      type: 'Dropdown',
      value: eventCodeListWithName,
      value_two: eventListDataWithName,
      optionType: 2
    },
    {
      label: 'Event Detail Boxscore',
      type: 'Dropdown',
      value: eventCodeListWithName,
      value_two: eventListDataWithName,
      optionType: 2
    },
    {
      label: 'Event Detail Watch',
      type: 'Dropdown',
      value: eventCodeListWithName,
      value_two: eventListWatchData,
      optionType: 2
    },
    {
      label: 'Own Profile Page',
    },
    {
      label: 'Specific User Page',
      type: 'Dropdown',
      value: optionsUserList,
      optionType: 1

    },
    {
      label: 'Edit Profile | Home',

    },
    {
      label: 'Edit Profile | Edit profile visibility',

    },
    {
      label: 'Edit Profile | Upload own documents',

    },
    {
      label: 'Search all my photos using face recognition',
      type: 'Dropdown',
      value: eventCodeListWithName,
      optionType: 1
    }
  ];

  const {
    data: ageGroupData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNewsListQuery({
    // searchTerm: debouncedSearchValue,
    page: currentPage,
    limit: limitPerPage,
    order: 'desc',
    sort: 'created_at',
  });

  const [deleteNews, { isLoading: isLoadingDelete }] =
    useDeleteNewsMutation();
  const handleDelete = async () => {
    try {
      const response = await deleteNews({
        id: getDetailData?.id,
      }).unwrap();

      if (!response?.error) {
        setPopUpDelete(false);
        setOpenModal(false);

        toast.success(`"${getDetailData?.code}" has been deleted!`, {
          position: 'top-right',
          theme: 'light',
        });
      }
    } catch (err) {
      setPopUpDelete(false);
      console.error(err);
      toast.error(`Failed: ${err?.data?.message}`, {
        position: 'top-right',
        theme: 'light',
      });
    }
  };


  return (
    <Card className="p-4 px-6 pb-0">
      <Suspense fallback={<SkeletonBreadcrumb />}>
        <LazyBreadcrumb title="Add/Modify News" items={breadcrumbItems} />
      </Suspense>

      <CardBody className="mt-4">
        <div
          className={`flex flex-col-reverse gap-2 md:flex-row md:items-center  ${isAccessThisPage?.can_add
            ? 'md:justify-between'
            : 'md:justify-end'
            }`}
        >
          {isAccessThisPage?.can_add && (
            <Suspense fallback={<SkeletonBlock />}>
              <LazyButtonCollapse
                label="Add new News"
                isOpen={isOpenNewData}
                handleClick={() => setIsOpenNewData(!isOpenNewData)}
              />
            </Suspense>
          )}


        </div>

        <Collapse isOpen={isOpenNewData}>
          <FormAddNews
            data={ageGroupData}
            setOpenColapse={setIsOpenNewData}
            eventCodeList={eventCodeList}
            actionType={actionType}
            setActionType={setActionType}
            externalLink={externalLink}
            setExternalLink={setExternalLink}
            internalPageSelectData={internalPageSelectData}
            selectedInternalPage={selectedInternalPage}
            setSelectedInternalPage={setSelectedInternalPage}
            selectedDropdownValues={selectedDropdownValues}
            setSelectedDropdownValues={setSelectedDropdownValues}
            displaySelected={displaySelected}
            setDisplaySelected={setDisplaySelected}
            inputValues={inputValues}
            setInputValues={setInputValues}
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
            optionsUserList={optionsUserList}
            selectedDropdownValues2={selectedDropdownValues2}
            setSelectedDropdownValues2={setSelectedDropdownValues2}
            eventGroupData={eventGroupData}
            // user_code
            setSearchQueryEventGroupData={setSearchQueryEventGroupData}
            totalPageEventGroupData={pageEventGroupData}
            setPageEventGroupData={setPageEventGroupData}
            // event_code
            setSearchQueryOptionCustomerData={setSearchQueryCustomerData}
            totalPageOptionCustomerData={totalPageOptionCustomerData}
            setPageOptionCustomerData={setPageCustomerData}
            // event_list
            setSearchQueryEventListData={setSearchQueryEventListData}
            totalPageEventListData={pageEventListData}
            setPageEventListData={setPageEventListData}


          />
        </Collapse>

        <section className="mt-4">
          <Suspense fallback={<SkeletonTable />}>
            <LazyTableNews
              openModal={openModal}
              setOpenModal={setOpenModal}
              setGetData={setGetDetailData}
              data={ageGroupData}
              isLoading={isLoading}
              isSuccess={isSuccess}
              isError={isError}
              error={error}
              limitPerPage={limitPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              setIsOpenPopUpDelete={setPopUpDelete}
              eventCodeListWithName={eventCodeListWithName}
              eventListDataWithName={eventListDataWithName}

            />
          </Suspense>

          {/* MODAL */}
          <Modal
            title="Detail News"
            openModal={openModal}
            setOpenModal={setOpenModal}
            className="overflow-visible"
            rounded="rounded-lg"
          >
            <FormDetailNews
              data={getDetailData}
              setOpenModal={setOpenModal}
              isAccess={isAccessThisPage}
              setIsOpenPopUpDelete={setPopUpDelete}
              eventCodeList={eventCodeList}
              actionType={actionType}
              setActionType={setActionType}
              externalLink={externalLink}
              setExternalLink={setExternalLink}
              internalPageSelectData={internalPageSelectData}
              selectedInternalPage={selectedInternalPage}
              setSelectedInternalPage={setSelectedInternalPage}
              selectedDropdownValues={selectedDropdownValues}
              setSelectedDropdownValues={setSelectedDropdownValues}
              displaySelected={displaySelected}
              setDisplaySelected={setDisplaySelected}
              inputValues={inputValues}
              setInputValues={setInputValues}
              selectedGroupId={selectedGroupId}
              setSelectedGroupId={setSelectedGroupId}
              optionsUserList={optionsUserList}
              eventListData={eventListData}
              selectedDropdownValues2={selectedDropdownValues2}
              setSelectedDropdownValues2={setSelectedDropdownValues2}
              eventGroupData={eventGroupData}

              setSearchQueryOptionCustomerData={setSearchQueryCustomerData}
              totalPageOptionCustomerData={totalPageOptionCustomerData}
              setPageOptionCustomerData={setPageCustomerData}
            />
          </Modal>
          {/* END MODAL */}

          {/* Pop Up Delete */}
          <PopUpDelete
            handleDelete={handleDelete}
            isLoading={isLoadingDelete}
            isOpenPopUpDelete={popUpDelete}
            setIsOpenPopUpDelete={setPopUpDelete}
          />
          {/* End Pop Up Delete */}
        </section>
      </CardBody>

    </Card>
  );
};

export default News;
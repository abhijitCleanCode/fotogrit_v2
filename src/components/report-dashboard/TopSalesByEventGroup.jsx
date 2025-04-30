import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import SkeletonTable from "../Skeleton/SkeletonTable";
import { ButtonAction, Pagination } from "@/components";
import { ErrorFetchingData, NoDataMessage } from "@/components/Errors";
import { formatDate } from "@/helpers/FormatDate";
import { customTableStyles } from "@/constants/tableStyle";
import {
  setEventGroupID,
  setTabEventActive,
} from "@/services/state/eventsSlice";
import { selectCurrentUser } from "@/services/state/authSlice";
import { userTypeAdminCheck } from "@/helpers/UserTypeCheck";
import { CurrencyFormat } from "@/helpers/CurrencyFormat";
import { useGetTopSalesByEventGroupQuery } from "@/services/api/dashboardApiSlice";

const TopSalesByEventGroup = ({ title, timeFilter }) => {
  const { data, isLoading, isSuccess, isError, error } =
    useGetTopSalesByEventGroupQuery({ period: timeFilter });

  const eventGroups = data?.data.datas ?? [];
  const average = data?.data.average_sales ?? 0;
  const totalEvent = data?.data.total_all_event ?? 0;
  const totalAllSales = data?.data.total_all_sales ?? 0;
  const startDate = data?.data.startDate ?? "";
  const endDate = data?.data.endDate ?? "";

  // Columns Table
  const columns = [
    {
      name: "Rank",
      selector: (row) => row.Rank,
      sortable: true,
      width: "100px",
    },
    {
      name: "Event Group Code",
      selector: (row) => row.EventGroupCode,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Event Group Name",
      selector: (row) => row.EventGroupName,
      sortable: true,
      wrap: true,
      width: "200px",
    },

    {
      name: "Location",
      selector: (row) => row.Location,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Total Sales",
      selector: (row) => CurrencyFormat(row.TotalSales),
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "# of Events in Period",
      selector: (row) => row.TotalEvents,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Sales/Event",
      selector: (row) => CurrencyFormat(row.SalesPerEvent),
      sortable: true,
      wrap: true,
      width: "200px",
    },
  ];

  return (
    <div>
      <h3 className="text-3xl font-bold mt-3">{title}</h3>
      <h5 className="">
        <em>
          {timeFilter === 'weekly' ? (
            <>Week {data?.data?.start_date ? new Date(data.data.start_date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}) : ''} to {data?.data?.end_date ? new Date(data.data.end_date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}) : ''}</>
          ) : timeFilter === 'today' ? (
            new Date().toLocaleDateString('en-US', {weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'})
          ) : timeFilter === 'monthly' ? (
            new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
          ) : timeFilter === 'yearly' ? (
            new Date().toLocaleDateString('en-US', {year: 'numeric'})
          ) : 'All Time'}
        </em>
      </h5>
      <p>(Rp ribu)</p>
      {isLoading ? (
        <SkeletonTable />
      ) : (
        <div className="border-t border-gray-200">
          <DataTable
            columns={columns}
            data={eventGroups}
            fixedHeader
            fixedHeaderScrollHeight="45vh"
            responsive={true}
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title={title} />}
          />
          <div className="flex justify-between border-t border-b border-gray-200 py-3">
            <p className="text-xs font-bold flex-1">
              Average Sales per Event Group This Period{" "}
            </p>
            <div className="flex flex-1 justify-end">
              <p className="text-xs mr-60 font-bold">
                {CurrencyFormat(totalAllSales)}
              </p>
              <p className="text-xs mr-32 font-bold"></p>
              <p className="text-xs mr-10 font-bold">
                {CurrencyFormat(average)}
              </p>
            </div>
          </div>

          {/* <Pagination
          currentPage={1}
          setCurrentPage={true}
          totalPages={2}
          totalRecords={20}
          limitPerPage={10}
        /> */}
        </div>
      )}
    </div>
  );
};

export default TopSalesByEventGroup;

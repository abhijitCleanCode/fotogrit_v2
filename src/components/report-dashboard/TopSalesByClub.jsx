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
import { useGetTopSalesByClubQuery } from "@/services/api/dashboardApiSlice";

const TopSalesByClub = ({ title, timeFilter }) => {
  const { data, isLoading } = useGetTopSalesByClubQuery({
    period: timeFilter,
  });

  const clubs = data?.data?.datas ?? [];
  const startDate = data?.data?.start_date ?? "";
  const endDate = data?.data?.end_date ?? "";
  const average = data?.data?.average ?? 0;

  // Columns Table
  const columns = [
    {
      name: "Rank",
      selector: (row) => row.rank,
      sortable: true,
      width: "100px",
    },
    {
      name: "Club Code",
      selector: (row) => row.club_code,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Club Full Name",
      selector: (row) => row.club_name,
      sortable: true,
      wrap: true,
      minWidth: "100px",
    },
    {
      name: "Location",
      selector: (row) => row.location,
      sortable: true,
      wrap: true,
      width: "200px",
    },
    {
      name: "Total Sales",
      selector: (row) => CurrencyFormat(row.total_sales),
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
            data={clubs}
            fixedHeader
            fixedHeaderScrollHeight="45vh"
            responsive={true}
            customStyles={customTableStyles}
            persistTableHead
            noDataComponent={<NoDataMessage title={title} />}
          />

          <div className="flex justify-between border-t border-b border-gray-200 py-3">
            <p className="text-xs font-bold">
              Average Sales per club This Period{" "}
            </p>
            <p className="text-xs mr-24 font-bold">{CurrencyFormat(average)}</p>
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

export default TopSalesByClub;

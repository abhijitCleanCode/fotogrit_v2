import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { SkeletonBlock, SkeletonTable } from "../Skeleton";
import { ErrorFetchingData, NoDataMessage } from "../Errors";
import { customTableStyle_by_abhijit } from "@/constants/tableStyleAbhijit";
import { PaginationAbhijit } from "../abhijit-component";

const TableChangeLog = (props) => {
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
    onEditClick,
  } = props;

  const columns = useMemo(
    () => [
      {
        id: "log_number",
        name: "Log Number",
        selector: (row) => row.log_number || "-",
        cell: (row) => row.log_number || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "date",
        name: "Date",
        selector: (row) => row.date || "-",
        cell: (row) => row.date || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "user_code",
        name: "User Code",
        selector: (row) => row.user_code || "-",
        cell: (row) => row.user_code || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "action",
        name: "action",
        selector: (row) => row.action || "-",
        cell: (row) => row.action || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "user_code_performing_action",
        name: "User Code Performing Action",
        selector: (row) => row.action || "-",
        cell: (row) => row.action || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
    ],
    [onEditClick]
  );

  const dataTable = data?.data;
  const meta = data?.meta;

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  return (
    <div>
      {isError ? (
        <ErrorFetchingData error={error} />
      ) : isLoading ? (
        <div className="space-y-2">
          <SkeletonTable />
          <SkeletonBlock />
        </div>
      ) : isSuccess ? (
        <div className="">
          <DataTable
            aria-label="Organizations table"
            responsive
            // selectableRows
            columns={columns}
            data={dataTable}
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            customStyles={customTableStyle_by_abhijit}
            persistTableHead
            noDataComponent={<NoDataMessage title="Organization Type" />}
          />

          <PaginationAbhijit
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableChangeLog;

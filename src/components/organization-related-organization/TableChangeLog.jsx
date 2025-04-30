import { useMemo } from "react";
import DataTable from "react-data-table-component";

// components
import { SkeletonBlock, SkeletonTable } from "../Skeleton";
import { PaginationAbhijit } from "../abhijit-component";
import { ErrorFetchingData, NoDataMessage } from "../Errors";
import { customTableStyle_by_abhijit } from "@/constants/tableStyleAbhijit";

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
        name: "Log Number",
        selector: (row) => row.logNumber || "-",
        cell: (row) => row.logNumber || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        name: "Date",
        selector: (row) => row.date || "-",
        cell: (row) => row.date || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        name: "Organization Code",
        selector: (row) => row.code || "-",
        cell: (row) => row.code || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        name: "Action",
        selector: (row) => row.action || "-",
        cell: (row) => row.action || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        name: "User Code Performing Action",
        selector: (row) => row.userCodePerformingAction || "-",
        cell: (row) => row.userCodePerformingAction || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
    ],
    []
  );

  const dataTable = data?.data || [];
  const meta = data?.meta || {};

  const totalPages = meta?.total_page || 1;
  const totalRecords = meta?.total_record || 0;

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

import { useMemo } from "react";
// components
import { ButtonIcon, PaginationAbhijit } from "../abhijit-component";
import DataTable from "react-data-table-component";
import { ErrorFetchingData, NoDataMessage } from "../Errors";
import { SkeletonBlock, SkeletonTable } from "../Skeleton";
import { customTableStyle_by_abhijit } from "@/constants/tableStyleAbhijit";
// icons
import { FiEdit2 } from "react-icons/fi";

const TableMembersList = (props) => {
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
        id: "membership-code",
        name: "Membership Code",
        selector: (row) => row.membership_code || "-",
        cell: (row) => row.membership_code || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "user-code",
        name: "User Code",
        selector: (row) => row.user_code || "-",
        cell: (row) => row.user_code || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "requested-by",
        name: "Requested By",
        selector: (row) => row.requested_by || "-",
        cell: (row) => row.requested_by || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "action",
        name: "Action",
        center: true,
        width: "180px",
        cell: (row) => (
          <ButtonIcon
            icon={FiEdit2}
            iconPosition="left"
            onClick={() => onEditClick(row)}
            aria-label={`Edit ${row.name}`}
          >
            Edit
          </ButtonIcon>
        ),
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
            selectableRows
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

export default TableMembersList;

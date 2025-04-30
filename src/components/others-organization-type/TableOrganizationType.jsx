import DataTable from "react-data-table-component";
import { FiEdit2 } from "react-icons/fi";

import { SkeletonTable } from "../Skeleton";
import { ButtonAction, Pagination, Button } from "@/components";
import { ErrorFetchingData, NoDataMessage } from "@/components/Errors";
import { ButtonIcon, PaginationAbhijit } from "../abhijit-component";

import { customTableStyle_by_abhijit } from "@/constants/tableStyleAbhijit";
// import { customTableStyles } from "@/constants/tableStyle";

const TableOrganizationType = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    limitPerPage,
    currentPage,
    setCurrentPage,
    onEditClick,
  } = props;

  const dataTable = data?.data?.org_types;
  const meta = data?.meta;

  const totalPages = meta?.total_page || 1;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: "Organization Type Code",
      selector: (row) => row.code || "-",
      cell: (row) => row.code || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
      color: "#717680",
    },
    {
      name: "Organization Type Name",
      selector: (row) => row.name || "-",
      cell: (row) => row.name || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Action",
      center: true,
      width: "180px",
      cell: (props) => (
        <ButtonIcon
          icon={FiEdit2}
          iconPosition="left"
          onClick={() => onEditClick(props)}
        >
          Edit
        </ButtonIcon>
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
        <div className="">
          <DataTable
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
            // limitPerPage={limitPerPage}
            // totalRecords={totalRecords}
            totalPages={totalPages}
          />
        </div>
      ) : null}
    </div>
  );
};

export default TableOrganizationType;

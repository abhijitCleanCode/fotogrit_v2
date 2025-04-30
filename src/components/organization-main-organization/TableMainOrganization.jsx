import { useMemo } from "react";

import { SkeletonTable, SkeletonBlock } from "../Skeleton";
// components
import { ButtonIcon, PaginationAbhijit } from "../abhijit-component";
import { ErrorFetchingData, NoDataMessage } from "../Errors";
import DataTable from "react-data-table-component";
import { customTableStyle_by_abhijit } from "@/constants/tableStyleAbhijit";
// icons
import { FiEdit2, FiSettings } from "react-icons/fi";

const TableMainOrganization = (props) => {
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
        id: "code",
        name: "Organization Code",
        selector: (row) => row.code || "-",
        cell: (row) => row.code || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "name",
        name: "Organization Name",
        selector: (row) => row.name || "-",
        cell: (row) => row.name || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "type",
        name: "Organization Type",
        selector: (row) => row.org_type || "-", // row.org_type
        cell: (row) => row.org_type || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "city",
        name: "City",
        selector: (row) => row.city || "-",
        cell: (row) => row.city || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "pic",
        name: "Organization PIC",
        selector: (row) => row.pic_name || "-",
        cell: (row) => row.pic_name || "-",
        sortable: true,
        minWidth: "160px",
        wrap: true,
      },
      {
        id: "action",
        name: "Action",
        center: true,
        width: "280px",
        cell: (row) => (
          <div className="flex space-x-2 justify-center">
            <ButtonIcon
              icon={FiEdit2}
              iconPosition="left"
              onClick={() => onEditClick(row)}
              aria-label={`Edit ${row.name}`}
            >
              Edit
            </ButtonIcon>
            <ButtonIcon
              // onClick={() => onManageClick(row)}
              aria-label={`Manage ${row.name}`}
            >
              Manage
            </ButtonIcon>
          </div>
        ),
      },
    ],
    [onEditClick]
  );

  const dataTable = data?.data?.orgs || [];
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

export default TableMainOrganization;

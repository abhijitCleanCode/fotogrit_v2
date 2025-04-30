import React, { useState } from "react";
import { ErrorFetchingData, NoDataMessage } from "../Errors";
import { SkeletonTable } from "../Skeleton";
import DataTable from "react-data-table-component";
import { customTableStyle_by_abhijit } from "@/constants/tableStyleAbhijit";
import { FiEdit2 } from "react-icons/fi";
import { ButtonIcon, PaginationAbhijit } from "../abhijit-component";

const TableRelatedOrganizationList = (props) => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    setOpenModal,
    setGetData,
    limitPerPage = 10,
    currentPage = 1,
    setCurrentPage,
    onEditClick,
  } = props;

  const tableData = data?.data || [];
  const meta = data?.meta || {};

  const totalPages = meta?.total_page;
  const totalRecords = meta?.total_record;

  const columns = [
    {
      name: "Related Organization Code",
      selector: (row) => row.code || "-",
      cell: (row) => row.code || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Organization Type",
      selector: (row) => row.type || "-",
      cell: (row) => row.type || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Organization Relationship",
      selector: (row) => row.relationship || "-",
      cell: (row) => row.relationship || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Added By",
      selector: (row) => row.added_by || "-",
      cell: (row) => row.added_by || "-",
      sortable: true,
      minWidth: "160px",
      wrap: true,
    },
    {
      name: "Action",
      center: true,
      width: "180px",
      cell: (props) => (
        <div className="flex space-x-2 justify-center">
          <ButtonIcon icon={FiEdit2} onClick={() => onEditClick(props)}>
            Edit
          </ButtonIcon>
        </div>
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
        <div>
          <DataTable
            columns={columns}
            data={tableData}
            selectableRows
            fixedHeader
            fixedHeaderScrollHeight="54vh"
            responsive={true}
            customStyles={customTableStyle_by_abhijit}
            persistTableHead
            noDataComponent={<NoDataMessage title="Related Organization" />}
          />
        </div>
      ) : null}

      <PaginationAbhijit
        currentPage={1}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </div>
  );
};

export default TableRelatedOrganizationList;

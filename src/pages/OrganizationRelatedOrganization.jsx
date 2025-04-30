//! abhijit changes
import { lazy, Suspense, useState } from "react";

// load the breadcrumb component asynchronously. Don't load right away, wait until it's needed
const LazyBreadcrumb = lazy(() => import("@/components/Breadcrumb"));

// components
import {
  ChangeLog,
  RelatedOrganizationList,
} from "@/components/organization-related-organization";
import { Card, CardBody } from "@/components/Card";
import { SkeletonBreadcrumb, SkeletonTab } from "@/components/Skeleton";
import { Tabs, Tab, TabPanel } from "@/components/Tabs";
import { SelectDropdown } from "@/components/form-input";
import { useGetOrganizationListQuery } from "@/services/api/orgMainOrgApiSlice";

const breadcrumbItems = [
  { label: "Organization", url: "#" },
  { label: "Related Organizations" },
];

const OrganizationRelatedOrganization = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const [parentOrganization, setParentOrganization] = useState("");

  const {
    data: organizationList,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetOrganizationListQuery({});
  const optionsOrganizationList = organizationList?.data?.orgs?.map((org) => ({
    value: org?.id,
    label: org?.name,
  }));
  if (Array.isArray(optionsOrganizationList)) {
    optionsOrganizationList.unshift({ value: "", label: "Select Parent" });
  }

  return (
    <>
      <Card className="p-4 px-6 pb-0">
        <div className="flex items-center justify-between">
          <Suspense fallback={<SkeletonBreadcrumb />}>
            <LazyBreadcrumb title="General Settings" items={breadcrumbItems} />
          </Suspense>
          <div className="mt-[32px] w-1/3 ml-auto z-50">
            <SelectDropdown
              name="organization"
              data={optionsOrganizationList}
              label="Organization"
              selectedValue={parentOrganization}
              setSelectedValue={(val) => {
                console.log(val);
                setParentOrganization(val);
              }}
            />
          </div>
        </div>

        <CardBody className="mt-[32px] z-10">
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Related Organizations List">
              <TabPanel>
                <RelatedOrganizationList
                  parentOrganization={parentOrganization}
                />
              </TabPanel>
            </Tab>
            <Tab label="Changes Logs">
              <TabPanel>
                <ChangeLog />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default OrganizationRelatedOrganization;

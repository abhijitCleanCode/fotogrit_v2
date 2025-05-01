//! abhijit changes
import { lazy, Suspense, useState } from "react";

// load the breadcrumb component asynchronously. Don't load right away, wait until it's needed
const LazyBreadcrumb = lazy(() => import("@/components/Breadcrumb"));

// components
import { Card, CardBody } from "@/components/Card";
import { SkeletonBreadcrumb, SkeletonTab } from "@/components/Skeleton";
import { HorizontalScrollTabs } from "@/components/abhijit-component";
import { ChangesLog, MembersList } from "@/components/organization-members";
import { Tabs, Tab, TabPanel } from "@/components/Tabs";
import { SelectDropdown } from "@/components/form-input";
import { useGetOrganizationListQuery } from "@/services/api/orgMainOrgApiSlice";

const breadcrumbItems = [
  {
    label: "Organization",
    url: "#",
  },
  { label: "Members" },
];

const OrganizationMembers = () => {
  const [currentActiveTab, setCurrentActiveTab] = useState(0);
  const [selectedOrganization, setSelectedOrganization] = useState("");

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
            <LazyBreadcrumb title="Organization" items={breadcrumbItems} />
          </Suspense>
          <div className="mt-[32px] w-1/3 ml-auto z-50">
            <SelectDropdown
              name="organization"
              data={optionsOrganizationList}
              label="Organization"
              selectedValue={selectedOrganization}
              setSelectedValue={(val) => {
                console.log(val);
                setSelectedOrganization(val);
              }}
            />
          </div>
        </div>

        <CardBody className="mt-[32px]">
          <Tabs
            defaultActiveTab={currentActiveTab}
            setDefaultActiveTab={setCurrentActiveTab}
          >
            <Tab label="Members List">
              <TabPanel>
                <MembersList
                  selectedOrganization={selectedOrganization}
                  setSelectedOrganization={setSelectedOrganization}
                />
              </TabPanel>
            </Tab>
            <Tab label="Changes Logs">
              <TabPanel>
                <MembersList />
              </TabPanel>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </>
  );
};

export default OrganizationMembers;

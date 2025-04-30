//! abhijit changes
import { lazy, Suspense } from "react";

// load the breadcrumb component asynchronously. Don't load right away, wait until it's needed
const LazyBreadcrumb = lazy(() => import("@/components/Breadcrumb"));

// components
import { Card, CardBody } from "@/components/Card";
import { SkeletonBreadcrumb, SkeletonTab } from "@/components/Skeleton";
import { HorizontalScrollTabs } from "@/components/abhijit-component";
import { ChangesLog, MembersList } from "@/components/organization-members";

const breadcrumbItems = [
  {
    label: "Organization",
    url: "#",
  },
  { label: "Members" },
];

// note there is a possibility that this data can come from API
const tabLinks = [
  {
    name: "Members List",
    url: "/organization/members",
    component: MembersList,
    // modules: ""
  },
  {
    name: "Changes Log",
    url: "/organization/members/changes-log",
    component: ChangesLog,
  },
];

const OrganizationMembers = () => {
  return (
    <>
      <Card className="p-4 px-6 pb-0">
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="Organization" items={breadcrumbItems} />
        </Suspense>

        <CardBody className="mt-[32px]">
          <Suspense fallback={<SkeletonTab />}>
            <HorizontalScrollTabs tabLinks={tabLinks} />
          </Suspense>
        </CardBody>
      </Card>
    </>
  );
};

export default OrganizationMembers;

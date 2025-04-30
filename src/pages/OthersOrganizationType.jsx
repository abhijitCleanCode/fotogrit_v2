//! abhijit changes
import { lazy, Suspense } from "react";

// load the breadcrumb component asynchronously. Don't load right away, wait until it's needed
const LazyBreadcrumb = lazy(() => import("@/components/Breadcrumb"));
// lazy load the tab content component
// const OrganizationType = lazy(() =>
//   import("@/components/others-organization-type")
// );

import { OrganizationType } from "@/components/others-organization-type";
import { Card, CardBody, CardHeader } from "@/components/Card";
import { SkeletonBreadcrumb, SkeletonTab } from "@/components/Skeleton";
import { Tabs } from "@/components/Tabs";
import { HorizontalScrollTabs } from "@/components/abhijit-component";

const breadcrumbItems = [
  { label: "Settings", url: "#" },
  { label: "General Settings" },
];

const EventGroupType = () => {
  return <div>Event Group Type</div>;
};
const EventGroupRating = () => {
  return <div>Event Group Rating</div>;
};
const AgeGroup = () => {
  return <div>Age Group</div>;
};
const MatchCategory = () => {
  return <div>Match Category</div>;
};
const MainPosition = () => {
  return <div>Main Position</div>;
};

// note there is a possibility that this data can come from API
const tabLinks = [
  {
    name: "Event Group Type",
    url: "others/event-group-type",
    component: EventGroupType,
    // modules: ""
  },
  {
    name: "Event Group Rating",
    url: "others/event-group-rating",
    component: EventGroupRating,
    // modules: ""
  },
  {
    name: "Age Group",
    url: "others/age-group",
    component: AgeGroup,
    // modules: ""
  },
  {
    name: "Match Category",
    url: "others/match-category",
    component: MatchCategory,
    // modules: ""
  },
  {
    name: "Organization Type",
    url: "others/organization-type",
    component: OrganizationType,
    // modules: ""
  },
  {
    name: "Main Position",
    url: "others/main-position",
    component: MainPosition,
    // modules: ""
  },
];

const OthersOrganizationType = () => {
  return (
    <>
      <Card className="p-4 px-6 pb-0">
        {/* <CardHeader> */}
        <Suspense fallback={<SkeletonBreadcrumb />}>
          <LazyBreadcrumb title="General Settings" items={breadcrumbItems} />
        </Suspense>
        {/* </CardHeader> */}

        <CardBody className="mt-[32px]">
          <Suspense fallback={<SkeletonTab />}>
            <HorizontalScrollTabs tabLinks={tabLinks} />
          </Suspense>
        </CardBody>
      </Card>
    </>
  );
};

export default OthersOrganizationType;

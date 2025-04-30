import React, { Suspense, useState } from "react";
import { Breadcrumb } from "@/components";
import { Card, CardBody, CardHeader } from "@/components/Card";
import { SkeletonTab } from "@/components/Skeleton";
import { Tab, TabPanel, Tabs } from "@/components/Tabs";
import ReportPerWeek from "@/components/reports/week/ReportPerWeek";
import { CurrencyFormat } from "@/helpers/CurrencyFormat";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import TotalNewMediaSalesChart from "@/components/report-dashboard/TotalNewMediaSalesCart";
import TopSalesByUser from "@/components/report-dashboard/TopSalesByUser";
import TopSalesByClub from "@/components/report-dashboard/TopSalesByClub";
import TopSalesByEventGroup from "@/components/report-dashboard/TopSalesByEventGroup";
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardTimeFilter, setDashboardTimeFilter } from '@/services/state/reportSlice';
import TotalUserSignupChart from "@/components/report-dashboard/TotalUserSignupChart";
import TotalUserActivesChart from "@/components/report-dashboard/TotalUserActivesChart";
import TotalUserPurchasesChart from "@/components/report-dashboard/TotalUserPurchasesChart";
import TotalFaceRecognitionsChart from "@/components/report-dashboard/TotalFaceRecognitionsChart";

const FilterRadioButton = ({ selectedFilter, onFilterChange }) => {
  const handleFilterChange = (value) => {
    onFilterChange(value);
  };

  return (
    <div className="relative flex bg-white border-white border-1">
      <nav className="flex gap-2 border border-black-600 rounded-md">
        <div
          role="button"
          className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          <label
            htmlFor="today"
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <div className="inline-flex items-center">
              <label
                className="relative flex items-center cursor-pointer"
                htmlFor="today"
              >
                <input
                  name="timeFilter"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  id="today"
                  checked={selectedFilter === 'today'}
                  onChange={() => handleFilterChange('today')}
                />
                <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-xs"
                htmlFor="today"
              >
                Today
              </label>
            </div>
          </label>
        </div>
        <div
          role="button"
          className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          <label
            htmlFor="weekly"
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <div className="inline-flex items-center">
              <label
                className="relative flex items-center cursor-pointer"
                htmlFor="weekly"
              >
                <input
                  name="timeFilter"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  id="weekly"
                  checked={selectedFilter === 'weekly'}
                  onChange={() => handleFilterChange('weekly')}
                />
                <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-xs"
                htmlFor="weekly"
              >
                This Week
              </label>
            </div>
          </label>
        </div>
        <div
          role="button"
          className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          <label
            htmlFor="monthly"
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <div className="inline-flex items-center">
              <label
                className="relative flex items-center cursor-pointer"
                htmlFor="monthly"
              >
                <input
                  name="framework"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  id="monthly"
                  checked={selectedFilter === 'monthly'}
                  onChange={() => handleFilterChange('monthly')}
                />
                <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-xs"
                htmlFor="monthly"
              >
                This Month
              </label>
            </div>
          </label>
        </div>
        <div
          role="button"
          className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          <label
            htmlFor="yearly"
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <div className="inline-flex items-center">
              <label
                className="relative flex items-center cursor-pointer"
                htmlFor="yearly"
              >
                <input
                  name="framework"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  id="yearly"
                  checked={selectedFilter === 'yearly'}
                  onChange={() => handleFilterChange('yearly')}
                />
                <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-xs"
                htmlFor="yearly"
              >
                This Year
              </label>
            </div>
          </label>
        </div>
        <div
          role="button"
          className="flex w-full items-center rounded-lg p-0 transition-all hover:bg-slate-100 focus:bg-slate-100 active:bg-slate-100"
        >
          <label
            htmlFor="all-time"
            className="flex w-full cursor-pointer items-center px-3 py-2"
          >
            <div className="inline-flex items-center">
              <label
                className="relative flex items-center cursor-pointer"
                htmlFor="all-time"
              >
                <input
                  name="framework"
                  type="radio"
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                  id="all-time"
                  checked={selectedFilter === 'all-time'}
                  onChange={() => handleFilterChange('all-time')}
                  />
                <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </label>
              <label
                className="ml-2 text-slate-600 cursor-pointer text-xs"
                htmlFor="all-time"
              >
                All Time
              </label>
            </div>
          </label>
        </div>
      </nav>
    </div>
  );
};
const CardItem = (props) => {
  const { label, subtitle, text, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={`w-full h-24 p-3 flex justify-between items-center rounded-lg cursor-pointer`}
      style={{ backgroundColor: "#A17F58" }}
    >
      <div className="text-center w-full">
        <p className="text-gray-200 text-md  font-light">{label}</p>
        <h3 className="text-white font-bold text-xl">{text}</h3>
      </div>
    </div>
  );
};
const CardTableItem = (props) => {
  const { label, text, items, total, onClick } = props;
  return (
    <div
      onClick={onClick}
      className={`w-full h-24 p-3 flex justify-between items-center rounded-lg cursor-pointer`}
      style={{ backgroundColor: "#A17F58" }}
    >
      <div className="text-center w-full">
        <p className="text-gray-100 text-md font-light">{label}</p>

        <ul className="text-xs text-white">
          {items.map((item, index) => (
            <li className="flex justify-between" key={index}>
              <div>{item.user}</div>
              <div>{CurrencyFormat(item.sales)}</div>
            </li>
          ))}
          {total ? (
            <li className="flex justify-between">
              <div>Average Total</div>
              <div>{CurrencyFormat(total)}</div>
            </li>
          ) : undefined}
        </ul>
      </div>
    </div>
  );
};

const breadcrumbItems = [
  { label: "Reports", url: "#" },
  { label: "Dashboard" },
];

const DashboardNavigator = ({ title, onNext, onPrevious }) => {
  return (
    <div className="flex items-center gap-5 justify-center my-5">
      <button onClick={onPrevious}>
        <FaChevronLeft />
      </button>
      <p className="w-72 truncate text-center">{title} </p>
      <button onClick={onNext}>
        <FaChevronRight />
      </button>
    </div>
  );
};

const menuList = [
  "Total New Media Sales",
  "Total New Media Sales by User",
  "Total New Media Sales by Club",
  "Total New Media Sales by Event Group",
  "Total New Events Group & Events Created",
  "Total New Events Group & Events with Statgrit",
  "Total Unique Visitors to Web Page",
  "Total Views to Web Pages",
  "Total Users Sign Up",
  "Total Active Users (Check Mobile 4x/month)",
  "Total Users Making Purchase",
  "Total Users Using Face Recognition Filter",
  "Total Coin Top Up",
  "Top 3 Top Up Method",
  "Number of New Services per Service Provider",
  "Number of New Service Provider",
];

const getDateRangeFromFilter = (filter) => {
  const today = new Date();
  const startDate = new Date();
  const endDate = new Date();

  switch (filter) {
    case 'today':
      return { startDate: today, endDate: today };
      
    case 'weekly':
      startDate.setDate(today.getDate() - today.getDay());
      endDate.setDate(today.getDate() + (6 - today.getDay()));
      return { startDate, endDate };
      
    case 'monthly':
      startDate.setDate(1);
      endDate.setMonth(today.getMonth() + 1, 0);
      return { startDate, endDate };
      
    case 'yearly':
      startDate.setMonth(0, 1);
      endDate.setMonth(11, 31);
      return { startDate, endDate };
      
    case 'all-time':
      return null; // Or set a very old start date if needed
      
    default:
      return { startDate: today, endDate: today };
  }
};

const NewReportDashboard = () => {
  const [menuIndex, setMenuIndex] = useState(0);
  const dispatch = useDispatch();
  const timeFilter = useSelector(getDashboardTimeFilter);

  const handleTimeFilterChange = (filter) => {
    dispatch(setDashboardTimeFilter(filter));
  };

  const handlePreviousMenu = () => {
    if (menuIndex == 0) return;

    setMenuIndex(menuIndex - 1);
  };

  const handleNextMenu = () => {
    console.log("next clicked", menuIndex);
    if (menuIndex + 1 == menuList.length) return;

    setMenuIndex(menuIndex + 1);
  };

  return (
    <>
      <Card>
        <CardHeader className="relative flex">
          <Breadcrumb title="Dashboard" items={breadcrumbItems} />
        </CardHeader>

        <CardBody className="mb-5">
          <Suspense fallback={<SkeletonTab />}>
            <section className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 md:gap-3 mx-3 mt-3">
              <CardItem
                label="Total New Media Sales"
                text="Rp 15.000.000"
                onClick={() => setMenuIndex(0)}
              />

              <CardTableItem
                onClick={() => setMenuIndex(1)}
                label="Total 3 Sales by User"
                items={[
                  {
                    user: "C-0011",
                    sales: 2000000,
                  },
                  {
                    user: "C-0011",
                    sales: 1500000,
                  },
                  {
                    user: "C-0011",
                    sales: 1000000,
                  },
                ]}
                total={500000}
              />

              <CardTableItem
                onClick={() => setMenuIndex(2)}
                label="Top 3 Sales by Club"
                items={[
                  {
                    user: "CC111 - AirOne",
                    sales: 2000000,
                  },
                  {
                    user: "CC129 - Warriors",
                    sales: 1500000,
                  },
                  {
                    user: "CC050 - Victoria",
                    sales: 1000000,
                  },
                ]}
                total={500000}
              />

              <CardTableItem
                onClick={() => setMenuIndex(3)}
                label="Top 3 Sales by Event Group"
                items={[
                  {
                    user: "GC111 - Kejurprov",
                    sales: 2000000,
                  },
                  {
                    user: "GC129 - Playfield 2024",
                    sales: 1500000,
                  },
                  {
                    user: "GC050 - CSC2024",
                    sales: 1000000,
                  },
                ]}
                total={500000}
              />

              <CardItem
                onClick={() => setMenuIndex(4)}
                label="Total New Events Group & Events Created"
                text="2 | 200"
              />

              <CardItem
                onClick={() => setMenuIndex(5)}
                label="Total New Events Group & Events with Statgrit"
                text="1 | 100"
              />
              <CardItem
                label="Total Unique Visitors to Web Page"
                text="1000"
                onClick={() => setMenuIndex(6)}
              />
              <CardItem
                label="Total Views to Web Pages"
                text="3000"
                onClick={() => setMenuIndex(7)}
              />
              <CardItem
                label="Total Users Sign Up"
                text="200"
                onClick={() => setMenuIndex(8)}
              />
              <CardItem
                onClick={() => setMenuIndex(9)}
                label="Total Active Users (Check Mobile 4x/month)"
                subtitle="(Check Mobile 4x/month)"
                text="50"
              />
              <CardItem
                label="Total Users Making Purchase"
                text="30"
                onClick={() => setMenuIndex(10)}
              />
              <CardItem
                label="Total Users Using Face Recognition Filter"
                onClick={() => setMenuIndex(11)}
                text="20"
              />
              <CardItem
                onClick={() => setMenuIndex(12)}
                label="Total Coin Top Up"
                text={CurrencyFormat(5000000)}
              />

              <CardTableItem
                onClick={() => setMenuIndex(13)}
                label="Top 3 Top Up Method"
                items={[
                  {
                    user: "Credit Card	",
                    sales: 2000000,
                  },
                  {
                    user: "Bank Transfer",
                    sales: 1500000,
                  },
                  {
                    user: "GoPay",
                    sales: 1000000,
                  },
                ]}
              />

              <CardItem
                onClick={() => setMenuIndex(14)}
                label="Number of New Services per Service Provider"
                text="20"
              />
              <CardItem
                label="Number of New Service Provider"
                text="25"
                onClick={() => setMenuIndex(15)}
              />
            </section>

            <div className="m-3">
              <FilterRadioButton 
                selectedFilter={timeFilter}
                onFilterChange={handleTimeFilterChange}
              />
            </div>

            <div className="m-3">
              {menuIndex == 0 ? <TotalNewMediaSalesChart timeFilter={timeFilter} /> : undefined}
              {menuIndex == 1 ? <TopSalesByUser title={menuList[1]} timeFilter={timeFilter} /> : undefined}
              {menuIndex == 2 ? <TopSalesByClub title={menuList[2]} timeFilter={timeFilter}/> : undefined}
              {menuIndex == 3 ? <TopSalesByEventGroup title={menuList[3]} timeFilter={timeFilter}/> : undefined}
              {menuIndex == 8 ? <TotalUserSignupChart timeFilter={timeFilter} /> : undefined}
              {menuIndex == 9 ? <TotalUserActivesChart timeFilter={timeFilter} /> : undefined}
              {menuIndex == 10 ? <TotalUserPurchasesChart timeFilter={timeFilter} /> : undefined}
              {menuIndex == 11 ? <TotalFaceRecognitionsChart timeFilter={timeFilter} /> : undefined}
              
              <DashboardNavigator
                title={menuList[menuIndex]}
                onNext={handleNextMenu}
                onPrevious={handlePreviousMenu}
              />
            </div>
          </Suspense>
        </CardBody>
      </Card>
    </>
  );
};

export default NewReportDashboard;

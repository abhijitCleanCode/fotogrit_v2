import ReactApexChart from "react-apexcharts";
import { useGetTotalUserPurchasesQuery } from "@/services/api/dashboardApiSlice";
import { CurrencyFormat } from "@/helpers/CurrencyFormat";

const TotalUserPurchasesChart = ({ timeFilter }) => {
  const { data, isLoading } = useGetTotalUserPurchasesQuery({
    period: timeFilter,
  });

  // Format data for ApexCharts
  const formatChartData = (apiData) => {
    if (!apiData?.data)
      return {
        labels: [],
        daily: [],
        cumulative: [],
      };

    const chartData = apiData?.data?.dates?.reduce(
      (acc, item) => {
        // Format date based on timeFilter
        let formattedDate = item.period;

        if (timeFilter === "weekly") {
          const date = new Date(item.period);
          const dayName = date.toLocaleString("en-US", { weekday: "short" });
          const dayMonth = date.toLocaleString("en-US", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
          });
          formattedDate = [dayName, dayMonth];
        }

        acc.labels.push(formattedDate);
        acc.daily.push(item.total);
        acc.cumulative.push(item.cumulative);
        return acc;
      },
      {
        labels: [],
        daily: [],
        cumulative: [],
      }
    );

    return chartData;
  };

  const chartData = formatChartData(data);

  const series = [
    {
      name: "Daily",
      type: "column",
      data: chartData.daily,
      color: "#EEEEEE",
    },
    {
      name: "Cumulative",
      type: "line",
      data: chartData.cumulative,
      color: "#A17F58",
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
      colors: [undefined, "#A17F58"],
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
      formatter: function (value) {
        return value.toLocaleString();
      },
      style: {
        colors: ["#A17F58"],
      },
    },
    labels: chartData.labels,
    yaxis: [
      {
        title: {
          text: "",
        },
        labels: {
          formatter: function (value) {
            return value.toFixed(0);
          },
        },
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-5">
      <h3 className="text-3xl font-bold">Total Users Making Purchase</h3>
      <h5 className="">
        <em>
          {timeFilter === 'weekly' ? (
                        <>{data?.data?.period_info.text}</>
          ) : timeFilter === 'today' ? (
            new Date().toLocaleDateString('en-US', {weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'})
          ) : timeFilter === 'monthly' ? (
            new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
          ) : timeFilter === 'yearly' ? (
            new Date().toLocaleDateString('en-US', {year: 'numeric'})
          ) : 'All Time'}
        </em>
      </h5>
      <h5 className="">(Number of Users)</h5>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={400}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default TotalUserPurchasesChart;

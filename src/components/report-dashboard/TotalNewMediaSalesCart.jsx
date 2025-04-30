import ReactApexChart from "react-apexcharts";
import { useGetMediaSalesQuery } from "@/services/api/dashboardApiSlice";
import { CurrencyFormat } from "@/helpers/CurrencyFormat";

const TotalNewMediaSalesChart = ({ timeFilter }) => {
  const { data, isLoading } = useGetMediaSalesQuery({
    period: timeFilter,
  });

  // Format data for ApexCharts
  const formatChartData = (apiData) => {
    if (!apiData?.data?.datas)
      return {
        labels: [],
        daily: [],
        cumulative: [],
      };

    const chartData = apiData.data.datas.reduce(
      (acc, item) => {
        // Format date based on timeFilter
        let formattedDate = item.date;
        if (timeFilter === 'yearly') {
          // Convert YYYY-MM to MMM format
          const [year, month] = item.date.split('-');
          formattedDate = new Date(year, month - 1).toLocaleString('en-US', { month: 'short' });
        } else if (timeFilter === 'monthly') {
          const date = new Date(item.date);
          formattedDate = date.toLocaleString('en-US', { day: 'numeric'});
        } else if (timeFilter === 'weekly') {
          const date = new Date(item.date);
          const dateNew = `${date.getDate()}-${date.toLocaleString('en-US', { month: 'short' })}-${date.getFullYear().toString().slice(-2)}`;
          formattedDate = dateNew;
        }
        
        acc.labels.push(formattedDate);
        acc.daily.push(item.total_sales);
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
      color: '#EEEEEE'
    },
    {
      name: "Cumulative",
      type: "line",
      data: chartData.cumulative,
      color: '#A17F58'
    },
  ];

  const options = {
    chart: {
      height: 350,
      type: "line",
    },
    stroke: {
      width: [0, 4],
      colors: [undefined, '#A17F58']
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1],
      formatter: function(value) {
        return CurrencyFormat(value);
      },
      style: {
        colors: ['#A17F58']
      }
    },
    labels: chartData.labels,
    yaxis: [
      {
        title: {
          text: "",
        },
        labels: {
          formatter: function(value) {
            return CurrencyFormat(value);
          }
        }
      },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-5">
      <h3 className="text-3xl font-bold">Total New Media Sales</h3>
      <h5 className="">
        <em>
          {timeFilter === 'weekly' ? (
            <>Week {data?.data?.start_date ? new Date(data.data.start_date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}) : ''} to {data?.data?.end_date ? new Date(data.data.end_date).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'}) : ''}</>
          ) : timeFilter === 'today' ? (
            new Date().toLocaleDateString('en-US', {weekday: 'long', day: '2-digit', month: 'short', year: 'numeric'})
          ) : timeFilter === 'monthly' ? (
            new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
          ) : timeFilter === 'yearly' ? (
            new Date().toLocaleDateString('en-US', {year: 'numeric'})
          ) : 'All Time'}
        </em>
      </h5>
      <p>(Rp ribu)</p>
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

export default TotalNewMediaSalesChart;

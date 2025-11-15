import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const options = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#3C50E0', '#8FD0EF', '#0FADCF'],
  labels: ['Total Register Driver', 'Total Active Driver', 'Driver on Current Ride'],
  legend: {
    show: false,
    position: 'bottom',
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree = ({ registerDriver, activeDriver, driverOnRide }) => {
  const [series, setSeries] = useState([registerDriver, activeDriver, driverOnRide]);

  useEffect(() => {
    setSeries([registerDriver, activeDriver, driverOnRide]);
  }, [registerDriver, activeDriver, driverOnRide]);

  return (
    <div className="sm:px-7.5 col-span-12 rounded-lg border border-stroke bg-white dark:bg-black px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-2">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div className='p-6'>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Ride Analytics
          </h5>
        </div>
        <div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-y-3 sm:gap-x-4">
        <div className="sm:w-1/2 w-full px-2 sm:px-4 ">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-3 rounded-full bg-primary"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Total Register Driver</span>
              <span>{registerDriver}</span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-2 sm:px-4 ">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-3 rounded-full bg-[#8FD0EF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Total Active Driver</span>
              <span>{activeDriver}</span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-2 sm:px-4 ">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-3 rounded-full bg-[#0FADCF]"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span>Driver on Current Ride</span>
              <span>{driverOnRide}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
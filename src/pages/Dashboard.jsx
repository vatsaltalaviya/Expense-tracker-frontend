import { BarChart, pieArcLabelClasses, PieChart } from "@mui/x-charts";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getIncomeExpenseTrand,
  getRecentTrasaction,
  getSummary,
} from "../slice/summary.slice";
import { getIncome } from "../slice/income.slice";
import { getExpense } from "../slice/expense.slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const chartSetting = {
  yAxis: [
    {
      label: "Money (₹)",
      width: 60,
    },
  ],
  height: 330,
};

const Dashboard = () => {
  const id = useMemo(() => localStorage.getItem("userid"), []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summary, recentTransaction, summaryLoading, chartTrand } =
    useSelector((state) => state.summary);
  const { income, incomeLoading } = useSelector((state) => state.income);
  const { expense, expenseLoading } = useSelector((state) => state.expense);
  useEffect(() => {
    dispatch(getSummary());
    dispatch(getRecentTrasaction());
    dispatch(getIncomeExpenseTrand());
  }, []);
  useEffect(() => {
    dispatch(getIncome(id));
    dispatch(getExpense(id));
  }, [dispatch, id]);

  const RecentTransaction = useMemo(() => {
    return recentTransaction?.map((d) => {
      const dateObj = new Date(d.date);
      const formattedDate = `${String(dateObj.getDate()).padStart(
        2,
        "0"
      )}/${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}/${dateObj.getFullYear()}`;

      return {
        amount: d.amount,
        date: formattedDate,
        category: d.category,
        type: d.type,
      };
    });
  }, [recentTransaction]);
  const IncomeTransaction = useMemo(() => {
    return income?.map((d) => {
      const dateObj = new Date(d.date);
      const formattedDate = `${String(dateObj.getDate()).padStart(
        2,
        "0"
      )}/${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}/${dateObj.getFullYear()}`;

      return {
        amount: d.amount,
        date: formattedDate,
        catagory: d.category,
        id: d._id,
      };
    });
  }, [income]);
  const ExpenseTransaction = useMemo(() => {
    return expense?.map((d) => {
      const dateObj = new Date(d.date);
      const formattedDate = `${String(dateObj.getDate()).padStart(
        2,
        "0"
      )}/${String(dateObj.getMonth() + 1).padStart(
        2,
        "0"
      )}/${dateObj.getFullYear()}`;

      return {
        amount: d.amount,
        date: formattedDate,
        catagory: d.category,
        id: d._id,
      };
    });
  }, [expense]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formatChartData = (incomeData, expenseData) => {
    const monthlyData = months.map((month, index) => {
      const monthKey = `2025-${String(index + 1).padStart(2, "0")}`;

      const incomeItem = incomeData?.find((i) => i._id === monthKey);
      const expenseItem = expenseData?.find((e) => e._id === monthKey);

      return {
        month,
        income: incomeItem?.totalIncome || 0,
        expense: expenseItem?.totalExpense || 0,
      };
    });

    return monthlyData;
  };

  const monthlyDataset = formatChartData(
    chartTrand?.income,
    chartTrand?.expense
  );

    const handleDownloadExcel =async()=>{
        
        try {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/export/transaction/${id}`, {
            responseType: "blob", // 👈 Important to receive file as Blob
          })
         
          
          if(res.status == 200){
             // Create a blob from response
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
    
          // Create a download link
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "transaction-data.xlsx"; // Set filename
          link.click(); // Trigger download
    
          // Cleanup
          window.URL.revokeObjectURL(link.href);
          }
        } catch (error) {
          console.error(error);
          
        }
      }
      const handleDownloadPDF =async()=>{
        try {
          const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/export/transaction/pdf/${id}`, {
            responseType: "blob", // 👈 Important to receive file as Blob
          })
    
          
          if(res.status == 200){
             // Create a blob from response
          const blob = new Blob([res.data], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
    
          // Create a download link
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "Transaction-data.pdf"; // Set filename
          link.click(); // Trigger download
    
          // Cleanup
          window.URL.revokeObjectURL(link.href);
          }
        } catch (error) {
          console.error(error);
          
        }
      }

  return (
    <div className="py-2">
      <div className="w-full flex flex-col xl:flex-row gap-4 items-center py-4">
        <div className="w-full p-6 flex justify-between bg-violet-300 shadow-lg shadow-violet-400 rounded">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold">₹{summary?.totalIncome}</h1>
            <h1 className="text-xs font-semibold">Total Income</h1>
          </div>
          <div className="w-full flex justify-end items-center">
            <img
              className="w-10 "
              src="https://res.cloudinary.com/dbpleky0i/image/upload/v1752038225/image_ji8lre.png"
              alt=""
            />
          </div>
        </div>
        <div className="w-full p-6 flex justify-between bg-emerald-100 shadow-lg shadow-emerald-200 rounded">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold">₹{summary?.totalExpense}</h1>
            <h1 className="text-xs font-semibold">Total Expense</h1>
          </div>
          <div className="w-full flex justify-end items-center">
            <img
              className="w-10 "
              src="https://res.cloudinary.com/dbpleky0i/image/upload/v1752038225/savings_10618007_eshoub.png"
              alt=""
            />
          </div>
        </div>
        <div className="w-full p-6 flex justify-between bg-white  shadow-lg  rounded">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold">₹{summary?.balance}</h1>
            <h1 className="text-xs font-semibold">Total Balance</h1>
          </div>
          <div className="w-full flex justify-end items-center">
            <img
              className="w-10 "
              src="https://res.cloudinary.com/dbpleky0i/image/upload/v1752038225/savings_10618007_eshoub.png"
              alt=""
            />
          </div>
        </div>
      </div>

      <div className="w-full flex gap-2 items-center py-4">
        <div className="w-full">
          <h1 className="text-lg font-semibold">Expense</h1>
          <BarChart
            dataset={monthlyDataset}
            xAxis={[{ dataKey: "month" }]}
            series={[
              { dataKey: "income", label: "Income", color: "#34d399" },
              { dataKey: "expense", label: "Expense", color: "#f87171" },
            ]}
            height={350}
            {...chartSetting}
          />
        </div>
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-4 items-center py-4">
        <div className="w-full xl:w-1/2 shadow-lg shadow-zinc-300 rounded-xl py-2 px-2">
          <div className="flex w-full justify-between py-4">
            <h1 className="text-lg font-semibold">Expenses</h1>
            <button
              onClick={() => navigate("/expense")}
              className="text-xs px-2 py-1 rounded font-medium bg-zinc-200"
            >
              See All <i className="ri-arrow-right-line"></i>
            </button>
          </div>

          {expenseLoading ? (
            <TableLoading />
          ) : (
            <>
              {ExpenseTransaction?.slice(0, 5)?.map((data, id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg mt-2 hover:bg-zinc-100 transition-all duration-150 px-2 py-4"
                >
                  <div className="flex gap-4">
                    <div className="rounded ">
                      <img
                        className="w-10 "
                        src="https://res.cloudinary.com/dbpleky0i/image/upload/v1752038225/image_ji8lre.png"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-lg font-medium">{data.catagory}</h1>
                      <h3 className="text-xs text-gray-400 font-medium">
                        {data.date}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-200 rounded-lg text-red-500 font-semibold">
                    ₹{data.amount}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="w-full xl:w-1/2 shadow-lg shadow-zinc-300 rounded-xl py-2 px-2">
          <div className="flex w-full justify-between py-4">
            <h1 className="text-lg font-semibold">Income</h1>
            <button
              onClick={() => navigate("/income")}
              className="text-xs px-2 py-1 rounded font-medium bg-zinc-200"
            >
              See All <i className="ri-arrow-right-line"></i>
            </button>
          </div>

          {incomeLoading ? (
            <TableLoading />
          ) : (
            <>
              {IncomeTransaction.slice(0, 5)?.map((data, id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-lg mt-2 hover:bg-zinc-100 transition-all duration-150 px-2 py-4"
                >
                  <div className="flex gap-4">
                    <div className="rounded ">
                      <img
                        className="w-10 "
                        src="https://res.cloudinary.com/dbpleky0i/image/upload/v1752038225/image_ji8lre.png"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-lg font-medium">{data.catagory}</h1>
                      <h3 className="text-xs text-gray-400 font-medium">
                        {data.date}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-200 rounded-lg text-emerald-800 font-semibold">
                    ₹{data.amount}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <h1 className="text-lg font-semibold">Recent Transaction</h1>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-zinc-200"
            title="Export Excel"
            onClick={() => handleDownloadExcel()}
          >
            <i className="ri-file-excel-line"></i>
          </button>
          <button
            className="px-3 py-1 rounded bg-zinc-200"
            title="Export PDF"
            onClick={() => handleDownloadPDF()}
          >
            <i className="ri-file-pdf-2-line"></i>
          </button>
        </div>
      </div>
      <div className="w-full  shadow-lg px-4 py-4 overflow-y-auto ">
        <table className="w-full ">
          <thead>
            <tr>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 w-xl">
                ID
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 w-xl">
                Type
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 w-xl">
                Date
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 w-xl">
                Amount
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 w-xl">
                Category
              </td>
            </tr>
          </thead>
          <tbody>
            {RecentTransaction?.slice(0, 10)?.map((data, i) => (
              <tr key={i} className="hover:bg-gray-100">
                <td
                  className={`text-sm px-2 py-3 font-semibold border-t text-blue-500 border-t-gray-500/20`}
                >
                  {i + 1}
                </td>
                <td
                  className={`text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20`}
                >
                  {data.type}
                </td>
                <td
                  className={`text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20`}
                >
                  {data.date}
                </td>
                <td
                  className={`text-sm px-2 py-3 font-semibold border-t ${
                    data.type == "Expense" ? "text-red-800" : "text-emerald-800"
                  } border-t-gray-500/20`}
                >
                  <span
                    className={`rounded px-2 py-1 shrink-0 whitespace-nowrap ${
                      data.type == "Expense" ? "bg-red-100" : "bg-emerald-100"
                    }`}
                  >
                    {data.type == "Expense" ? "-" : "+"}₹{data.amount}
                  </span>
                </td>
                <td
                  className={`text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20`}
                >
                  {data.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
function TableLoading() {
  return [...Array(5)].map((_, idx) => (
    <div
      key={idx}
      className="flex items-center justify-between rounded-lg mt-2 px-2 py-4 animate-pulse bg-gray-100"
    >
      <div className="flex gap-4">
        <div className="rounded bg-gray-300 w-10 h-10" />
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-3 w-20 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-6 w-16 bg-gray-300 rounded" />
    </div>
  ));
}

import { BarChart, pieArcLabelClasses, PieChart } from "@mui/x-charts";
import React, {  useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdSavings } from "react-icons/md";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import {
  getIncomeExpenseTrand,
  getRecentTrasaction,
  getSummary,
} from "../slice/summary.slice";
import { getIncome } from "../slice/income.slice";
import { getExpense } from "../slice/expense.slice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { animate, motion } from "framer-motion";





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

  const [totalincome, settotalincome] = useState(0);
  const [totalexpense, settotalexpense] = useState(0);
  const [totalbal, settotalbal] = useState(0);
  const [mode, setmode] = useState('yearly');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summary, recentTransaction, chartTrand } = useSelector(
    (state) => state.summary
  );
  const { income, incomeLoading } = useSelector((state) => state.income);
  const { expense, expenseLoading } = useSelector((state) => state.expense);
  useEffect(() => {
    dispatch(getSummary());
    dispatch(getRecentTrasaction(1));
    dispatch(getIncomeExpenseTrand());
  }, []);
  useEffect(() => {
    dispatch(getIncome(id));
    dispatch(getExpense(id));
  }, [dispatch, id]);

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (
      summary?.totalIncome > 0 ||
      summary?.totalExpense > 0 ||
      summary?.balance > 0
    ) {
      if (!animated) {
        setAnimated(true);

        animate(0, summary.totalIncome || 0, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (latest) => settotalincome(Math.round(latest)),
        });

        animate(0, summary.totalExpense || 0, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (latest) => settotalexpense(Math.round(latest)),
        });

        animate(0, summary.balance || 0, {
          duration: 2,
          ease: "easeOut",
          onUpdate: (latest) => settotalbal(Math.round(latest)),
        });
      }
    }
  }, [summary, animated]);

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
        bgColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)})`,
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
        bgColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
          Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)})`,
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

  const formatChartData = (data) => {
    return data?.map(({ name, income, expense }) => ({
      month: name,
      income,
      expense,
    }));
  };

  const monthlyDataset = formatChartData(chartTrand);

  const handleDownloadExcel = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/export/transaction/${id}`,
        {
          responseType: "blob", // 👈 Important to receive file as Blob
        }
      );

      if (res.status == 200) {
        // Create a blob from response
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
  };
  const handleDownloadPDF = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/export/transaction/pdf/${id}`,
        {
          responseType: "blob", // 👈 Important to receive file as Blob
        }
      );

      if (res.status == 200) {
        // Create a blob from response
        const blob = new Blob([res.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
  };


  return (
    <div className="py-2 ">
      <div className="w-full flex flex-col xl:flex-row gap-4 items-center py-4">
        <div onClick={()=>navigate('/income')} className="w-full p-6 flex justify-between bg-primary text-white  rounded">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold">₹{totalincome}</h1>
            <h1 className="text-xs font-semibold">Total Income</h1>
          </div>
          <div className="w-full flex justify-end items-center">
            <MdSavings className="text-3xl" />
          </div>
        </div>
        <div onClick={()=>navigate('/expense')} className="w-full p-6 flex justify-between bg-secondary text-white rounded">
          <div className="shrink-0">
            <motion.h1 className="text-2xl font-semibold">
              ₹{totalexpense}
            </motion.h1>
            <h1 className="text-xs font-semibold">Total Expense</h1>
          </div>
          <div className="w-full flex justify-end items-center">
            <FaMoneyBillTrendUp className="text-3xl" />
          </div>
        </div>
        <div className="w-full p-6 flex justify-between bg-white dark:bg-zinc-800 dark:text-white  shadow-lg  rounded">
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold">₹{totalbal}</h1>
            <h1 className="text-xs font-semibold">Total Balance</h1>
          </div>
          <div className="w-full flex justify-end items-center">
            <FaMoneyBillWave className="text-3xl" />
          </div>
        </div>
      </div>

      <div className="w-full flex gap-2 bg-white dark:bg-zinc-800 dark:text-white rounded items-center py-4">
        <div className="w-full">
          <div className="flex w-full justify-between px-2">
            <h1 className="text-lg px-2 font-semibold">Statastics</h1>
            <select value={mode} onChange={(e)=>setmode(e.target.value)} className="px-4 py-2 rounded-lg  bg-white dark:bg-zinc-900 dark:text-white text-gray-700 focus:ring-1 ">
              <option value="yearly">Year</option>
              <option value="monthly">Month</option>
            </select>
          </div>
          <BarChart
            dataset={monthlyDataset||[]}
            xAxis={[{ dataKey: "month" }]}
            series={[
              { dataKey: "income", label: "Income", color: "#8033fb" },
              { dataKey: "expense", label: "Expense", color: "#fe6b3a" },
            ]}
            height={350}
            {...chartSetting}
            borderRadius={32}
          />
        </div>
      </div>

      <div className="w-full flex flex-col  xl:flex-row gap-4 items-center py-4">
        <div className="w-full xl:w-1/2 bg-white dark:bg-zinc-800 dark:text-white shadow-lg shadow-zinc-300 dark:shadow-none rounded-xl py-2 px-2">
          <div className="flex w-full justify-between py-4">
            <h1 className="text-lg font-semibold">Expenses</h1>
            <button
              onClick={() => navigate("/expense")}
              className="text-xs px-2 py-1 rounded font-medium bg-zinc-200 dark:bg-zinc-900"
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
                  className="flex items-center justify-between rounded-lg mt-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:shadow-none transition-all duration-150 px-2 py-4"
                >
                  <div className="flex gap-4">
                    <div className="rounded ">
                      <div
                        style={{
                          backgroundColor: data.bgColor,
                        }}
                        className={`rounded-full w-12 h-12 flex items-center justify-center text-white uppercase font-bold text-3xl text-center `}
                      >
                        {data.catagory[0]}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-lg font-medium">{data.catagory}</h1>
                      <h3 className="text-xs text-gray-400 font-medium">
                        {data.date}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-500 rounded-lg text-white font-semibold">
                    ₹{data.amount}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
        <div className="w-full xl:w-1/2 shadow-lg bg-white dark:bg-zinc-800 dark:text-white shadow-zinc-300 dark:shadow-zinc-600 dark:shadow-none rounded-xl py-2 px-2">
          <div className="flex w-full justify-between py-4">
            <h1 className="text-lg font-semibold">Income</h1>
            <button
              onClick={() => navigate("/income")}
              className="text-xs px-2 py-1 rounded font-medium bg-zinc-200  dark:bg-zinc-900"
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
                  className="flex items-center justify-between rounded-lg mt-2 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition-all duration-150 px-2 py-4"
                >
                  <div className="flex gap-4">
                    <div className="rounded ">
                      <div
                        style={{
                          backgroundColor: data.bgColor,
                        }}
                        className={`rounded-full w-12 h-12 flex items-center justify-center text-white uppercase font-bold text-3xl text-center `}
                      >
                        {data.catagory[0]}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <h1 className="text-lg font-medium">{data.catagory}</h1>
                      <h3 className="text-xs text-gray-400 font-medium">
                        {data.date}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-800 rounded-lg text-white font-semibold">
                    ₹{data.amount}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between mb-2">
        <h1 className="text-lg font-semibold">Recent Transaction</h1>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800"
            title="Export Excel"
            onClick={() => handleDownloadExcel()}
          >
            <i className="ri-file-excel-line"></i>
          </button>
          <button
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-800"
            title="Export PDF"
            onClick={() => handleDownloadPDF()}
          >
            <i className="ri-file-pdf-2-line"></i>
          </button>
          <button
            onClick={() => navigate("/alltransactions")}
            className="text-xs px-2 py-1 rounded font-medium bg-zinc-200 dark:bg-zinc-800"
          >
            See All <i className="ri-arrow-right-line"></i>
          </button>
        </div>
      </div>
      <div className="w-full bg-white dark:bg-zinc-800 dark:text-white shadow-lg shadow-zinc-300  rounded-lg dark:shadow-none px-4 py-4 overflow-y-auto ">
        <table className="w-full ">
          <thead>
            <tr>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 dark:text-gray-400 w-xl">
                ID
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 dark:text-gray-400 w-xl">
                Type
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 dark:text-gray-400 w-xl">
                Date
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 dark:text-gray-400 w-xl">
                Amount
              </td>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 dark:text-gray-400 w-xl">
                Category
              </td>
            </tr>
          </thead>
          <tbody>
            {RecentTransaction?.map((data, i) => (
              <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-800 ">
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
                  className={`text-sm px-2 py-3 font-semibold border-t text-white border-t-gray-500/20`}
                >
                  <span
                    className={`rounded px-2 py-1 shrink-0 whitespace-nowrap ${
                      data.type == "Expense" ? "bg-red-500" : "bg-emerald-500"
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

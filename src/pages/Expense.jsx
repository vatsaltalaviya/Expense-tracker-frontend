import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addExpense,
  deleteExpense,
  getExpense,
  getExpenseTrend,
} from "../slice/expense.slice";
import { BeatLoader } from "react-spinners";
import axios from "axios";
import useIsDarkMode from "../Hook/useIsDarkMode";

const Expense = () => {
  const [showAddExpense, setshowAddExpense] = useState(false);
  const [category, setcategory] = useState("");
  const [amount, setamount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [source, setsource] = useState("");
  const [desc, setdesc] = useState("");
  const [mode, setmode] = useState("yearly");
  const [bars, setBars] = useState(6); // default to 6

  const isDarkMode = useIsDarkMode();

  useEffect(() => {
    const handleResize = () => {
      setBars(window.innerWidth < 640 ? 4 : 6); // sm breakpoint in Tailwind is 640px
    };

    handleResize(); // call on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const {
    expense,
    expenseTrend,
    trendLoading,
    expenseLoading,
    AddexpenseLoading,
  } = useSelector((state) => state.expense);
  const id = localStorage.getItem("userid");

  useEffect(() => {
    dispatch(getExpense(id));
  }, []);
  useEffect(() => {
    dispatch(getExpenseTrend(mode));
  }, [mode]);

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
        category: d.category,
        id: d._id,
      };
    });
  }, [expense]);
  const ExpenseTrend = useMemo(() => {
    return expenseTrend?.filter((d) => d.expense !== 0);
  }, [expenseTrend]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const expenseData = {
      amount,
      note: desc,
      date,
      paymentMethod,
      source,
      category,
    };
    try {
      await dispatch(addExpense(expenseData))
        .unwrap()
        .then(() => {
          setshowAddExpense(false);
          dispatch(getExpense(id));
          dispatch(getExpenseTrend(mode));
        })
    } catch (error) {
      console.error(error);
    }
    setDate("");
    setamount("");
    setcategory("");
    setdesc("");
    setpaymentMethod("");
    setsource("");
  };

  const handleDelete = async (Id) => {
    try {
      await dispatch(deleteExpense(Id)).then(() => {
        dispatch(getExpense(id));
        dispatch(getExpenseTrend(mode));
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleDownloadExcel = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/export/expense/${id}`,
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
        link.download = "expense-data.xlsx"; // Set filename
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
        `${import.meta.env.VITE_BASE_URL}/export/expense/pdf/${id}`,
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
        link.download = "expense-data.pdf"; // Set filename
        link.click(); // Trigger download

        // Cleanup
        window.URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg px-2 py-2">
        <div className="flex justify-between">
          <div>
            <h1 className="text-lg font-medium">Expense Overview</h1>
            <h3 className="text-xs font-medium text-gray-400">
              Track your earning overtime and analyze your expense trands
            </h3>
          </div>
          <div className="space-x-3">
            <select
              value={mode}
              onChange={(e) => setmode(e.target.value)}
              className="px-4 py-2 rounded-lg  bg-white dark:text-white dark:bg-zinc-900 text-gray-700 focus:ring-1 "
            >
              <option value="yearly">Year</option>
              <option value="monthly">Month</option>
            </select>
            <button
              onClick={() => setshowAddExpense(true)}
              className="text-primary text-lg px-2 py-2 dark:text-white font-medium border bg-zinc-200/20 rounded border-zinc-500/15"
            >
              Add Expense
            </button>
          </div>
        </div>
        {trendLoading ? (
          <BarChartSkeleton bars={bars} />
        ) : (
          <ResponsiveContainer width="100%" height={400} className={`px-4`}>
            <BarChart width={600} height={300} data={ExpenseTrend}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDarkMode ? "#333" : "#fff", // dark/light background
                  borderRadius: "8px",
                  border: "none",
                }}
                itemStyle={{
                  color: isDarkMode ? "#fff" : "#000", // text color based on mode
                  fontSize: "14px",
                }}
                labelStyle={{ color: isDarkMode ? "#ccc" : "#333" }}
                formatter={(value, name) => [
                  `₹${value}`,
                  name === "income" ? "Income" : "Expense",
                ]}
              />
              <Legend />
              {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}

              <Bar
                dataKey="expense"
                name="Expense"
                fill="#fe6b3a"
                radius={[20, 20, 0, 0]}
                barSize={40}
                activeBar={{
                  stroke: "#333", // optional outline
                  strokeWidth: 1,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="w-full max-h-[50vh] mt-5 bg-white dark:bg-zinc-800 rounded-lg shadow-lg px-4 py-4 overflow-x-auto noscrollbar">
        <div className="flex py-1 justify-between">
          <h1 className="text-lg font-semibold">Expense</h1>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-900"
              title="Export Excel"
              onClick={() => handleDownloadExcel()}
            >
              <i className="ri-file-excel-line"></i>
            </button>
            <button
              className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-900"
              title="Export PDF"
              onClick={() => handleDownloadPDF()}
            >
              <i className="ri-file-pdf-2-line"></i>
            </button>
          </div>
        </div>
        <table className="w-full ">
          <thead>
            <tr>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 dark:text-gray-400 w-xl">
                ID
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
              <td className="text-sm px-2 py-1 font-medium text-center text-gray-600 dark:text-gray-400 w-xl">
                Delete
              </td>
            </tr>
          </thead>
          <tbody>
            {expenseLoading ? (
              <TableLoading />
            ) : (
              ExpenseTransaction?.map((data, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <td
                    className={`text-sm px-2 py-3 font-semibold border-t text-blue-500 border-t-gray-500/20`}
                  >
                    {i + 1}
                  </td>

                  <td
                    className={`text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20`}
                  >
                    {data.date}
                  </td>
                  <td
                    className={`text-sm px-2 py-3 font-semibold border-t  border-t-gray-500/20`}
                  >
                    <span className={`rounded px-2 py-1 `}>₹{data.amount}</span>
                  </td>
                  <td
                    className={`text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20`}
                  >
                    {data.category}
                  </td>
                  <td
                    className={`text-sm px-2 py-3 font-semibold border-t text-center border-t-gray-500/20`}
                  >
                    <button onClick={() => handleDelete(data.id)}>
                      <i className="ri-delete-bin-6-line"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showAddExpense && (
        <div className="w-full h-full fixed top-0 left-0 xl:translate-x-16 bg-zinc-900/40 flex items-center justify-center">
          <form
            onSubmit={handlesubmit}
            className="w-sm bg-white dark:text-white dark:bg-zinc-800 px-6 py-6 space-y-6 shadow-2xl inset-0 -shadow-lg rounded-xl"
          >
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">Add Expense</h1>
              <i
                onClick={() => setshowAddExpense(false)}
                className="ri-close-fill"
              ></i>
            </div>
            <div className="flex flex-col md:flex-row items-center border px-2 py-1 rounded gap-2">
              <input
                type="number"
                placeholder="Enter your Amount"
                className="px-2 flex-1 py-1  outline-none rounded appearance-none"
                value={amount}
                onChange={(e) => setamount(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row border px-2 py-1 rounded items-center gap-2">
              <input
                type="text"
                placeholder="Enter your Description"
                className="px-2 flex-1 py-1  outline-none rounded appearance-none"
                value={desc}
                onChange={(e) => setdesc(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row border px-2 py-1 rounded items-center gap-2">
              <input
                type="text"
                placeholder="Enter your source"
                className="px-2 flex-1 py-1  outline-none rounded appearance-none"
                value={source}
                onChange={(e) => setsource(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row border px-2 py-1 rounded items-center gap-2">
              <input
                type="text"
                placeholder="Enter Category"
                className="px-2 flex-1 py-1  outline-none rounded appearance-none"
                value={category}
                onChange={(e) => setcategory(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row border px-2 py-1 rounded items-center gap-2">
              <input
                type="text"
                placeholder="Enter payment Method"
                className="px-2 flex-1 py-1  outline-none rounded appearance-none"
                value={paymentMethod}
                onChange={(e) => setpaymentMethod(e.target.value)}
              />
            </div>
            <div className="border px-2 py-1 rounded">
              <input
                type="date"
                className="w-full py-1 px-2 outline-none rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <button className="flex-1 rounded text-xl px-1 py-1.5 font-semibold text-white bg-emerald-800">
                {AddexpenseLoading ? (
                  <BeatLoader size={6} color="#ffffff" />
                ) : (
                  "Add Expense"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default Expense;

function TableLoading() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="animate-pulse w-full">
          <td className="px-2 py-3 border-t border-t-gray-500/20">
            <div className="h-4 bg-gray-300 rounded w-10"></div>
          </td>
          <td className="px-2 py-3 border-t border-t-gray-500/20">
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </td>
          <td className="px-2 py-3 border-t border-t-gray-500/20">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </td>
          <td className="px-2 py-3 border-t border-t-gray-500/20">
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </td>
          <td className="px-2 py-3 border-t border-t-gray-500/20 text-center">
            <div className="h-4 bg-gray-300 rounded w-6 mx-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
function BarChartSkeleton({ bars }) {
  return (
    <div className="w-full h-[300px] p-4 animate-pulse bg-gray-100 rounded-xl">
      <div className="h-full flex items-end justify-between space-x-2">
        {Array.from({ length: bars }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <div
              className="bg-gray-300 rounded-md w-20"
              style={{ height: `${Math.random() * 100 + 50}px` }}
            ></div>
            <div className="w-6 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

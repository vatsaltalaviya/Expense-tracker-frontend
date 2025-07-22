import { BarChart, BarPlot, ChartContainer } from "@mui/x-charts";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addIncome,
  deleteIncome,
  getIncome,
  getIncomeTrend,
} from "../slice/income.slice";
import { BeatLoader } from "react-spinners";
import axios from "axios";

const Income = () => {
  const [showAddIncome, setshowAddIncome] = useState(false);
  const [category, setcategory] = useState("");
  const [amount, setamount] = useState("");
  const [date, setDate] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("");
  const [source, setsource] = useState("");
  const [desc, setdesc] = useState("");

  const dispatch = useDispatch();
  const { income, incomeTrend, trendLoading, incomeLoading, AddincomeLoading } =
    useSelector((state) => state.income);
  const id = localStorage.getItem("userid");
  useEffect(() => {
    dispatch(getIncome(id));
    dispatch(getIncomeTrend());
  }, []);

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
        category: d.category,
        id: d._id,
      };
    });
  }, [income]);
  const IncomeTrend = useMemo(() => {
    return incomeTrend?.map((d) => d.totalIncome);
  }, [incomeTrend]);
  const Incomelabel = useMemo(() => {
    return incomeTrend?.map((d) => d._id);
  }, [incomeTrend]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    const incomeData = {
      amount,
      note: desc,
      date,
      paymentMethod,
      source,
      category,
    };
    try {
      await dispatch(addIncome(incomeData))
        .then(() => setshowAddIncome(false))
        .then(() => dispatch(getIncome(id)));
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
      await dispatch(deleteIncome(Id)).then(() => {
        dispatch(getIncome(id));
        dispatch(getIncomeTrend());
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadExcel =async()=>{
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/export/income/${id}`, {
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
      link.download = "income-data.xlsx"; // Set filename
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
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/export/income/pdf/${id}`, {
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
      link.download = "income-data.pdf"; // Set filename
      link.click(); // Trigger download

      // Cleanup
      window.URL.revokeObjectURL(link.href);
      }
    } catch (error) {
      console.error(error);
      
    }
  }

  return (
    <div className="w-full">
      <div className="w-full bg-white shadow-lg rounded-lg px-2 py-2">
        <div className="flex justify-between">
          <div>
            <h1 className="text-lg font-medium">Income Overview</h1>
            <h3 className="text-xs font-medium text-gray-400">
              Track your earning overtime and analyze your income trands
            </h3>
          </div>
          <button
            onClick={() => setshowAddIncome(true)}
            className="text-primary textolg px-2 py-2 font-medium border bg-zinc-200/20 rounded border-zinc-500/15"
          >
            Add Income
          </button>
        </div>
        {trendLoading ? (
          <BarChartSkeleton />
        ) : (
          <BarChart
            height={300}
            series={[{ data: IncomeTrend, label: "Income", id: "pvId" }]}
            xAxis={[{ data: Incomelabel }]}
            yAxis={[{ width: 50 }]}
            loading={false}
          />
        )}
      </div>
      <div className="w-full bg-white rounded-lg max-h-[50vh] mt-5 shadow-lg px-4 py-4 overflow-x-auto noscrollbar">
        <div className="flex py-1 justify-between">
          <h1 className="text-lg font-semibold">Income</h1>
          <div className="flex gap-2">
            <button
            onClick={()=>handleDownloadExcel()}
              className="px-3 py-1 rounded bg-zinc-200"
              title="Export Excel"
            >
              <i className="ri-file-excel-line"></i>
            </button>
            <button
            onClick={()=>handleDownloadPDF()}
              className="px-3 py-1 rounded bg-zinc-200"
              title="Export PDF"
            >
              <i className="ri-file-pdf-2-line"></i>
            </button>
          </div>
        </div>
        <table className="w-full ">
          <thead>
            <tr>
              <td className="text-sm px-2 py-1 font-medium text-gray-600 w-xl">
                ID
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
              <td className="text-sm px-2 py-1 font-medium text-center text-gray-600 w-xl">
                Delete
              </td>
            </tr>
          </thead>
          <tbody>
            {incomeLoading ? (
              <TableLoading />
            ) : (
              IncomeTransaction?.map((data, i) => (
                <tr key={i} className="hover:bg-gray-100">
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
                    <button onClick={() => handleDelete(data.id)} type="button">
                      <i className="ri-delete-bin-6-line"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showAddIncome && (
        <div className="w-full h-full fixed top-0 left-0 xl:translate-x-16 bg-zinc-900/40 flex items-center justify-center">
          <form
            onSubmit={handlesubmit}
            className="w-sm bg-white px-6 py-6 space-y-6 shadow-2xl inset-0 -shadow-lg rounded-xl"
          >
            <div className="flex justify-between">
              <h1 className="text-xl font-semibold">Add Income</h1>
              <i
                onClick={() => setshowAddIncome(false)}
                className="ri-close-fill"
              ></i>
            </div>
            <div className="flex flex-col md:flex-row items-center border px-2 py-1 rounded gap-2">
              {/* <span className='text-lg font-medium w-32'>Amount</span> */}
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
                name="date"
                id="date"
                className="w-full py-1 px-2 outline-none rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-2">
              <button className="flex-1 rounded text-xl px-1 py-1.5 font-semibold text-white bg-emerald-800">
                {AddincomeLoading ? (
                  <BeatLoader size={6} color="#ffffff" />
                ) : (
                  "Add Income"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Income;
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
function BarChartSkeleton() {
  return (
    <div className="w-full h-[300px] p-4 animate-pulse bg-gray-100 rounded-xl">
      <div className="h-full flex items-end justify-between space-x-2">
        {Array.from({ length: 6 }).map((_, i) => (
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

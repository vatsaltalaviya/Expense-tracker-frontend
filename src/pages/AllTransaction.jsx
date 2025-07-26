import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecentTrasaction } from "../slice/summary.slice";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const AllTransaction = () => {
  const [pages, setPages] = useState(1);
    const id = useMemo(() => localStorage.getItem("userid"), []);
  const dispatch = useDispatch();
  const { recentTransaction, hasmore } = useSelector((state) => state.summary);

  useEffect(() => {
    dispatch(getRecentTrasaction(pages));
  }, [pages]);

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
    <div className="w-full shadow-lg px-4 py-4 bg-white dark:bg-zinc-800 rounded">
      <div className="flex justify-between items-center mb-2 ">
        <h1 className="text-lg font-semibold">All Transaction</h1>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-900"
            onClick={handleDownloadExcel}
          >
            <i className="ri-file-excel-line" />
          </button>
          <button
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-900"
            onClick={handleDownloadPDF}
          >
            <i className="ri-file-pdf-2-line" />
          </button>
        </div>
      </div>

      <div id="scrollableDiv" className="max-h-[480px] overflow-y-auto">
        <InfiniteScroll
          dataLength={recentTransaction.length}
          next={() => {
            if (hasmore) {
              setPages((p) => p + 1);
            }
          }}
          hasMore={hasmore}
          loader={hasmore ? <TableLoading /> : null}
          scrollableTarget="scrollableDiv"
        >
          <table className="w-full table-auto">
            <thead>
              <tr>
                <td className="text-sm w-4 px-2 py-1 font-medium text-gray-600 dark:text-gray-400">
                  ID
                </td>
                <td className="text-sm w-16 px-2 py-1 font-medium text-gray-600 dark:text-gray-400">
                  Type
                </td>
                <td className="text-sm w-26 px-2 py-1 font-medium text-gray-600 dark:text-gray-400">
                  Date
                </td>
                <td className="text-sm w-24 px-2 py-1 font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </td>
                <td className="text-sm w-24 px-2 py-1 font-medium text-gray-600 dark:text-gray-400">
                  Category
                </td>
              </tr>
            </thead>
            <tbody>
              {RecentTransaction?.map((data, i) => (
                <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="text-sm px-2 py-3 font-semibold text-blue-500 border-t border-t-gray-500/20">
                    {i + 1}
                  </td>
                  <td className="text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20">
                    {data.type}
                  </td>
                  <td className="text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20">
                    {data.date}
                  </td>
                  <td
                    className={`text-sm px-2 py-3  font-semibold border-t text-white border-t-gray-500/20`}
                  >
                    <span
                      className={`rounded px-2 py-1 whitespace-nowrap ${
                        data.type === "Expense"
                          ? "bg-red-500"
                          : "bg-emerald-500"
                      }`}
                    >
                      {data.type === "Expense" ? "-" : "+"}₹{data.amount}
                    </span>
                  </td>
                  <td className="text-sm px-2 py-3 font-semibold border-t border-t-gray-500/20">
                    {data.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AllTransaction;

function TableLoading() {
  return (
    <table className="w-full table-auto">
      <tbody>
        {[...Array(3)].map((_, i) => (
          <tr key={i} className="animate-pulse hover:bg-gray-100">
            <td className="px-2 py-3 border-t border-t-gray-500/20">
              <div className="h-4 w-4 bg-gray-300 rounded" />
            </td>
            <td className="px-2 py-3 border-t border-t-gray-500/20">
              <div className="h-4 w-12 bg-gray-300 rounded" />
            </td>
            <td className="px-2 py-3 border-t border-t-gray-500/20">
              <div className="h-4 w-24 bg-gray-300 rounded" />
            </td>
            <td className="px-2 py-3 border-t border-t-gray-500/20">
              <div className="h-6 w-20 bg-gray-300 rounded-full" />
            </td>
            <td className="px-2 py-3 border-t border-t-gray-500/20">
              <div className="h-4 w-24 bg-gray-300 rounded" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

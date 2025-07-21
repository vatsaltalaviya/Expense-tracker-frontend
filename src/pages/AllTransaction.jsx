import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getRecentTrasaction } from '../slice/summary.slice';
import axios from 'axios';




const AllTransaction = () => {


    const dispatch = useDispatch();
  const { recentTransaction , recentTransactionLoading } =
    useSelector((state) => state.summary);

  useEffect(() => {
    dispatch(getRecentTrasaction());
  }, []);

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
    <div className="w-full  shadow-lg px-4 py-4 overflow-y-auto ">
        <div className="flex justify-between">
        <h1 className="text-lg font-semibold">All Transaction</h1>
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
            {recentTransactionLoading?<TableLoading />:<>{RecentTransaction?.map((data, i) => (
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
            ))}</>}
          </tbody>
        </table>
      </div>
  )
}

export default AllTransaction
 function TableLoading (){
    return  <>{[...Array(5)].map((_, i) => (
    <tr key={i} className="animate-pulse hover:bg-gray-100">
      <td className="px-2 py-3 border-t border-t-gray-500/20">
        <div className="h-4 w-4 bg-gray-300 rounded" />
      </td>
      <td className="px-2 py-3 border-t border-t-gray-500/20">
        <div className="h-4 w-16 bg-gray-300 rounded" />
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
</>
 }

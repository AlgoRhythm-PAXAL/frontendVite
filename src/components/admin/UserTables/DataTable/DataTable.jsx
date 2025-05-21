import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DatePickerWithPresets } from "../../DatePicker";
import { format, isSameDay } from "date-fns";
import { ArrowDownUp } from "lucide-react";
import {toast} from 'sonner'
import axios from 'axios'

export function DataTable({
  title,
  collectionName,
  columns,
  data = [],
  onDelete,
  onUpdate,
  deleteEnabled = false,
  updateEnabled = false,
  deleteText = "Delete",
  updateText = "Update",
  showAllLabel = "Show All Entries",
  disableDateFilter = false,
  enableRowClick = true,
  onRowClick,
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAll, setShowAll] = useState(disableDateFilter);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const handleDeleteClick = (rowData) => {
    console.log(rowData)
    setRowToDelete(rowData);
    setDeleteDialogOpen(true);
  };

  
  // In DataTable component
  const confirmDelete = async () => {
  if (!rowToDelete) return;

  const toastId = toast.loading('Deleting branch...');
  try {

    const response = await axios.delete(`${backendURL}/admin/delete/branch/${rowToDelete._id}`,
      { withCredentials: true }
    );

    toast.success(response.data.message || 'Branch deleted successfully', {
      id: toastId,
    });
    setTimeout(() => window.location.reload(), 1000);
  } catch (error) {
    // 4. Show error notification
    toast.error(error.response?.data?.message || 'Deletion failed', {
      id: toastId,
    });
  } finally {
    // 5. Close dialog after all operations
    setDeleteDialogOpen(false);
    setRowToDelete(null);
  }
};

  // Memoized filtered and sorted data
  const filteredData = useMemo(() => {
    const baseData =
      disableDateFilter || showAll
        ? data
        : data.filter(
            (item) =>
              item?.createdAt &&
              isSameDay(new Date(item.createdAt), selectedDate)
          );

    return [...baseData].sort((a, b) => {
      // Only sort if showing all entries or date filter is disabled
      if (!disableDateFilter && !showAll) return 0;
      const dateA = new Date(a?.createdAt).getTime();
      const dateB = new Date(b?.createdAt).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  }, [data, selectedDate, sortOrder, showAll, disableDateFilter]);

  const enhancedColumns = useMemo(() => {
    const actionColumn = {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex space-x-2 max-w-20">
          {updateEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUpdate?.(row.original)}
              className="hover:bg-blue-50"
            >
              {updateText}
            </Button>
          )}
          {deleteEnabled && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteClick(row.original)}
              
            >
              {deleteText}
            </Button>
          )}
        </div>
      ),
    };

    return [
      {
        id: "rowNumber",
        header: "#",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        },
      },
      ...columns,
      ...(deleteEnabled || updateEnabled ? [actionColumn] : []),
    ];
  }, [
    columns,
    deleteEnabled,
    updateEnabled,
    onDelete,
    onUpdate,
    deleteText,
    updateText,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns: enhancedColumns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          )}
          {!disableDateFilter && !showAll && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">
                Showing entries from:
              </span>
              <span className="text-sm font-semibold text-gray-700">
                {format(selectedDate, "MMMM do, yyyy")}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          {!disableDateFilter && !showAll && (
            <DatePickerWithPresets
              onDateChange={setSelectedDate}
              className="w-full sm:w-48"
            />
          )}
          <Input
            placeholder="Search entries..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 px-4 py-2 rounded-lg">
        <div className="flex items-center gap-4">
          {!disableDateFilter && (
            <div className="flex items-center space-x-2">
              <Switch
                id="show-all"
                checked={showAll}
                onCheckedChange={setShowAll}
              />
              <label
                htmlFor="show-all"
                className="text-sm font-medium text-gray-700"
              >
                {showAllLabel}
              </label>
            </div>
          )}

          {(showAll || disableDateFilter) && (
            <div className="flex items-center space-x-2">
              <ArrowDownUp className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Sort Order:
              </span>
              <Switch
                id="sort-order"
                checked={sortOrder === "desc"}
                onCheckedChange={(checked) =>
                  setSortOrder(checked ? "desc" : "asc")
                }
              />
              <label
                htmlFor="sort-order"
                className="text-sm font-medium text-gray-700"
              >
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </label>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500">
          Showing {filteredData.length} entries
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border shadow-sm overflow-hidden">
        <Table className="divide-y divide-gray-200 table-auto w-full">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-gray-50 ${
                    enableRowClick && onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={
                    enableRowClick
                      ? () => onRowClick?.(collectionName, row.original.itemId)
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-3 py-2 text-sm text-gray-900 max-w-[200px] truncate"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              // Empty state unchanged
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="px-3 py-4 text-center text-sm text-gray-500"
                >
                  {showAll || disableDateFilter
                    ? "No entries found"
                    : "No entries found for selected date"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete {rowToDelete?.location}?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this
              entry.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {" "}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// import { useState, useMemo } from 'react';
// import {
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   useReactTable,
// } from '@tanstack/react-table';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { DatePickerWithPresets } from "../../DatePicker";
// import { format } from 'date-fns';

// export function DataTable({
//   title,
//   columns,
//   data,
//   onDelete,
//   onUpdate,
//   deleteEnabled = false,
//   updateEnabled = false,
//   deleteText = "Delete",
//   updateText = "Update"
// }) {
//   const [globalFilter, setGlobalFilter] = useState('');

//   const enhancedColumns = useMemo(() => {
//     const actionColumn = {
//       id: 'actions',
//       header: 'Actions',
//       cell: ({ row }) => (
//         <div className="flex space-x-2 max-w-20">
//           {updateEnabled && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => onUpdate?.(row.original)}
//             >
//               {updateText}
//             </Button>
//           )}
//           {deleteEnabled && (
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => onDelete?.(row.original)}
//             >
//               {deleteText}
//             </Button>
//           )}
//         </div>
//       ),
//     };

//     return [
//       {
//         id: 'rowNumber',
//         header: '#',
//         cell: ({ row, table }) => {
//           const { pageIndex, pageSize } = table.getState().pagination;
//           return pageIndex * pageSize + row.index + 1;
//         },
//       },
//       ...columns,
//       ...(deleteEnabled || updateEnabled ? [actionColumn] : [])
//     ];
//   }, [columns, deleteEnabled, updateEnabled, onDelete, onUpdate, deleteText, updateText]);

//   const table = useReactTable({
//     data,
//     columns: enhancedColumns,
//     state: {
//       globalFilter,
//     },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     globalFilterFn: 'includesString',
//   });

//    const [selectedDate, setSelectedDate] = useState(new Date());
//     const formattedDate = format(selectedDate, 'MMMM do, yyyy ');
//   return (

//     <div className="">
//       {title && (
//         <h2 className="text-2xl font-semibold mb-4">{title}</h2>
//       )}
//       <div className="flex items-center justify-between">
//                 <h1 className="text-2xl">
//                   On <span className="font-semibold text-2xl">{formattedDate}</span>
//                 </h1>
//                 <div className="">
//                   <DatePickerWithPresets onDateChange={setSelectedDate} />
//                 </div>
//               </div>
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Search all columns..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={table.getAllColumns().length}
//                   className="h-24 text-center"
//                 >
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import {
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   useReactTable,
// } from '@tanstack/react-table';

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Make sure you have an Input component or use standard HTML input

// export function DataTable({ title,columns, data }) {
//   const [globalFilter, setGlobalFilter] = useState('');

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       globalFilter,
//     },
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     globalFilterFn: 'includesString', // Simple string inclusion filter
//   });

//   return (
//     <div className="">
//       {/* Search Input */}

//       {title && (
//         <h2 className="text-2xl font-semibold mb-4">{title}</h2>
//       )}
//       <div className="flex items-center py-4">
//         <Input
//           placeholder="Search all columns..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           className="max-w-sm"
//         />
//       </div>

//       {/* Table */}
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }

// import {
//     // ColumnDef,
//     flexRender,
//     getCoreRowModel,
//     getPaginationRowModel,
//     useReactTable,
//   } from '@tanstack/react-table';

//   import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table";

//   import { Button } from "@/components/ui/button"

//   export function DataTable({ columns, data }) {
//     const table = useReactTable({
//       data,
//       columns,
//       getCoreRowModel: getCoreRowModel(),
//       getPaginationRowModel: getPaginationRowModel(),
//     });
//     return (
//       <div className="">
//         <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   );
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//         <div className="flex items-center justify-end space-x-2 py-4">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.previousPage()}
//           disabled={!table.getCanPreviousPage()}
//         >
//           Previous
//         </Button>
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => table.nextPage()}
//           disabled={!table.getCanNextPage()}
//         >
//           Next
//         </Button>
//       </div>
//       </div>
//     );
//   }

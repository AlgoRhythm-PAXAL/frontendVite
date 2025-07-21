// import { useState, useMemo } from "react";
// import {
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getFilteredRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";

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
// import { Switch } from "@/components/ui/switch";
// import { DatePickerWithPresets } from "../../DatePicker";
// import { format, isSameDay } from "date-fns";
// import { ArrowDownUp } from "lucide-react";
// import { toast } from "sonner";
// import axios from "axios";

// export function DataTable({
//   title,
//   collectionName,
//   columns,
//   data = [],
//   onDelete,
//   onUpdate,
//   deleteEnabled = false,
//   updateEnabled = false,
//   deleteText = "Delete",
//   updateText = "Update",
//   showAllLabel = "Show All Entries",
//   disableDateFilter = false,
//   sorting = true,
//   enableRowClick = true,
//   onRowClick,
//   updateAPI,
//   deleteAPI,
//   renderUpdateForm,
// }) {
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [showAll, setShowAll] = useState(disableDateFilter);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
//   const [rowToDelete, setRowToDelete] = useState(null);
//   const [formData, setFormData] = useState({});

//   const [pagination, setPagination] = useState({
//     pageIndex: 0,
//     pageSize: 20, // Set default page size to 20
//   });

//   const handleDeleteClick = (rowData) => {
//     setRowToDelete(rowData);
//     setDeleteDialogOpen(true);
//   };

//   const handleDelete = async () => {
//     if (!rowToDelete) return;

//     const toastId = toast.loading(`Deleting ${title}...`);
//     try {
//       const response = await axios.delete(`${deleteAPI}/${rowToDelete._id}`, {
//         withCredentials: true,
//       });

//       toast.success(response.data.message || `${title} deleted successfully`, {
//         id: toastId,
//       });
//       setTimeout(() => window.location.reload(), 1000);
//     } catch (error) {
//       // 4. Show error notification
//       toast.error(error.response?.data?.message || "Deletion failed", {
//         id: toastId,
//       });
//     } finally {
//       // 5. Close dialog after all operations
//       setDeleteDialogOpen(false);
//       setRowToDelete(null);
//     }
//   };

//   const handleEditClick = (rowData) => {
//     setRowToDelete(rowData);
//     setFormData({ rowData });
//     setUpdateDialogOpen(true);
//   };

//   const handleUpdate = async () => {
//     const toastId = toast.loading("Saving changes...");
//     try {
//       const response = await axios.put(
//         `${updateAPI}/${rowToDelete._id}`,
//         formData,
//         { withCredentials: true }
//       );
//       toast.success(response.data.message || `${title} updated successfully`, {
//         id: toastId,
//       });

//       setUpdateDialogOpen(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Update failed", {
//         id: toastId,
//       });
//     }
//   };

//   // Memoized filtered and sorted data
//   const filteredData = useMemo(() => {
//     const baseData =
//       disableDateFilter || showAll
//         ? data
//         : data.filter(
//             (item) =>
//               item?.createdAt &&
//               isSameDay(new Date(item.createdAt), selectedDate)
//           );

//     return [...baseData].sort((a, b) => {
//       // Only sort if showing all entries or date filter is disabled
//       if (!disableDateFilter && !showAll) return 0;
//       const dateA = new Date(a?.createdAt).getTime();
//       const dateB = new Date(b?.createdAt).getTime();
//       return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
//     });
//   }, [data, selectedDate, sortOrder, showAll, disableDateFilter]);

//   const enhancedColumns = useMemo(() => {
//     const actionColumn = {
//       id: "actions",
//       header: "Actions",
//       cell: ({ row }) => (
//         <div className="flex space-x-2 max-w-20">
//           {updateEnabled && (
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => handleEditClick(row.original)}
//               className="hover:bg-blue-50"
//             >
//               {updateText}
//             </Button>
//           )}
//           {deleteEnabled && (
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => handleDeleteClick(row.original)}
//             >
//               {deleteText}
//             </Button>
//           )}
//         </div>
//       ),
//     };

//     return [
//       {
//         id: "rowNumber",
//         header: "#",
//         cell: ({ row, table }) => {
//           const { pageIndex, pageSize } = table.getState().pagination;
//           return pageIndex * pageSize + row.index + 1;
//         },
//       },
//       ...columns,
//       ...(deleteEnabled || updateEnabled ? [actionColumn] : []),
//     ];
//   }, [
//     columns,
//     deleteEnabled,
//     updateEnabled,
//     onDelete,
//     onUpdate,
//     deleteText,
//     updateText,
//   ]);

//   const table = useReactTable({
//     data: filteredData,
//     columns: enhancedColumns,
//     state: {
//       globalFilter,
//       pagination: { pageIndex: 0, pageSize: 20 },
//     },
//     onPaginationChange: setPagination,
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     globalFilterFn: "includesString",
//   });

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
//         <div className="space-y-2">
//           {title && (
//             <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
//           )}
//           {!disableDateFilter && !showAll && (
//             <div className="flex items-center space-x-2">
//               <span className="text-sm font-medium text-gray-500">
//                 Showing entries from:
//               </span>
//               <span className="text-sm font-semibold text-gray-700">
//                 {format(selectedDate, "MMMM do, yyyy")}
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
//           {!disableDateFilter && !showAll && (
//             <DatePickerWithPresets
//               onDateChange={setSelectedDate}
//               className="w-full sm:w-48"
//             />
//           )}
//           <Input
//             placeholder="Search entries..."
//             value={globalFilter}
//             onChange={(e) => setGlobalFilter(e.target.value)}
//             className="max-w-sm"
//           />
//         </div>
//       </div>

//       {/* Controls Section */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 px-4 py-2 rounded-lg">
//         <div className="flex items-center gap-4">
//           {!disableDateFilter && (
//             <div className="flex items-center space-x-2">
//               <Switch
//                 id="show-all"
//                 checked={showAll}
//                 onCheckedChange={setShowAll}
//               />
//               <label
//                 htmlFor="show-all"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 {showAllLabel}
//               </label>
//             </div>
//           )}

//           {(showAll || disableDateFilter) && sorting && (
//             <div className="flex items-center space-x-2">
//               <ArrowDownUp className="h-4 w-4 text-gray-500" />
//               <span className="text-sm font-medium text-gray-700">
//                 Sort Order:
//               </span>
//               <Switch
//                 id="sort-order"
//                 checked={sortOrder === "desc"}
//                 onCheckedChange={(checked) =>
//                   setSortOrder(checked ? "desc" : "asc")
//                 }
//               />
//               <label
//                 htmlFor="sort-order"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 {sortOrder === "desc" ? "Newest First" : "Oldest First"}
//               </label>
//             </div>
//           )}
//         </div>

//         <div className="text-sm text-gray-500">
//           Showing {filteredData.length} entries
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="rounded-lg border shadow-sm overflow-hidden">
//         <Table className="divide-y divide-gray-200 table-auto w-full">
//           <TableHeader className="bg-gray-50">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
//                   >
//                     {flexRender(
//                       header.column.columnDef.header,
//                       header.getContext()
//                     )}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody className="bg-white divide-y divide-gray-200">
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   key={row.id}
//                   className={`hover:bg-gray-50 ${
//                     enableRowClick && onRowClick ? "cursor-pointer" : ""
//                   }`}
//                   onClick={
//                     enableRowClick
//                       ? () =>
//                           onRowClick?.(
//                             collectionName,
//                             row.original._id,
//                             row.original.parcelId || row.original.driverId || row.original.userId || row.original.vehicleId || row.original.staffId || row.original.adminId 
//                           )
//                       : undefined
//                   }
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell
//                       key={cell.id}
//                       className="px-3 py-2 text-sm text-gray-900 max-w-[200px] truncate"
//                     >
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext()
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               // Empty state unchanged
//               <TableRow>
//                 <TableCell
//                   colSpan={table.getAllColumns().length}
//                   className="px-3 py-4 text-center text-sm text-gray-500"
//                 >
//                   {showAll || disableDateFilter
//                     ? "No entries found"
//                     : "No entries found for selected date"}
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Section */}
//       <div className="flex items-center justify-between px-2">
//         <div className="text-sm text-gray-700">
//           Page {table.getState().pagination.pageIndex + 1} of{" "}
//           {table.getPageCount()}
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             className="px-4 py-2 border rounded-md hover:bg-gray-50"
//           >
//             Previous
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             className="px-4 py-2 border rounded-md hover:bg-gray-50"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               Are you sure you want to delete {rowToDelete?.location}?
//             </DialogTitle>
//             <DialogDescription>
//               This action cannot be undone. This will permanently delete this
//               entry.
//             </DialogDescription>
//           </DialogHeader>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button variant="destructive" onClick={handleDelete}>
//               {" "}
//               Delete
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
//         <DialogContent className="max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Update {title} Details</DialogTitle>
//             <DialogDescription>
//               Modify the details for this entry.
//             </DialogDescription>
//           </DialogHeader>

//           {renderUpdateForm ? (
//             renderUpdateForm(formData, setFormData, rowToDelete)
//           ) : (
//             <div className="text-sm text-gray-500">
//               No update form provided.
//             </div>
//           )}

//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setUpdateDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button onClick={handleUpdate}>Save Changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



import React, { useState, useMemo, useCallback } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DatePickerWithPresets } from "../../DatePicker";
import { format, isSameDay } from "date-fns";
import {
  ArrowDownUp,
  Search,
  Calendar,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export function DataTable({
  title,
  collectionName,
  columns = [],
  data = [],
  onDelete,
  onUpdate,
  deleteEnabled = false,
  updateEnabled = false,
  deleteText = "Delete",
  updateText = "Update",
  showAllLabel = "Show All Entries",
  disableDateFilter = false,
  sorting = true,
  enableRowClick = true,
  onRowClick,
  updateAPI,
  deleteAPI,
  renderUpdateForm,
}) {
  // State management
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAll, setShowAll] = useState(disableDateFilter);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [formData, setFormData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  // Memoized error check for data
  const dataError = useMemo(() => {
    if (!Array.isArray(data)) {
      return "Invalid data format provided";
    }
    if (!Array.isArray(columns) || columns.length === 0) {
      return "No columns defined for table";
    }
    return null;
  }, [data, columns]);

  // Enhanced delete handler
  const handleDeleteClick = useCallback((rowData) => {
    if (!rowData || !rowData._id) {
      toast.error("Unable to delete: Invalid row data");
      return;
    }
    setRowToDelete(rowData);
    setDeleteDialogOpen(true);
    setError(null);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!rowToDelete || !deleteAPI) {
      toast.error("Delete operation failed: Missing required data");
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading(`Deleting ${title}...`);

    try {
      const response = await axios.delete(`${deleteAPI}/${rowToDelete._id}`, {
        withCredentials: true,
        timeout: 10000, // 10 second timeout
      });

      toast.success(response.data.message || `${title} deleted successfully`, {
        id: toastId,
      });

      // Call parent delete handler if provided
      if (onDelete) {
        onDelete(rowToDelete._id);
      }

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while deleting";

      console.error("Delete operation failed:", error);
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setRowToDelete(null);
    }
  }, [rowToDelete, deleteAPI, title, onDelete]);

  // Enhanced update handler
  const handleEditClick = useCallback((rowData) => {
    if (!rowData || !rowData._id) {
      toast.error("Unable to edit: Invalid row data");
      return;
    }
    setRowToDelete(rowData);
    setFormData({ ...rowData });
    setUpdateDialogOpen(true);
    setError(null);
  }, []);

  const handleUpdate = useCallback(async () => {
    if (!rowToDelete || !updateAPI) {
      toast.error("Update operation failed: Missing required data");
      return;
    }

    setIsUpdating(true);
    const toastId = toast.loading("Saving changes...");

    try {
      const response = await axios.put(
        `${updateAPI}/${rowToDelete._id}`,
        formData,
        {
          withCredentials: true,
          timeout: 10000,
        }
      );

      toast.success(response.data.message || `${title} updated successfully`, {
        id: toastId,
      });

      // Call parent update handler if provided
      if (onUpdate) {
        onUpdate(rowToDelete._id, formData);
      }

      setUpdateDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating";

      console.error("Update operation failed:", error);
      toast.error(errorMessage, { id: toastId });
      setError(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  }, [rowToDelete, updateAPI, formData, title, onUpdate]);

  // Enhanced row click handler
  const handleRowClick = useCallback(
    (row) => {
      if (!enableRowClick || !onRowClick) return;

      const rowData = row.original;
      if (!rowData || !rowData._id) {
        console.warn("Row click: Invalid row data", rowData);
        return;
      }

      const givenId =
        rowData.parcelId ||
        rowData.driverId ||
        rowData.userId ||
        rowData.vehicleId ||
        rowData.staffId ||
        rowData.adminId ||
        rowData.branchId ||
        rowData._id;

      onRowClick(collectionName, rowData._id, givenId);
    },
    [enableRowClick, onRowClick, collectionName]
  );

  // Memoized filtered and sorted data
  const filteredData = useMemo(() => {
    try {
      const baseData =
        disableDateFilter || showAll
          ? data
          : data.filter(
              (item) =>
                item?.createdAt &&
                isSameDay(new Date(item.createdAt), selectedDate)
            );

      return [...baseData].sort((a, b) => {
        if (!disableDateFilter && !showAll) return 0;
        const dateA = new Date(a?.createdAt).getTime();
        const dateB = new Date(b?.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
    } catch (error) {
      console.error("Error filtering data:", error);
      return [];
    }
  }, [data, selectedDate, sortOrder, showAll, disableDateFilter]);

  // Enhanced columns with error handling
  const enhancedColumns = useMemo(() => {
    try {
      const actionColumn = {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2 max-w-32">
            {updateEnabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(row.original);
                }}
                className="hover:bg-blue-50 text-xs"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  updateText
                )}
              </Button>
            )}
            {deleteEnabled && (
              <Button
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(row.original);
                }}
                className="text-xs"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  deleteText
                )}
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
    } catch (error) {
      console.error("Error creating columns:", error);
      return columns;
    }
  }, [
    columns,
    deleteEnabled,
    updateEnabled,
    deleteText,
    updateText,
    handleDeleteClick,
    handleEditClick,
    isDeleting,
    isUpdating,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns: enhancedColumns,
    state: {
      globalFilter,
      pagination,
    },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
  });

  // Error state
  if (dataError) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{dataError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          )}
          {!disableDateFilter && !showAll && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-500">Showing entries from:</span>
              <span className="font-semibold text-gray-700">
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search entries..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 px-4 py-3 rounded-lg border">
        <div className="flex items-center gap-6">
          {!disableDateFilter && (
            <div className="flex items-center space-x-2">
              <Switch
                id="show-all"
                checked={showAll}
                onCheckedChange={setShowAll}
              />
              <label
                htmlFor="show-all"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {showAllLabel}
              </label>
            </div>
          )}

          {(showAll || disableDateFilter) && sorting && (
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
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </label>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 font-medium">
          Showing {filteredData.length} of {data.length} entries
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border shadow-sm overflow-hidden bg-white">
        <Table className="divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
          <TableBody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    enableRowClick && onRowClick ? "cursor-pointer" : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-900 max-w-[250px] truncate"
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
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="px-4 py-8 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <AlertTriangle className="h-8 w-8 text-gray-300" />
                    <span>
                      {showAll || disableDateFilter
                        ? "No entries found"
                        : "No entries found for selected date"}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between px-2 py-4 border-t bg-gray-50 rounded-b-lg">
        <div className="text-sm text-gray-700">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Enhanced Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {title?.toLowerCase()}? This
              action cannot be undone and will permanently remove all associated
              data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Enhanced Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update {title} Details</DialogTitle>
            <DialogDescription>
              Modify the details for this entry. All changes will be saved
              immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {renderUpdateForm ? (
              renderUpdateForm(formData, setFormData, rowToDelete)
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No update form provided for this entry type.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
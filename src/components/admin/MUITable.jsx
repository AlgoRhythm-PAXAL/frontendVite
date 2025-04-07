// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';

// export default function StickyHeadTable({ data, headers }) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               {headers.map((header) => (
//                 <TableCell key={header} style={{ minWidth: 100 }}>
//                   {header.toUpperCase()}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
//               <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
//                 {headers.map((header) => (
//                   <TableCell key={header}>
//                     {row[header] !== undefined ? row[header] : '-'}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }


//Dense Rows by chatGPT

// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';

// export default function StickyHeadTable({ data, headers }) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="dense table" size="small">
//           <TableHead>
//             <TableRow>
//               {headers.map((header) => (
//                 <TableCell key={header} sx={{ minWidth: 80, padding: '4px 8px', fontWeight: 'bold' }}>
//                   {header.toUpperCase()}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
//               <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
//                 {headers.map((header) => (
//                   <TableCell key={header} sx={{ height: 30, padding: '4px 8px' }}>
//                     {row[header] !== undefined ? row[header] : '-'}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }


// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';

// export default function StickyHeadTable({ data, headers }) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="dense table" size="small">
//           <TableHead>
//             <TableRow>
//               {headers.map((header) => (
//                 <TableCell 
//                   key={header} 
//                   sx={{ minWidth: 80, padding: '8px 6px', fontWeight: 'bold' }}
                  
//                 >
//                   {header.toUpperCase()}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
//               <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
//                 {headers.map((header) => (
//                   <TableCell key={header} sx={{ height: 30, padding: '8px 6px' }}>
//                     {row[header] !== undefined ? row[header] : '-'}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{ fontSize: '0.875rem', padding: '4px 16px' }} 
//       />
//     </Paper>
//   );
// }


// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';

// export default function StickyHeadTable({ data, headers }) {
//   const [page, setPage] = React.useState(0);
//   const [rowsPerPage, setRowsPerPage] = React.useState(10);

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="dense table" size="small">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
//               {headers.map((header) => (
//                 <TableCell 
//                   key={header} 
//                   sx={{ 
//                     minWidth: 80, 
//                     padding: '8px 8px', 
//                     fontWeight: 550,  // Reduce font weight
//                     // color: '#9e9e9e',  // Lighter text color
//                     backgroundColor: '#fafafa' 
//                   }}
//                 >
//                   {header.toUpperCase()}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
//               <TableRow hover role="checkbox" tabIndex={-1} key={rowIndex}>
//                 {headers.map((header) => (
//                   <TableCell 
//                     key={header} 
//                     sx={{ 
//                       height: 28, 
//                       padding: '8px 8px', 
//                       fontWeight: 300, // Reduce font weight
//                     //   color: '#616161' // Slightly muted text color
//                     }}
//                   >
//                     {row[header] !== undefined ? row[header] : '-'}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={data.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//         sx={{ fontSize: '0.8rem', padding: '4px 16px', 
//             // color: '#757575'
//          }} 
//       />
//     </Paper>
//   );
// }


import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';

export default function MUITable({ data, headers, onDelete }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="data table" size="small">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell 
                  key={header}
                  sx={{
                    minWidth: 80,
                    padding: '12px 16px',
                    fontWeight: 600,
                    color: '#616161',
                    backgroundColor: '#f5f5f5',
                    borderBottom: '1px solid #e0e0e0',
                    ...(header === 'Actions' && { width: 100 })
                  }}
                >
                  {header.toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <TableRow 
                  hover 
                  key={rowIndex}
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        padding: '12px 16px',
                        color: '#424242',
                        borderBottom: '1px solid #f0f0f0',
                        ...(header === 'Actions' && {
                          textAlign: 'center'
                        })
                      }}
                    >
                      {header === 'Actions' && onDelete ? (
                        <Tooltip title="Delete" arrow>
                          <IconButton
                            aria-label="delete"
                            onClick={() => onDelete(row)}
                            sx={{
                              '&:hover': {
                                color: (theme) => theme.palette.error.main
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        row[header] ?? '-'
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: '1px solid #e0e0e0',
          '& .MuiTablePagination-selectLabel': {
            fontSize: '0.875rem'
          },
          '& .MuiTablePagination-displayedRows': {
            fontSize: '0.875rem'
          }
        }}
      />
    </Paper>
  );
}
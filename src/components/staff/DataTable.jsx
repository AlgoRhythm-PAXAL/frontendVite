import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  Box,
} from '@mui/material';

const DataTable = ({
  data = [],
  columns = [],
  rowsPerPage = [],
  actions = [],
  textMessage = [],
}) => {
  const [page, setPage] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedRows = data.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead className="bg-Primary">
            <TableRow>
              {columns.map((col, idx) => (
                <TableCell
                  key={idx}
                  className="[&&]:text-white  [&&]:text-[16px]"
                >
                  {col.label}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell />} {/* Actions Column */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  align="center"
                >
                  {textMessage}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </TableCell>
                  ))}
                  {Array.isArray(actions) && actions.length > 0 && (
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                      >
                        {actions.map((action, actionIndex) => (
                          <button
                            key={actionIndex}
                            className={action.className || ''}
                            onClick={() => action.onClick?.(row)}
                          >
                            {action.label || 'Action'}
                          </button>
                        ))}
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(data.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
        />
      </Box>
    </>
  );
};

export default DataTable;

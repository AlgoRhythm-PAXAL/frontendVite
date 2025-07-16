import React, { useState } from "react";
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
  Typography,
} from "@mui/material";

const DataTable = ({
  data = [],
  columns = [],
  rowsPerPage = [],
  actions = [],
  textMessage = [],
  getRowClassName = () => "",
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
      <Box sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            "& .MuiTableCell-root": {
              fontSize: "0.9rem",
            },
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead
              sx={{
                bgcolor: "#1f818c",
              }}
            >
              <TableRow>
                {columns.map((col, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      color: "common.white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      py: 2.5,
                      borderBottom: "none",
                      pl: 3,
                    }}
                  >
                    {col.label}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell
                    sx={{
                      color: "common.white",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      borderBottom: "none",
                      textAlign: "center",
                    }}
                  />
                )}{" "}
                {/* Action buttons Column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length ? 1 : 0)}
                    sx={{
                      py: 4,
                      textAlign: "center",
                      color: "text.secondary",
                      fontSize: "0.9rem",
                    }}
                  >
                    <Typography variant="body2">{textMessage}</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedRows.map((row, index) => (
                  <TableRow
                    key={index}
                    className={getRowClassName(row)}
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "action.hover",
                      },
                      "&:hover": {
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        sx={{
                          pl: 3,
                          borderBottom: "1px solid",
                          borderColor: "divider",
                          ...(column.numeric && { textAlign: "right" }),
                        }}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell
                        align="center"
                        sx={{
                          borderBottom: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={3}
                          justifyContent="center"
                        >
                          {actions.map((action, actionIndex) => (
                            <React.Fragment key={actionIndex}>
                              {action.render ? (
                                action.render(row)
                              ) : (
                                <button
                                  key={actionIndex}
                                  className={action.className || ""}
                                  onClick={() => action.onClick?.(row)}
                                >
                                  {action.label || "Action"}
                                </button>
                              )}
                            </React.Fragment>
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
        {data.length > rowsPerPage && (
          <Box display="flex" justifyContent="flex-end" mt={2} px={2}>
            <Pagination
              count={Math.ceil(data.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              shape="rounded"
              size="medium"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontSize: "0.875rem",
                },
                "& .Mui-selected": {
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        )}
      </Box>
    </>
  );
};

export default DataTable;

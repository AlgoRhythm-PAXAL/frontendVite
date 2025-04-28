import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination
} from "@mui/material";
import axios from "axios";

const ParcelTable = ({ apiUrl }) => {
  const headers = [
    "Parcel ID",
    "Lodge  Type",
    "Shipping Method",
    "Registered Date",
    "Status",
    "",
    "",
  ];

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    axios
      .get('http://localhost:8000/staff/lodging-management/get-all-parcels')
      .then((response) => {
        setRows(response.data);
  })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }

  constHandleRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
          {rows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell >{row.parcelId}</TableCell>
                <TableCell >{row.shippingService}</TableCell>
                <TableCell >{row.registeredDate}</TableCell>
                <TableCell >{row.status}</TableCell>
                <TableCell >
                <Button variant="outlined" color="Primary">View</Button>
                <Button variant="contained" color="Primary" sx={{ marginLeft: 1 }}>Print Invoice</Button>
              </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default ParcelTable;

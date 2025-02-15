import  { useEffect, useState } from "react";
import { getRecords } from "../api/api";
import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

const RecordTable = () => {
  const [records, setRecords] = useState([]);

  const loadRecords = async () => {
    const result = await getRecords();
    setRecords(result);
  };

  useEffect(() => {
    loadRecords();
  }, []);

  return (
    <div>
      <Typography variant="h6">All Records</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Total Cost</TableCell>
            <TableCell>Days Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record._id}>
              <TableCell>{record._id}</TableCell>
              <TableCell>{new Date(record.startDate).toLocaleString()}</TableCell>
              <TableCell>{record.endDate ? new Date(record.endDate).toLocaleString() : "Ongoing"}</TableCell>
              <TableCell>₹{record.totalCost}</TableCell>
              <TableCell>{record.daysCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecordTable;

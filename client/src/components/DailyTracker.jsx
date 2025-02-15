import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { createRecord, updateRecord, getRecords } from "../api/api";
import "../App.css";
import {  Oval } from "react-loader-spinner";

const DailyTracker = () => {
  const [activeRecord, setActiveRecord] = useState(null);
  const [records, setRecords] = useState([]);
  const weekdays = [7, 6, 6, 6, 6, 7, 7]; // Sunday to Saturday prices
  const [isLoading, setIsLoading] = useState(false);

  const loadActiveRecord = async () => {
    const recordsData = await getRecords();
    setRecords(recordsData);
    const active = recordsData.find((rec) => !rec.endDate);
    if (active) setActiveRecord(active);
  };

  const calculateCost = () => {
    const day = new Date().getDay();
    return weekdays[day];
  };

  const updateDailyCost = async () => {
    const todayCost = calculateCost();
    if (activeRecord) {
      const updatedRecord = {
        ...activeRecord,
        totalCost: activeRecord.totalCost + todayCost,
        daysCount: activeRecord.daysCount + 1,
      };
      await updateRecord(activeRecord._id, updatedRecord);
      setActiveRecord(updatedRecord);
    }
  };

  const handleBillPaid = async () => {
    if (activeRecord) {
      setIsLoading(true);
      await updateRecord(activeRecord._id, {
        ...activeRecord,
        endDate: new Date(),
      });
      setActiveRecord(null);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const newRecord = { totalCost: 0, daysCount: 0, deductedDays: [] };
      const created = await createRecord(newRecord);
      setActiveRecord(created);
      setIsLoading(false);
    }
  };

  const handleNoPaperToday = async () => {
    const dayIndex = new Date().getDay();
    if (activeRecord) {
      if (activeRecord.deductedDays.includes(dayIndex)) {
        alert("Today's cost has already been deducted.");
        return;
      }

      const todayCost = calculateCost();
      const updatedRecord = {
        ...activeRecord,
        totalCost: activeRecord.totalCost - todayCost,
        deductedDays: [...activeRecord.deductedDays, dayIndex],
      };

      await updateRecord(activeRecord._id, updatedRecord);
      setActiveRecord(updatedRecord);
    } else {
      alert("No active record found.");
    }
  };

  useEffect(() => {
    loadActiveRecord();
  }, [activeRecord]);

  return (
    <div
      className="tracker-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        className="stats"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography variant="h6" style={{ fontSize: "1rem" }}>
          Total Days: {activeRecord?.daysCount || "00"}
        </Typography>
        <Typography> | </Typography>
        <Typography variant="h6" style={{ fontSize: "1rem" }}>
          Total Cost: ₹{activeRecord?.totalCost || 0}
        </Typography>
      </div>

      <div className="circle" style={{ border: "1px solid #fff" }}>
        <Typography variant="h2">₹{activeRecord?.totalCost || 0}</Typography>
        <Typography variant="subtitle1">
          Today's Cost: ₹{calculateCost()}
        </Typography>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          width: "85%",
        }}
      >
        {isLoading ? (
          <Oval
            visible={true}
            height="50"
            width="20"
            color="#fff"
            ariaLabel="oval-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        ) : (
          <Button
            variant="contained"
            className="new-record-btn"
            onClick={handleBillPaid}
            style={{ backgroundColor: "green", border: "1px solid #fff" }}
          >
            {activeRecord ? "Bill Paid" : "Start New"}
          </Button>
        )}

        {activeRecord && (
          <Button
            variant="outlined"
            className="no-paper-btn"
            onClick={handleNoPaperToday}
            style={{ color: "#fff", borderColor: "#fff" }}
          >
            No Paper
          </Button>
        )}
      </div>

      <div
        className="records"
        style={{ height: "270px", overflowY: "auto", width: "100%" }}
      >
        <Typography
          variant="h5"
          style={{ fontSize: "1rem", marginBottom: "10px" }}
        >
          Records
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Days</TableCell>
            </TableRow>
          </TableHead>

          {isLoading  ? (
            <div
              style={{
                width: "100%",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                position: "absolute",
                height: "20%",
              }}
            >
              <Oval
                visible={true}
                height="40"
                width="40"
                color="#fff"
                ariaLabel="oval-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          ) : (
            <TableBody>
              {[...records].reverse().map((record, index) => (
                <TableRow key={index}>
                  <TableCell style={{ color: "#fff" }}>
                    {record.startDate
                      ? new Date(record.startDate).toLocaleDateString("en-GB")
                      : "-"}
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    {record.endDate
                      ? new Date(record.endDate).toLocaleDateString("en-GB")
                      : "-"}
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    ₹{record.totalCost}
                  </TableCell>
                  <TableCell style={{ color: "#fff" }}>
                    {record.daysCount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </div>
  );
};

export default DailyTracker;

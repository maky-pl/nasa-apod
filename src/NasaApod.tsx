import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import styles from "./NasaApod.module.css";

interface Apod {
  date: string;
  explanation: string;
  title: string;
  url: string;
}

const NasaApod: React.FC = () => {
  const [apod, setApod] = useState<Apod | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFutureDate, setIsFutureDate] = useState<boolean>(false);

  useEffect(() => {
    fetchApodForDate(currentDate);
  }, [currentDate]);

  const fetchApodForDate = (date: Date) => {
    setIsFutureDate(false);
    const formattedDate = date.toISOString().split("T")[0];
    if (date > new Date()) {
      setIsFutureDate(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=XXX&date=${formattedDate}`
      )
      .then((response) => {
        setApod(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching APOD:", error);
        setIsLoading(false);
      });
  };

  const handlePrevDate = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
  };

  const handleNextDate = () => {
    setCurrentDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
  };

  const handleRandomDate = () => {
    const start = new Date("1995-06-16");
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const randomDate = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    setCurrentDate(randomDate);
  };

  const handleCurrentDate = () => {
    setCurrentDate(new Date());
  };

  if (isLoading) {
    return <CircularProgress style={{ display: "block", margin: "auto" }} />;
  }

  if (isFutureDate) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        You have reached the most current available date.
        <Button
          className={styles.ctaButton}
          onClick={handleCurrentDate}
          style={{ display: "block", margin: "20px auto" }}
        >
          Go to Current Date
        </Button>
      </div>
    );
  }

  if (!apod) {
    return <div>No data available</div>;
  }

  return (
    <Box className={styles.container}>
      <Card className={styles.card}>
        <CardMedia
          component="img"
          className={styles.media}
          image={apod.url}
          alt={apod.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {apod.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ marginBottom: "10px" }}
          >
            Date: {apod.date}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {apod.explanation}
          </Typography>
        </CardContent>
      </Card>
      <Box className={styles.buttonGroup}>
        <Button className={styles.button} onClick={handlePrevDate}>
          Previous
        </Button>
        <Button className={styles.button} onClick={handleRandomDate}>
          Random
        </Button>
        <Button
          className={styles.button}
          onClick={handleNextDate}
          disabled={isFutureDate}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default NasaApod;

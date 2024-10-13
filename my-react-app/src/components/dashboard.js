import { motion, useAnimation } from "framer-motion";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import '../Styles/dashboard.css';
import { fraudControls } from '../Data/dummy'; // Import the data
import dashboard from "../Images/dashboard.png"; // Correct image import

const Dashboard = () => {
  const control = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      control.start("visible");
    } else {
      control.start("hidden");
    }
  }, [control, inView]);

  const list = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };
  const item1 = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: 0.5,
      },
    },
    hidden: {
      opacity: 0,
      x: -100,
    },
  };
  const item2 = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: 0.5,
      },
    },
    hidden: {
      opacity: 0,
      x: 100,
    },
  };

  return (
    <div className="app__dashboard">
      <motion.div
        ref={ref}
        animate={control}
        variants={list}
        className="dashboard__container"
      >
        <motion.div variants={item1} className="left__dashboard">
          <div className="left__text">
            <h1>Fraud Detection Dashboard</h1>
            <p>
              Here is a quick overview of fraud detection metrics and insights.
            </p>
          </div>
          <div className="left__dashboard__container">
            {fraudControls.map((control, index) => (
              <div className="control__container" key={index}>
                <div className="dashboard__icon">
                  <control.icon size={30} /> {/* Adjust size as needed */}
                </div>
                <p className="black-text">{control.name}</p> {/* Apply the black-text class here */}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div variants={item2} className="right__dashboard">
          <img src={dashboard} alt="Dashboard" draggable={false} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

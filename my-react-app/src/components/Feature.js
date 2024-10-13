import React, { useEffect } from "react";
import fraudDetectionImage from "../Images/image.png";
import '../Styles/Feature.css';
import { features } from "../Data/dummy"; // Ensure features are updated for fraud detection
import { TiTick } from "react-icons/ti";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Feature = () => {
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
    <div className="app__feature">
      <motion.div
        ref={ref}
        animate={control}
        variants={list}
        className="feature__container"
      >
        <motion.div variants={item1} className="left__feature">
          <img src={fraudDetectionImage} alt="Fraud Detection" draggable={false} />
        </motion.div>
        <motion.div variants={item2} className="right__feature">
          <div className="right__text">
            <h1>
              Advanced Credit Card Fraud Detection
            </h1>
            <p>
              Protect your transactions with cutting-edge fraud detection technology. Our system ensures the security of your credit card information and alerts you to any suspicious activities.
            </p>
          </div>
          <div className="feature__content">
            {features.map((feature, index) => (
              <div className="feature" key={index}>
                <TiTick />
                <div className="feature__text">
                  <p>{feature.title}</p>
                  <span>{feature.description}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Feature;

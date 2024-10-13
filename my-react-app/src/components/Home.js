import React, { useEffect } from "react";
import { TiTick } from "react-icons/ti";
import { motion, useAnimation } from "framer-motion";
//import '../Styles/home.css';
import '../App.css';
import { useInView } from "react-intersection-observer";
import Feature from "./Feature";  // Import Feature component

const Home = () => {
  const controls = useAnimation();
  const [homeRef, inView] = useInView();
  const [featureRef, featureInView] = useInView({ triggerOnce: true });

  const list = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const item = {
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
    hidden: {
      opacity: 0,
      x: "-50%",
    },
  };

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  useEffect(() => {
    if (featureInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, featureInView]);

  return (
    <div className="app__home" id="home">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={list}
        ref={homeRef}
        className="home__text"
      >
        <motion.h1 variants={item}>FraudShield: </motion.h1>
        <motion.h1 variants={item}>Your First Line of Defense Against Credit Card Fraud</motion.h1>
      </motion.div>
      <div className="ticks__container">
        <p>
          <span>
            <TiTick />
          </span>
          Real-time Fraud Alerts
        </p>
        <p>
          <span>
            <TiTick />
          </span>
          High Detection Accuracy
        </p>
        <p>
          <span>
            <TiTick />
          </span>
          24/7 Monitoring
        </p>
      </div>

      {/* Feature section */}
      <section id="features" ref={featureRef} className="feature-section">
        <Feature />
      </section>
    </div>
  );
};

export default Home;

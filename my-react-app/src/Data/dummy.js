import { AiOutlineClockCircle, AiFillCloud } from "react-icons/ai";
import { SiGooglepodcasts } from "react-icons/si";
import { FaShieldAlt, FaRobot, FaLock } from 'react-icons/fa'; // Import appropriate icons
import { GiArtificialIntelligence } from 'react-icons/gi'; // AI-related icon
import { AiOutlineSafety } from 'react-icons/ai'; // Security-related icon


export const routes = [
  {
    name: "Home",
    path: "#",
  },
  {
    name: "How it works",
    path: "#how",
  },
  {
    name: "About Us",
    path: "#about",
  },
  {
    name: "Contact Us",
    path: "#contact",
  },
];

export const fraudControls = [
  {
    name: "Fraud Monitoring",
    icon: FaShieldAlt, // Icon for security/shield to represent monitoring
  },
  {
    name: "AI-Powered Detection",
    icon: GiArtificialIntelligence, // AI icon to represent AI detection systems
  },
  {
    name: "Real-Time Alerts",
    icon: FaRobot, // Automated alert icon
  },
];

export const features = [
  {
    title: "Real-time Transaction Monitoring",
    description: "Monitor all transactions as they happen to detect and prevent fraudulent activities instantly."
  },
  {
    title: "Advanced Fraud Detection Algorithms",
    description: "Utilize sophisticated algorithms to identify patterns and anomalies indicative of fraud."
  },
  {
    title: "Instant Alerts for Suspicious Activity",
    description: "Receive immediate notifications for any suspicious or unusual transactions."
  },
  {
    title: "Seamless Integration with Payment Gateways",
    description: "Easily integrate with various payment gateways to enhance your fraud detection capabilities."
  },
];


export const controls = [
  {
    name: "Structured Reports",
    icon: SiGooglepodcasts,
  },
  {
    name: "Cloud System",
    icon: AiFillCloud,
  },
  {
    name: "24/7 Support",
    icon: AiOutlineClockCircle,
  },
];

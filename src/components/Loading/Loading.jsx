import LogoX from "../LogoX/LogoX";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}>
        <LogoX width="w-16" />
      </motion.div>
    </div>
  );
}

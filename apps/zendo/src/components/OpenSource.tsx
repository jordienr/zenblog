import { motion } from "framer-motion";
import { useState } from "react";

export function OpenSource() {
  const [hover, setHover] = useState(false);

  const openSourceArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  function getRandomOpacity(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  function getVariants(n: number) {
    return {
      hidden: {
        opacity: getRandomOpacity(0.3, 0.9),
        scale: 0.8,
      },
      visible: {
        opacity: n ? getRandomOpacity(0.7, 1) : getRandomOpacity(0.1, 0.3),
        scale: 1,
        transition: {
          duration: 0.3,
          type: "spring",
          bounce: 0.3,
          delay: Math.random() * (0.5 - 0.1) + 0.1,
        },
      },
    };
  }

  return (
    <>
      <h2 className="py-2 text-center font-mono text-xl font-medium">
        Proudly Open Source Software
      </h2>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="rounded-md bg-gradient-to-b from-slate-800 to-slate-900 p-2"
      >
        {openSourceArr.map((row, i) => (
          <div key={i} className="flex flex-row justify-center">
            {row.map((col, j) => (
              <motion.div
                variants={getVariants(col)}
                animate={hover ? "visible" : "hidden"}
                key={j}
                className={`m-0.5 h-6 w-6 rounded-md border border-green-300 bg-green-500`}
              ></motion.div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

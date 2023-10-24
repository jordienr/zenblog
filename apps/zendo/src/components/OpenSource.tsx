import { motion } from "framer-motion";
import { useState } from "react";

export function OpenSource() {
  const [hover, setHover] = useState(false);

  const openSourceArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const heartArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [selectedArr, setSelectedArr] = useState(openSourceArr);

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
        className="rounded-md bg-gradient-to-b from-slate-800 to-slate-900 p-4"
      >
        {selectedArr.map((row, i) => (
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
        <div className="flex justify-center">
          <a
            onMouseEnter={() => setSelectedArr(heartArr)}
            onMouseLeave={() => setSelectedArr(openSourceArr)}
            className="mx-auto mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 p-1 px-3 text-center font-mono font-medium text-white hover:bg-gray-700/70"
            href="https://github.com/jordienr/zendo"
            target="_blank"
          >
            <span className="text-xl">⭐</span> Star us on GitHub
          </a>
        </div>
      </div>
    </>
  );
}

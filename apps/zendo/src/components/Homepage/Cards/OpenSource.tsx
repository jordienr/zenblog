import { motion } from "framer-motion";
import { useState } from "react";
import BaseCard from "./BaseCard";

export function OpenSource() {
  const [hover, setHover] = useState(false);

  const openSourceArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const heartArr = [
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        transition: {
          duration: 0.3,
          type: "spring",
          bounce: 0.3,
          delay: Math.random() * (0.5 - 0.1) + 0.1,
        },
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
    <BaseCard
      title="Open source"
      caption="Easily self hostable. Built with NextJS and Supabase."
    >
      <div className="mx-auto">
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="overflow-hidden rounded-md shadow-sm"
        >
          {selectedArr.map((row, i) => (
            <div key={i} className="flex flex-row justify-center">
              {row.map((col, j) => (
                <motion.div
                  variants={getVariants(col)}
                  animate={hover ? "visible" : "hidden"}
                  key={j}
                  className={`m-0.5 aspect-square h-3 w-3 rounded-sm border border-green-600 bg-green-500 md:h-6 md:w-6 md:rounded-md`}
                ></motion.div>
              ))}
            </div>
          ))}
          <div className="flex justify-center py-3">
            <a
              onMouseEnter={() => setSelectedArr(heartArr)}
              onMouseLeave={() => setSelectedArr(openSourceArr)}
              className="mx-auto inline-flex items-center justify-center gap-2 rounded-lg border bg-white p-1 px-3 text-center font-medium text-black shadow-sm"
              href="https://github.com/jordienr/zendo"
              target="_blank"
            >
              <span className="text-xl">⭐</span> Star us on GitHub
            </a>
          </div>
        </div>
      </div>
    </BaseCard>
  );
}

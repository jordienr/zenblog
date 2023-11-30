import React from "react";
import BaseCard from "./BaseCard";

type Props = {};

const TypeSafety = (props: Props) => {
  return (
    <BaseCard
      title="Type safe content"
      caption="Fully typed API client that you can use in your app to fetch your
    content. No GraphQL."
    >
      <div className="group flex h-full items-center justify-center">
        <svg
          className=""
          width="180"
          height="200"
          viewBox="0 0 94 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.1"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M45.1664 0.318357C46.3486 -0.106119 47.6514 -0.106119 48.8336 0.318357L90.6114 15.3185C92.6497 16.0503 94 17.9159 94 20.0001V55.0004C94 72.2327 82.0842 86.0021 71.3277 95.0135C65.8398 99.6112 60.3765 103.205 56.2956 105.647C54.2496 106.871 52.5372 107.814 51.3243 108.457C50.7176 108.779 50.2348 109.026 49.8967 109.196C49.7276 109.281 49.5945 109.347 49.5002 109.393L49.3879 109.448L49.3541 109.464L49.3428 109.469L47 110L44.6613 109.471L44.6459 109.464L44.6121 109.448L44.4998 109.393C44.4055 109.347 44.2724 109.281 44.1033 109.196C43.7652 109.026 43.2824 108.779 42.6757 108.457C41.4628 107.814 39.7504 106.871 37.7045 105.647C33.6235 103.205 28.1602 99.6112 22.6723 95.0135C11.9158 86.0021 0 72.2327 0 55.0004V20.0001C0 17.9159 1.35032 16.0503 3.38858 15.3185L45.1664 0.318357ZM47 110L44.6613 109.471C46.1315 110.175 47.8652 110.177 49.3354 109.473L47 110Z"
            fill="#CBD5E1"
            stroke="#131313"
            strokeWidth={0.5}
          />
          <g filter="url(#filter0_dd_184_136)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M46.3101 19.2084C47.0773 18.9305 47.9227 18.9305 48.6899 19.2084L75.801 29.0266C77.1237 29.5056 78 30.7268 78 32.091V55.0003C78 66.2796 70.2674 75.2923 63.2872 81.1907C59.7258 84.2001 56.1805 86.5523 53.5322 88.1507C52.2046 88.9521 51.0933 89.5694 50.3062 89.9902C49.9125 90.2007 49.5992 90.3624 49.3797 90.4736C49.27 90.5293 49.1837 90.5723 49.1225 90.6026L49.0496 90.6384L49.0276 90.6491L49.0204 90.6527L47.5 91L45.9824 90.654L45.9724 90.6491L45.9504 90.6384L45.8775 90.6026C45.8163 90.5723 45.73 90.5293 45.6203 90.4736C45.4008 90.3624 45.0875 90.2007 44.6938 89.9902C43.9067 89.5694 42.7955 88.9521 41.4678 88.1507C38.8195 86.5523 35.2742 84.2001 31.7128 81.1907C24.7326 75.2923 17 66.2796 17 55.0003V32.091C17 30.7268 17.8763 29.5056 19.199 29.0266L46.3101 19.2084ZM47.5 91L45.9824 90.654C46.9364 91.1147 48.0615 91.1157 49.0156 90.655L47.5 91Z"
              fill="white"
            />
          </g>
          <g filter="url(#filter1_dd_184_136)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M46.4661 23.1823C47.1327 22.9392 47.8673 22.9392 48.5339 23.1823L72.0894 31.7733C73.2386 32.1924 74 33.2609 74 34.4546V54.5002C74 64.3696 67.2815 72.2557 61.2167 77.4169C58.1224 80.0501 55.0421 82.1083 52.7411 83.5069C51.5876 84.2081 50.6221 84.7483 49.9382 85.1164C49.5961 85.3006 49.3239 85.4421 49.1332 85.5394C49.0379 85.5881 48.9629 85.6258 48.9097 85.6523L48.8464 85.6836L48.8273 85.693L48.821 85.6961C48.821 85.6961 48.8168 85.6981 47.5 83.1368C46.1832 85.6981 46.1814 85.6972 46.1814 85.6972L46.1727 85.693L46.1536 85.6836L46.0903 85.6523C46.0371 85.6258 45.9621 85.5881 45.8668 85.5394C45.6761 85.4421 45.4039 85.3006 45.0618 85.1164C44.3779 84.7483 43.4124 84.2081 42.2589 83.5069C39.9579 82.1083 36.8776 80.0501 33.7833 77.4169C27.7185 72.2557 21 64.3696 21 54.5002V34.4546C21 33.2609 21.7614 32.1924 22.9106 31.7733L46.4661 23.1823ZM47.5 83.1368L46.1814 85.6972C47.0103 86.1003 47.9879 86.1012 48.8168 85.6981L47.5 83.1368Z"
              fill="url(#paint0_linear_184_136)"
            />
          </g>
          <g filter="url(#filter2_d_184_136)">
            <path
              d="M33.0134 48.5881V45.5455H47.3486V48.5881H42.0048V63H38.3571V48.5881H33.0134ZM58.0981 50.5653C58.03 49.8778 57.7373 49.3437 57.2203 48.9631C56.7033 48.5824 56.0015 48.392 55.1152 48.392C54.5129 48.392 54.0044 48.4773 53.5896 48.6477C53.1748 48.8125 52.8567 49.0426 52.6351 49.3381C52.4192 49.6335 52.3112 49.9688 52.3112 50.3438C52.2998 50.6562 52.3652 50.929 52.5072 51.1619C52.655 51.3949 52.8567 51.5966 53.1123 51.767C53.368 51.9318 53.6635 52.0767 53.9987 52.2017C54.3339 52.321 54.6919 52.4233 55.0726 52.5085L56.6408 52.8835C57.4021 53.054 58.101 53.2812 58.7373 53.5653C59.3737 53.8494 59.9248 54.1989 60.3908 54.6136C60.8567 55.0284 61.2175 55.517 61.4731 56.0795C61.7345 56.642 61.868 57.2869 61.8737 58.0142C61.868 59.0824 61.5953 60.0085 61.0555 60.7926C60.5214 61.571 59.7487 62.1761 58.7373 62.608C57.7317 63.0341 56.5186 63.2472 55.0981 63.2472C53.689 63.2472 52.4618 63.0312 51.4163 62.5994C50.3765 62.1676 49.564 61.5284 48.9788 60.6818C48.3993 59.8295 48.0953 58.7756 48.0669 57.5199H51.6379C51.6777 58.1051 51.8453 58.5937 52.1408 58.9858C52.4419 59.3722 52.8425 59.6648 53.3425 59.8636C53.8481 60.0568 54.4192 60.1534 55.0555 60.1534C55.6805 60.1534 56.2231 60.0625 56.6834 59.8807C57.1493 59.6989 57.5101 59.446 57.7658 59.1222C58.0214 58.7983 58.1493 58.4261 58.1493 58.0057C58.1493 57.6136 58.0328 57.2841 57.7998 57.017C57.5726 56.75 57.2373 56.5227 56.7942 56.3352C56.3567 56.1477 55.8197 55.9773 55.1834 55.8239L53.2828 55.3466C51.8112 54.9886 50.6493 54.429 49.797 53.6676C48.9447 52.9062 48.5214 51.8807 48.5271 50.5909C48.5214 49.5341 48.8027 48.6108 49.3709 47.821C49.9447 47.0312 50.7317 46.4148 51.7317 45.9716C52.7317 45.5284 53.868 45.3068 55.1408 45.3068C56.4362 45.3068 57.5669 45.5284 58.5328 45.9716C59.5044 46.4148 60.2601 47.0312 60.7998 47.821C61.3396 48.6108 61.618 49.5256 61.6351 50.5653H58.0981Z"
              fill="white"
            />
          </g>
          <defs>
            <filter
              id="filter0_dd_184_136"
              x="11"
              y="17"
              width="73"
              height="84"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0714583 0 0 0 0 0.100654 0 0 0 0 0.204167 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_184_136"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0501389 0 0 0 0 0.0804333 0 0 0 0 0.158333 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_184_136"
                result="effect2_dropShadow_184_136"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_184_136"
                result="shape"
              />
            </filter>
            <filter
              id="filter1_dd_184_136"
              x="16"
              y="22"
              width="63"
              height="73"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius="2"
                operator="erode"
                in="SourceAlpha"
                result="effect1_dropShadow_184_136"
              />
              <feOffset dy="2" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_184_136"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feMorphology
                radius="1"
                operator="erode"
                in="SourceAlpha"
                result="effect2_dropShadow_184_136"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow_184_136"
                result="effect2_dropShadow_184_136"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow_184_136"
                result="shape"
              />
            </filter>
            <filter
              id="filter2_d_184_136"
              x="27.0134"
              y="40.3068"
              width="40.8604"
              height="29.9403"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="1" />
              <feGaussianBlur stdDeviation="3" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_184_136"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_184_136"
                result="shape"
              />
            </filter>
            <linearGradient
              id="paint0_linear_184_136"
              x1="47.5"
              y1="23"
              x2="47.5"
              y2="86"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#5394FF" />
              <stop offset="1" stop-color="#116BFF" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </BaseCard>
  );
};

export default TypeSafety;

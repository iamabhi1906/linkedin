'use client';

import React from 'react';
import {
  ThumbUpOutlined as DefaultLikeIcon,
  Celebration as CelebrateIcon,
  VolunteerActivism as SupportIcon,
  Lightbulb as InsightfulIcon,
} from '@mui/icons-material';
import styles from './reaction-icon.module.css';

interface ReactionIconProps {
  reaction?: string;
  liked?: boolean;
  width?: number;
  height?: number;
}

export const ReactionIcon: React.FC<ReactionIconProps> = ({ reaction, liked, width = 24, height = 24 }) => {
  if (!liked) {
    return <DefaultLikeIcon className={styles.defaultIcon} />;
  }
  const key = reaction?.toLowerCase() || 'like';

  switch (key) {
    case 'like':
    case 'likes':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              d="M20.2699 16.265L20.9754 12.1852C21.1516 11.1662 20.368 10.2342 19.335 10.2342H14.1539C13.6404 10.2342 13.2494 9.77328 13.3325 9.26598L13.9952 5.22142C14.1028 4.56435 14.0721 3.892 13.9049 3.24752C13.7664 2.71364 13.3545 2.28495 12.8128 2.11093L12.6678 2.06435C12.3404 1.95918 11.9831 1.98365 11.6744 2.13239C11.3347 2.29611 11.0861 2.59473 10.994 2.94989L10.5183 4.78374C10.3669 5.36723 10.1465 5.93045 9.86218 6.46262C9.44683 7.24017 8.80465 7.86246 8.13711 8.43769L6.69838 9.67749C6.29272 10.0271 6.07968 10.5506 6.12584 11.0844L6.93801 20.4771C7.0125 21.3386 7.7328 22 8.59658 22H13.2452C16.7265 22 19.6975 19.5744 20.2699 16.265Z"
              fill="#0a66c2"
            />{' '}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.96767 9.48508C3.36893 9.46777 3.71261 9.76963 3.74721 10.1698L4.71881 21.4063C4.78122 22.1281 4.21268 22.7502 3.48671 22.7502C2.80289 22.7502 2.25 22.1954 2.25 21.5129V10.2344C2.25 9.83275 2.5664 9.5024 2.96767 9.48508Z"
              fill="#0a66c2"
            />{' '}
          </g>
        </svg>
      );

    case 'love':
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" width={width} height={height}>
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048" />
          <g id="SVGRepo_iconCarrier">
            {' '}
            <rect width={24} height={24} fill="white" />{' '}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.36129 3.46995C6.03579 3.16081 6.76287 3 7.50002 3C8.23718 3 8.96425 3.16081 9.63875 3.46995C10.3129 3.77893 10.9185 4.22861 11.4239 4.78788C11.7322 5.12902 12.2678 5.12902 12.5761 4.78788C13.5979 3.65726 15.0068 3.00001 16.5 3.00001C17.9932 3.00001 19.4021 3.65726 20.4239 4.78788C21.4427 5.91515 22 7.42425 22 8.9792C22 10.5342 21.4427 12.0433 20.4239 13.1705L14.2257 20.0287C13.0346 21.3467 10.9654 21.3467 9.77429 20.0287L3.57613 13.1705C3.07086 12.6115 2.67474 11.9531 2.40602 11.2353C2.13731 10.5175 2 9.75113 2 8.9792C2 8.20728 2.13731 7.44094 2.40602 6.72315C2.67474 6.00531 3.07086 5.34694 3.57613 4.78788C4.08157 4.22861 4.68716 3.77893 5.36129 3.46995Z"
              fill="#f82a2a"
            />{' '}
          </g>
        </svg>
      );
    case 'celebrate':
      return <CelebrateIcon className={styles.celebrateIcon} />;
    case 'support':
      return <SupportIcon className={styles.supportIcon} />;
    case 'insightful':
      return <InsightfulIcon className={styles.insightfulIcon} />;
    case 'wow':
      return <span>😮</span>;
    case 'funny':
    case 'haha':
      return (
        <svg viewBox="0 0 1500 1500" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="#000000">
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            {' '}
            <style
              dangerouslySetInnerHTML={{
                __html:
                  '.st0{fill:#fff}.st1{fill:#ffda6b}.st2{fill:none;stroke:#262c38;stroke-width:10;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}.st3{fill:#262c38}.st4{fill:#f05266}.st5{fill:none;stroke:#262c38;stroke-width:60;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}',
              }}
            />{' '}
            <path
              className="st0"
              d="M542.7 1092.6H377.6c-13 0-23.6-10.6-23.6-23.6V689.9c0-13 10.6-23.6 23.6-23.6h165.1c13 0 23.6 10.6 23.6 23.6V1069c0 13-10.6 23.6-23.6 23.6zM624 1003.5V731.9c0-66.3 18.9-132.9 54.1-189.2 21.5-34.4 69.7-89.5 96.7-118 6-6.4 27.8-25.2 27.8-35.5 0-13.2 1.5-34.5 2-74.2.3-25.2 20.8-45.9 46-45.7h1.1c44.1 1 58.3 41.7 58.3 41.7s37.7 74.4 2.5 165.4c-29.7 76.9-35.7 83.1-35.7 83.1s-9.6 13.9 20.8 13.3c0 0 185.6-.8 192-.8 13.7 0 57.4 12.5 54.9 68.2-1.8 41.2-27.4 55.6-40.5 60.3-2.6.9-2.9 4.5-.5 5.9 13.4 7.8 40.8 27.5 40.2 57.7-.8 36.6-15.5 50.1-46.1 58.5-2.8.8-3.3 4.5-.8 5.9 11.6 6.6 31.5 22.7 30.3 55.3-1.2 33.2-25.2 44.9-38.3 48.9-2.6.8-3.1 4.2-.8 5.8 8.3 5.7 20.6 18.6 20 45.1-.3 14-5 24.2-10.9 31.5-9.3 11.5-23.9 17.5-38.7 17.6l-411.8.8c-.2 0-22.6 0-22.6-30z"
            />{' '}
            <path
              className="st0"
              d="M750 541.9C716.5 338.7 319.5 323.2 319.5 628c0 270.1 430.5 519.1 430.5 519.1s430.5-252.3 430.5-519.1c0-304.8-397-289.3-430.5-86.1z"
            />{' '}
            <ellipse className="st1" cx="750.2" cy="751.1" rx={750} ry="748.8" />{' '}
            <g>
              {' '}
              <path
                id="mond"
                className="st3"
                d="M755.3 784.1H255.4s13.2 431.7 489 455.8c6.7.3 11.2.1 11.2.1 475.9-24.1 489-455.9 489-455.9H755.3z"
              />{' '}
              <path
                id="tong"
                className="st4"
                d="M312.1 991.7s174.8-83.4 435-82.6c129 .4 282.7 12 439.2 83.4 0 0-106.9 260.7-436.7 260.7-329 0-437.5-261.5-437.5-261.5z"
              />{' '}
              <path id="linker_1_" className="st5" d="M1200.2 411L993 511.4l204.9 94.2" />{' '}
              <path id="linker_4_" className="st5" d="M297.8 411L505 511.4l-204.9 94.2" />{' '}
            </g>{' '}
          </g>
        </svg>
      );

    case 'angry':
      return (
        <svg
          viewBox="0 0 128 128"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          width={width}
          height={height}
          className="iconify iconify--noto"
          preserveAspectRatio="xMidYMid meet"
          fill="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            {' '}
            <radialGradient
              id="IconifyId17ecdb2904d178eab5531"
              cx="63.6"
              cy="2584.9"
              r="56.96"
              gradientTransform="translate(0 -2522)"
              gradientUnits="userSpaceOnUse"
            >
              {' '}
              <stop offset=".5" stopColor="#fde030">
                {' '}
              </stop>{' '}
              <stop offset=".92" stopColor="#f7c02b">
                {' '}
              </stop>{' '}
              <stop offset={1} stopColor="#f4a223">
                {' '}
              </stop>{' '}
            </radialGradient>{' '}
            <path
              d="M63.6 118.8c-27.9 0-58-17.5-58-55.9S35.7 7 63.6 7c15.5 0 29.8 5.1 40.4 14.4c11.5 10.2 17.6 24.6 17.6 41.5s-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5z"
              fill="url(#IconifyId17ecdb2904d178eab5531)"
            >
              {' '}
            </path>{' '}
            <path
              d="M111.49 29.67c5.33 8.6 8.11 18.84 8.11 30.23c0 16.9-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5c-18.06 0-37-7.35-48.18-22.94c10.76 17.66 31 25.94 50.18 25.94c15.4 0 29.8-5.2 40.4-14.5c11.5-10.2 17.6-24.5 17.6-41.4c0-12.74-3.47-24.06-10.11-33.23z"
              fill="#eb8f00"
            >
              {' '}
            </path>{' '}
            <g>
              {' '}
              <g fill="#422b0d">
                {' '}
                <path d="M83.94 103.14a2.21 2.21 0 0 1-.89-.62c-9.73-10.11-25.82-10.42-35.93-.69c-.23.23-.47.46-.69.69c-.24.28-.55.49-.89.62c-.75.28-1.6.12-2.2-.41c-.59-.52-.79-1.35-.49-2.08C45.83 93 54.69 87 64.74 87s18.91 6 21.89 13.64c.3.73.1 1.56-.49 2.08c-.6.53-1.45.69-2.2.42z">
                  {' '}
                </path>{' '}
                <path d="M58.14 68.82C55.9 66 46.67 60.58 43.34 59c-1.24-.57-2.53-1.03-3.85-1.37c-.24-.07-.5-.1-.75-.1A2.87 2.87 0 0 0 36 59.82a2.92 2.92 0 0 0 1.67 3.32c1.57.77 4.31 2.23 7.15 3.84A7.83 7.83 0 0 0 41 73.71v1.46c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5v-1.46v-.17c1.07-.07 2.03-.71 2.5-1.67c.49-1 .35-2.19-.36-3.05z">
                  {' '}
                </path>{' '}
                <path d="M93.52 59.82a2.867 2.867 0 0 0-2.79-2.27c-.25 0-.51.03-.75.1c-1.32.33-2.61.79-3.85 1.35c-3.33 1.56-12.56 7-14.8 9.8a2.84 2.84 0 0 0-.33 3.07c.48.97 1.43 1.6 2.51 1.67v1.63c0 4.14 3.36 7.5 7.5 7.5s7.5-3.36 7.5-7.5v-1.46c0-2.75-1.45-5.3-3.81-6.71c2.84-1.61 5.58-3.07 7.15-3.84c1.29-.56 2-1.97 1.67-3.34z">
                  {' '}
                </path>{' '}
              </g>{' '}
              <path
                d="M48.12 68.45a2.874 2.874 0 0 0-3.82 1.34c-.53 1.11-.29 2.44.6 3.3c1.42.68 3.13.08 3.82-1.34c.53-1.11.29-2.44-.6-3.3z"
                fill="#896024"
              >
                {' '}
              </path>{' '}
              <path
                d="M80.63 68.45a2.874 2.874 0 0 0-3.82 1.34c-.53 1.11-.29 2.44.6 3.3c1.42.68 3.13.08 3.82-1.34c.53-1.11.29-2.44-.6-3.3z"
                fill="#896024"
              >
                {' '}
              </path>{' '}
            </g>{' '}
          </g>
        </svg>
      );

    case 'sad':
      return (
        <svg
          viewBox="0 0 128 128"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          width={width}
          height={height}
          className="iconify iconify--noto"
          preserveAspectRatio="xMidYMid meet"
          fill="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            {' '}
            <radialGradient
              id="IconifyId17ecdb2904d178eab19930"
              cx="63.6"
              cy="1992.9"
              r="56.96"
              gradientTransform="translate(0 -1930)"
              gradientUnits="userSpaceOnUse"
            >
              {' '}
              <stop offset=".5" stopColor="#fde030">
                {' '}
              </stop>{' '}
              <stop offset=".92" stopColor="#f7c02b">
                {' '}
              </stop>{' '}
              <stop offset={1} stopColor="#f4a223">
                {' '}
              </stop>{' '}
            </radialGradient>{' '}
            <path
              d="M63.6 118.8c-27.9 0-58-17.5-58-55.9S35.7 7 63.6 7c15.5 0 29.8 5.1 40.4 14.4c11.5 10.2 17.6 24.6 17.6 41.5s-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5z"
              fill="url(#IconifyId17ecdb2904d178eab19930)"
            >
              {' '}
            </path>{' '}
            <path
              d="M111.49 29.67c5.33 8.6 8.11 18.84 8.11 30.23c0 16.9-6.1 31.2-17.6 41.4c-10.6 9.3-25 14.5-40.4 14.5c-18.06 0-37-7.35-48.18-22.94c10.76 17.66 31 25.94 50.18 25.94c15.4 0 29.8-5.2 40.4-14.5c11.5-10.2 17.6-24.5 17.6-41.4c0-12.74-3.47-24.06-10.11-33.23z"
              fill="#eb8f00"
            >
              {' '}
            </path>{' '}
            <g>
              {' '}
              <path
                d="M64 87.15c10.82 0 17.83 7.92 19.65 11.57c.7 1.41.74 2.58.14 3.13c-.63.41-1.45.41-2.08 0c-.31-.15-.62-.32-.9-.52a28.849 28.849 0 0 0-33.61 0c-.28.2-.58.37-.9.52c-.63.42-1.45.42-2.08 0c-.6-.55-.56-1.72.14-3.13c1.81-3.64 8.82-11.57 19.64-11.57z"
                fill="#422b0d"
              >
                {' '}
              </path>{' '}
              <g fill="#422b0d">
                {' '}
                <path d="M27.39 39.77c-2.2.39-2.31 3.59.09 3.7c5.3.08 10.42-1.88 14.32-5.47a17.24 17.24 0 0 0 3.71-4.49c.58-.83.38-1.97-.44-2.56s-1.97-.38-2.56.44l-.1.1c-3.93 4.39-9.22 7.3-15.02 8.28z">
                  {' '}
                </path>{' '}
                <path d="M86.12 31.52l-.1-.1a1.841 1.841 0 0 0-2.56-.45a1.83 1.83 0 0 0-.44 2.56c.98 1.69 2.24 3.2 3.73 4.47c3.9 3.59 9.02 5.54 14.32 5.45c2.4-.11 2.29-3.31.08-3.7c-5.8-.97-11.09-3.87-15.03-8.23z">
                  {' '}
                </path>{' '}
              </g>{' '}
              <radialGradient
                id="IconifyId17ecdb2904d178eab19931"
                cx="20.59"
                cy="-404.695"
                r="33.4"
                gradientTransform="matrix(1 0 0 -1.54 0 -560.29)"
                gradientUnits="userSpaceOnUse"
              >
                {' '}
                <stop offset=".46" stopColor="#29b6f6">
                  {' '}
                </stop>{' '}
                <stop offset={1} stopColor="#1e88e5">
                  {' '}
                </stop>{' '}
              </radialGradient>{' '}
              <path
                d="M19.52 107c-8.46 0-15-8.21-15-15.24c0-4.94 2.21-10.67 5.34-18.61c.39-1.17.91-2.35 1.43-3.65c1.49-3.72 2.8-7.75 4.8-11.24a3.516 3.516 0 0 1 6.14 0c1.86 3.43 3.14 7.14 5.07 11.47c5.47 12.24 7 17.19 7 22.13c.19 6.97-6.45 15.14-14.78 15.14z"
                fill="url(#IconifyId17ecdb2904d178eab19931)"
              >
                {' '}
              </path>{' '}
              <path d="M28.67 97.65c-1.91 3-6.25 2.4-6.25-2.51c0-3.14.64-19.26 3.34-17c4.38 3.67 5.63 15.33 2.91 19.51z" fill="#81d4fa">
                {' '}
              </path>{' '}
              <path d="M44.67 54.94c-4.19 0-8 3.54-8 9.42s3.81 9.41 8 9.41c4.19 0 8-3.54 8-9.41s-3.81-9.42-8-9.42z" fill="#422b0d">
                {' '}
              </path>{' '}
              <path
                d="M44.28 58.87a2.874 2.874 0 0 0-3.82 1.34c-.53 1.11-.29 2.44.6 3.3c1.42.68 3.13.08 3.82-1.34c.53-1.11.29-2.44-.6-3.3z"
                fill="#896024"
              >
                {' '}
              </path>{' '}
              <path d="M83 54.94c-4.19 0-8 3.54-8 9.42s3.81 9.41 8 9.41c4.19 0 8-3.54 8-9.41s-3.79-9.42-8-9.42z" fill="#422b0d">
                {' '}
              </path>{' '}
              <g>
                {' '}
                <path
                  d="M82.63 58.87a2.874 2.874 0 0 0-3.82 1.34c-.53 1.11-.29 2.44.6 3.3c1.42.68 3.13.08 3.82-1.34c.53-1.11.29-2.44-.6-3.3z"
                  fill="#896024"
                >
                  {' '}
                </path>{' '}
              </g>{' '}
            </g>{' '}
          </g>
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
          <g id="SVGRepo_iconCarrier">
            {' '}
            <path
              d="M20.2699 16.265L20.9754 12.1852C21.1516 11.1662 20.368 10.2342 19.335 10.2342H14.1539C13.6404 10.2342 13.2494 9.77328 13.3325 9.26598L13.9952 5.22142C14.1028 4.56435 14.0721 3.892 13.9049 3.24752C13.7664 2.71364 13.3545 2.28495 12.8128 2.11093L12.6678 2.06435C12.3404 1.95918 11.9831 1.98365 11.6744 2.13239C11.3347 2.29611 11.0861 2.59473 10.994 2.94989L10.5183 4.78374C10.3669 5.36723 10.1465 5.93045 9.86218 6.46262C9.44683 7.24017 8.80465 7.86246 8.13711 8.43769L6.69838 9.67749C6.29272 10.0271 6.07968 10.5506 6.12584 11.0844L6.93801 20.4771C7.0125 21.3386 7.7328 22 8.59658 22H13.2452C16.7265 22 19.6975 19.5744 20.2699 16.265Z"
              fill="#0a66c2"
            />{' '}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2.96767 9.48508C3.36893 9.46777 3.71261 9.76963 3.74721 10.1698L4.71881 21.4063C4.78122 22.1281 4.21268 22.7502 3.48671 22.7502C2.80289 22.7502 2.25 22.1954 2.25 21.5129V10.2344C2.25 9.83275 2.5664 9.5024 2.96767 9.48508Z"
              fill="#0a66c2"
            />{' '}
          </g>
        </svg>
      );
  }
};

'use client';

import React from 'react';
import { Box } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface PostMediaItem {
  id?: string;
  url?: string;
  fileUrl?: string;
  mediaType?: string;
}

interface PostMediaCarouselProps {
  media?: PostMediaItem[];
}

export default function PostMediaCarousel({ media }: PostMediaCarouselProps) {
  if (!media || media.length === 0) {
    return null;
  }

  const resolveUrl = (item: PostMediaItem) => {
    const rawUrl = item.url || item.fileUrl || '';
    if (!rawUrl) return '';
    return rawUrl.startsWith('http') ? rawUrl : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050'}/${rawUrl.replace(/^\/+/, '')}`;
  };

  if (media.length === 1) {
    const item = media[0];
    const fullUrl = resolveUrl(item);
    const isVideo = item.mediaType?.startsWith('video') || fullUrl.endsWith('.mp4');

    return (
      <Box sx={{ my: 1, borderRadius: 1.5, overflow: 'hidden', backgroundColor: '#000000' }}>
        {isVideo ? (
          <video src={fullUrl} controls style={{ width: '100%', maxHeight: 500, display: 'block' }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={fullUrl} alt="Post Media" style={{ width: '100%', maxHeight: 500, objectFit: 'contain', display: 'block' }} />
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        my: 1,
        borderRadius: 1.5,
        overflow: 'hidden',
        backgroundColor: '#000000',
        '& .swiper-button-next, & .swiper-button-prev': {
          color: '#FFFFFF',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          width: 36,
          height: 36,
          borderRadius: '50%',
          '&::after': {
            fontSize: '16px',
            fontWeight: 'bold',
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
          },
        },
        '& .swiper-pagination-bullet': {
          backgroundColor: '#FFFFFF',
          opacity: 0.6,
        },
        '& .swiper-pagination-bullet-active': {
          backgroundColor: '#0A66C2',
          opacity: 1,
        },
      }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        slidesPerView={1}
        style={{ width: '100%', height: '100%' }}
      >
        {media.map((item, idx) => {
          const fullUrl = resolveUrl(item);
          const isVideo = item.mediaType?.startsWith('video') || fullUrl.endsWith('.mp4');

          return (
            <SwiperSlide key={item.id || idx}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  maxHeight: 500,
                  backgroundColor: '#000000',
                }}
              >
                {isVideo ? (
                  <video src={fullUrl} controls style={{ width: '100%', maxHeight: 500, display: 'block' }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={fullUrl}
                    alt={`Post Media ${idx + 1}`}
                    style={{ width: '100%', maxHeight: 500, objectFit: 'contain', display: 'block' }}
                  />
                )}
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
}

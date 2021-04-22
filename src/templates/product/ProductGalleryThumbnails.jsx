/** @jsx jsx */
import { jsx } from 'theme-ui';

import React, { useContext, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useThemeUI, Flex, Box } from 'theme-ui';
import { CarouselContext, Dot } from 'pure-react-carousel';

import ShopifyImage from '../../components/ShopifyImage';

const ThumbnailBox = styled(Box)(
  ({ theme, maxImageHeight, maxImageWidth, currentImageIndex, index }) => ({
    maxWidth: maxImageWidth,
    maxHeight: maxImageHeight,
    transition: '0.5s ease all',
    cursor: 'pointer',
    border: `1px solid ${
      currentImageIndex !== index ? 'transparent' : theme.colors.primary
    }`,
  })
);

const ThumbnailFlex = styled(Flex)(({ theme, transformPx }) => {
  return {
    transition: '0.5s ease all',
    transform: `translateX(${transformPx}px)`,
    [theme.mediaQueries[1]]: {
      transform: `translateY(${transformPx}px)`,
    },
  };
});

function ProductGalleryThumbnails({
  images,
  title,
  maxImageHeight = 100,
  maxImageWidth = 100,
  maxContainerHeight = 500,
}) {
  const carouselContext = useContext(CarouselContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(
    carouselContext.state.currentSlide
  );

  const { theme } = useThemeUI();

  useEffect(() => {
    function onChange() {
      setCurrentImageIndex(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  function calculateTransform() {
    if (currentImageIndex < 2) {
      return 0;
    } else if (currentImageIndex >= images.length - 1) {
      return (images.length - 2.5) * -(maxImageHeight + 16);
    } else {
      return (currentImageIndex - 1) * -(maxImageHeight + 8);
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        maxHeight: maxContainerHeight,
        overflow: ['scroll', 'hidden'],
        '::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
    >
      <ThumbnailFlex
        sx={{
          flexDirection: ['row', null, 'column'],
          width: [images.length * maxImageWidth, null, '100%'],
        }}
        transformPx={calculateTransform()}
        theme={theme}
      >
        {images.map((image, index) => (
          <Dot
            slide={index}
            sx={{
              width: 'auto',
              maxWidth: maxImageWidth,
              height: 100,
              borderRadius: 0,
              border: 0,
              margin: 0,
              padding: 0,
              backgroundColor: 'transparent',
              mr: [2, null, 0],
              my: 1,
              ':focus': {
                outline: 'none',
              },
            }}
            key={index}
          >
            <ThumbnailBox
              key={image.id}
              index={index}
              currentImageIndex={currentImageIndex}
              maxImageHeight={maxImageHeight}
              maxImageWidth={maxImageWidth}
              sx={{ width: [100, null, 'auto'] }}
              onClick={() => setCurrentImageIndex(index)}
              theme={theme}
            >
              {image && image.localFile && image.localFile.childImageSharp ? (
                <ShopifyImage
                  src={image.originalSrc}
                  alt={image.altText || title}
                  sizes="(max-width: 90px) 100vw, 90px"
                  base64={image.localFile.childImageSharp.main.src}
                  aspectRatio={1}
                />
              ) : (
                ''
              )}
            </ThumbnailBox>
          </Dot>
        ))}
      </ThumbnailFlex>
    </Box>
  );
}

export default ProductGalleryThumbnails;

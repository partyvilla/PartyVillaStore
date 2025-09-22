import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ImageSliderProps {
  images: string[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // Helper function to get valid image URL
  const getValidImageUrl = (url: string): string => {
    return url && typeof url === 'string' && url.trim() !== '' ? url : '/placeholder.svg';
  };

  return (
    <div>
      {images.length > 1 ? (
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={getValidImageUrl(image)} alt={`Product Image ${index + 1}`} />
            </div>
          ))}
        </Slider>
      ) : (
        <img src={images.length > 0 ? getValidImageUrl(images[0]) : '/placeholder.svg'} alt="Product Image" />
      )}
    </div>
  );
};

export default ImageSlider;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './ImageGallery.css';

const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.REACT_APP_SEARCH_ENGINE_ID;

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const startIndex = (page - 1) * 10 + 1;
    const response = await axios.get(`https://www.googleapis.com/customsearch/`, {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: 'random images',
        searchType: 'image',
        start: startIndex,
        num: 10
      },
    });
    setImages((prevImages) => [...prevImages, ...response.data.items]);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const loadMoreImages = () => {
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreImages();
        }
      },
      { threshold: 1.0 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loading]);

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.link}
          alt={image.title}
          className="gallery-image"
          loading="lazy"
        />
      ))}
      {loading && <p>Loading...</p>}
      <div ref={loader} />
    </div>
  );
};

export default ImageGallery;

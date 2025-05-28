import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { create, remove, update, getByPage } from '../../api/crudService';
import PhotoPopup from './PhotoPopup';
import PhotoGrid from './PhotoGrid';
import AddPhotoForm from './AddPhotoForm';
import PhotoPagination from './PhotoPagination';
import styles from '../../css/Photos/Photos.module.css';
import BackButton from '../../components/buttons/BackButton';

const globalPhotoCache = {};

export default function Photos() {
  const { albumId, userId } = useParams();

  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isAlbumEmpty, setIsAlbumEmpty] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const PHOTOS_PER_PAGE = 5;

  const loadPhotos = async (page) => {
    try {
      const data = await getByPage('photos', 'albumId', albumId, page, PHOTOS_PER_PAGE);
      if (!globalPhotoCache[albumId]) globalPhotoCache[albumId] = {};
      globalPhotoCache[albumId][page] = data;
      setPhotos(data);
      setHasMore(data.length === PHOTOS_PER_PAGE);
      setIsAlbumEmpty(data.length === 0 && page === 1);
    } catch (err) {
      console.error('Failed to load photos:', err);
      alert('Error loading photos');
    }
  };

  useEffect(() => {
    if (globalPhotoCache[albumId]?.[currentPage]) {
      console.log("from cache");
      const cached = globalPhotoCache[albumId][currentPage];
      setPhotos(cached);
      setHasMore(cached.length === PHOTOS_PER_PAGE);
      setIsAlbumEmpty(cached.length === 0 && currentPage === 1);
    } else {
      console.log("fetching");
      loadPhotos(currentPage);
    }
  }, [albumId, currentPage]);

  const handleNext = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const addPhoto = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
  
    try {
      const newPhoto = await create("photos", {
        albumId: parseInt(albumId),
        title: newTitle.trim(),
        url: newUrl.trim(),
        thumbnailUrl: newUrl.trim()
      });
  
      if (!globalPhotoCache[albumId]) globalPhotoCache[albumId] = {};
      const albumCache = globalPhotoCache[albumId];
  
      const cachedPages = Object.keys(albumCache).map(Number);
      const lastCachedPage = cachedPages.length > 0 ? Math.max(...cachedPages) : 1;
      const lastPagePhotos = albumCache[lastCachedPage] || [];
  
      const canAddToCurrentPage = lastPagePhotos.length < PHOTOS_PER_PAGE;
  
      if (canAddToCurrentPage) {
        const updatedPhotos = [...lastPagePhotos, newPhoto];
        globalPhotoCache[albumId][lastCachedPage] = updatedPhotos;
        setCurrentPage(lastCachedPage);
        setPhotos(updatedPhotos);
        setHasMore(updatedPhotos.length === PHOTOS_PER_PAGE);
      } 

      setIsAlbumEmpty(false);
      setNewTitle('');
      setNewUrl('');
    } catch (err) {
      console.error("Error adding photo:", err);
      alert("Failed to add photo.");
    }
  };
  
  

  const deletePhoto = async (id) => {
    try {
      await remove("photos", id);
  
      // Invalidate cached pages from currentPage onward
      if (globalPhotoCache[albumId]) {
        const albumCache = globalPhotoCache[albumId];
        const totalPages = Object.keys(albumCache).length;
  
        for (let page = currentPage; page <= totalPages; page++) {
          delete albumCache[page];
        }
      }
  
      // Try to re-fetch the current page
      const data = await getByPage('photos', 'albumId', albumId, currentPage, PHOTOS_PER_PAGE);
  
      if (data.length > 0) {
        setPhotos(data);
        setHasMore(data.length === PHOTOS_PER_PAGE);
        setIsAlbumEmpty(false);
        setSelectedPhoto(null);
  
        // Update cache
        if (!globalPhotoCache[albumId]) globalPhotoCache[albumId] = {};
        globalPhotoCache[albumId][currentPage] = data;
      } else if (currentPage > 1) {
        // Go back one page if current became empty
        const previousPage = currentPage - 1;
        const prevData = await getByPage('photos', 'albumId', albumId, previousPage, PHOTOS_PER_PAGE);
  
        setCurrentPage(previousPage);
        setPhotos(prevData);
        setHasMore(prevData.length === PHOTOS_PER_PAGE);
        setIsAlbumEmpty(prevData.length === 0);
        setSelectedPhoto(null);
  
        // Update cache
        if (!globalPhotoCache[albumId]) globalPhotoCache[albumId] = {};
        globalPhotoCache[albumId][previousPage] = prevData;
      } else {
        // Album is now empty
        setPhotos([]);
        setHasMore(false);
        setIsAlbumEmpty(true);
        setSelectedPhoto(null);
      }
  
    } catch (err) {
      console.error("Error removing photo:", err);
      alert("Failed to remove photo.");
    }
  };
  
  

  
  

  const updatePhoto = async (id, updatedData) => {
    const updatedList = photos.map((photo) =>
      photo.id === id ? { ...photo, ...updatedData } : photo
    );
    

    try{
      await update("photos", id, updatedData);

      setPhotos(updatedList);
      if (globalPhotoCache[albumId]) {
        globalPhotoCache[albumId][currentPage] = updatedList;
      }
    } catch(err){
      console.error("Error removing photo:", err);
      alert("Failed to update photo.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <BackButton to={`/home/users/${userId}/albums`} label="Back to Albums" />
      <h2 className={styles.title}>Photos from Album {albumId}</h2>

      {isAlbumEmpty && (
        <p className={styles.emptyMessage}>This album has no photos yet.</p>
      )}
      <>
          <PhotoGrid photos={photos} onSelect={setSelectedPhoto} />
          
          <AddPhotoForm
              title={newTitle}
              url={newUrl}
              setTitle={setNewTitle}
              setUrl={setNewUrl}
              onAdd={addPhoto}
          />
          
          {!isAlbumEmpty && 
          <PhotoPagination
              page={currentPage}
              onPrev={handlePrev}
              onNext={handleNext}
              disablePrev={currentPage === 1}
              disableNext={!hasMore}
          />
          }

        </>
      

      <PhotoPopup
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onSave={updatePhoto}
        onDelete={deletePhoto}
      />
    </div>
  );
  }

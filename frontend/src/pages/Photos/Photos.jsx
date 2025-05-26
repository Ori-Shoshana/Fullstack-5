// Photos.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { create, remove, update, getByPage } from '../../api/crudService';
import PhotoPopup from './PhotoPopup';
import PhotoGrid from './PhotoGrid';
import AddPhotoForm from './AddPhotoForm';
import PhotoPagination from './PhotoPagination';
import styles from '../../css/Photos/Photos.module.css';
import BackButton from '../../components/buttons/BackButton';


const globalPhotoCache = {}; // shared across navigations

export default function Photos() {
  const { albumId, userId } = useParams();
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const PHOTOS_PER_PAGE = 5;

  useEffect(() => {
    // Initialize album cache if not already
    if (!globalPhotoCache[albumId]) {
      globalPhotoCache[albumId] = {};
    }

    const cachedPage = globalPhotoCache[albumId][currentPage];
    if (cachedPage) {
      console.log("from cache");
      setPhotos(cachedPage);
      setHasMore(cachedPage.length === PHOTOS_PER_PAGE);
      return;
    }

    const loadPhotos = async () => {
      try {
        console.log("fetching");
        const data = await getByPage('photos', 'albumId', albumId, currentPage, PHOTOS_PER_PAGE);
        setPhotos(data);
        setHasMore(data.length === PHOTOS_PER_PAGE);
        globalPhotoCache[albumId][currentPage] = data;
      } catch (err) {
        console.error('Failed to load photos:', err);
        alert('Error loading photos');
      }
    };

    loadPhotos();
  }, [albumId, currentPage]);

  const handleNext = () => {
    if (hasMore) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const addPhoto = async () => {
    if (!newTitle.trim() || !newUrl.trim()) return;

    await create("photos", {
      albumId: parseInt(albumId),
      title: newTitle.trim(),
      url: newUrl.trim(),
      thumbnailUrl: newUrl.trim()
    });

    const albumCache = globalPhotoCache[albumId];

    if (albumCache && Object.keys(albumCache).length > 0) {
      const lastPage = Math.max(...Object.keys(albumCache).map(Number));
      delete albumCache[lastPage];
      console.log(`✅ Cleared album ${albumId}, page ${lastPage} from cache.`);
      if (currentPage === lastPage) {
        const refreshed = await getByPage('photos', 'albumId', albumId, currentPage, PHOTOS_PER_PAGE);
        setPhotos(refreshed);
        globalPhotoCache[albumId][currentPage] = refreshed;
        setHasMore(refreshed.length === PHOTOS_PER_PAGE);
      }
    } else {
      console.log(`ℹ️ No pages in cache for album ${albumId}, nothing to clear.`);
    }
    setNewTitle('');
    setNewUrl('');
  };


  const deletePhoto = async (id) => {
    await remove("photos", id);
    const res1 = await getByPage("photos", "albumId", albumId, currentPage, PHOTOS_PER_PAGE);
    let currentPhotos = res1;

    if (currentPhotos.length < PHOTOS_PER_PAGE) {
      const res2 = await getByPage("photos", "albumId", albumId, currentPage + 1, PHOTOS_PER_PAGE);
      let nextPagePhotos = res2;

      while (currentPhotos.length < PHOTOS_PER_PAGE && nextPagePhotos.length > 0) {
        currentPhotos.push(nextPagePhotos.shift());
      }

      globalPhotoCache[albumId][currentPage] = currentPhotos;
      globalPhotoCache[albumId][currentPage + 1] = nextPagePhotos;
      setHasMore(nextPagePhotos.length > 0);
    } else {
      globalPhotoCache[albumId][currentPage] = currentPhotos;
      setHasMore(true);
    }

    setPhotos(currentPhotos);
    setSelectedPhoto(null);
  };

  const updatePhoto = async (id, updatedData) => {
    const updatedList = photos.map((photo) =>
      photo.id === id ? { ...photo, ...updatedData } : photo
    );
    setPhotos(updatedList);
    globalPhotoCache[albumId][currentPage] = updatedList;

    await update("photos", id, updatedData);
  };

  return (
    <div className={styles.wrapper}>
      <BackButton to={`/home/users/${userId}/albums`} label="Back to Albums" />

      <h2 className={styles.title}>Photos from Album {albumId}</h2>

      <PhotoGrid photos={photos} onSelect={setSelectedPhoto} />
      <AddPhotoForm
        title={newTitle}
        url={newUrl}
        setTitle={setNewTitle}
        setUrl={setNewUrl}
        onAdd={addPhoto}
      />
      <PhotoPagination
        page={currentPage}
        hasMore={hasMore}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <PhotoPopup
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onSave={updatePhoto}
        onDelete={deletePhoto}
      />
    </div>
  );

}

import { useState, useCallback } from 'react';
import { ROVERS } from '../data/roverCameras';

const API_BASE = 'https://images-api.nasa.gov/search';
const PER_PAGE = 25;

/**
 * Normalise a single NASA Image Library item into a flat photo object.
 * Picks the best thumbnail (small → thumb) and full-res (orig → small) links.
 */
function normaliseItem(item) {
  const meta = item.data?.[0] ?? {};
  const links = item.links ?? [];

  const thumb =
    links.find((l) => l.rel === 'preview')?.href ||
    links.find((l) => l.rel === 'alternate')?.href ||
    '';

  const full =
    links.find((l) => l.rel === 'canonical')?.href ||
    links.find((l) => l.rel === 'alternate')?.href ||
    thumb;

  return {
    id: meta.nasa_id || Math.random().toString(36).slice(2),
    title: meta.title || 'Untitled',
    description: meta.description || '',
    date_created: meta.date_created || '',
    center: meta.center || '',
    keywords: meta.keywords || [],
    photographer: meta.secondary_creator || meta.photographer || 'NASA/JPL-Caltech',
    thumb_src: thumb,
    img_src: full,
  };
}

export function useRoverPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [currentParams, setCurrentParams] = useState(null);

  const fetchPhotos = useCallback(async ({ rover, keywords, yearStart, yearEnd, pageNum = 1, append = false }) => {
    if (!rover) return;

    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setPhotos([]);
    }
    setError(null);

    try {
      const roverData = ROVERS.find((r) => r.id === rover);
      const baseQuery = roverData?.searchTerms || `${rover} mars rover`;
      const q = keywords ? `${baseQuery} ${keywords}` : baseQuery;

      const params = new URLSearchParams({
        q,
        media_type: 'image',
        page: String(pageNum),
        page_size: String(PER_PAGE),
      });

      if (yearStart) params.set('year_start', yearStart);
      if (yearEnd) params.set('year_end', yearEnd);

      const url = `${API_BASE}?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const items = data?.collection?.items ?? [];
      const newPhotos = items.map(normaliseItem).filter((p) => p.thumb_src);

      if (append) {
        setPhotos((prev) => [...prev, ...newPhotos]);
      } else {
        setPhotos(newPhotos);
      }

      // Check if there's a "next" link in the response
      const hasNextLink = (data?.collection?.links ?? []).some((l) => l.rel === 'next');
      setHasMore(hasNextLink && newPhotos.length > 0);
      setPage(pageNum);
      setCurrentParams({ rover, keywords, yearStart, yearEnd });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      if (!append) setPhotos([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (currentParams && !loadingMore) {
      fetchPhotos({ ...currentParams, pageNum: page + 1, append: true });
    }
  }, [currentParams, page, loadingMore, fetchPhotos]);

  return { photos, loading, loadingMore, error, hasMore, fetchPhotos, loadMore };
}

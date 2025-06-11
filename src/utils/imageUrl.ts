import path from 'path';

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.CDN_URL || 'https://your-cdn-url.com';
  }
  return `http://localhost:${process.env.PORT || 5000}`;
};

export const getImageUrl = (filename: string | null): string => {
  if (!filename) return '';

  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }

  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  return `${baseUrl}/uploads/${filename}`;
};

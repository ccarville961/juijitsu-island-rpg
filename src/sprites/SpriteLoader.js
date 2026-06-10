const imageCache = new Map();

export function loadSpriteImage(src) {
  if (imageCache.has(src)) return imageCache.get(src);

  const promise = new Promise(resolve => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      console.error("Sprite image missing:", src);
      resolve(null);
    };

    image.src = src;
  });

  imageCache.set(src, promise);
  return promise;
}

// Sound effect URLs
export const SOUNDS = {
  CLICK: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  SUCCESS: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  ERROR: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  SWAP: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  COMPLETE: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
};

export const playSound = (url: string) => {
  const audio = new Audio(url);
  audio.volume = 0.4;
  audio.play().catch(e => console.log('Audio play blocked by browser', e));
};

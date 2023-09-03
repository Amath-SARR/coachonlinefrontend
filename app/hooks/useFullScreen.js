import { useEffect, useState } from 'react';

const exitFullScreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
};

export const useFullScreen = (elementOrElementId) => {
  const element =
    typeof elementOrElementId === 'string'
      ? document.getElementById(elementOrElementId)
      : elementOrElementId;

  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    element?.addEventListener('fullscreenchange', onFullScreenChange);
    return () => {
      element?.removeEventListener('fullscreenchange', onFullScreenChange);
    };
  }, [element]);

  const onFullScreenChange = () => {
    const documentFSElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    console.log('Fullscreen toggle', documentFSElement, element, documentFSElement === element);
    setIsFullScreen(documentFSElement === element);
  };

  const toggleFullScreen = () => {
    const documentFSElement =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    console.log('Entering fullscreen mode', element);
    // if there's another element currently full screen, exit first
    if (documentFSElement && documentFSElement !== element) {
      exitFullScreen();
      return;
    }
    // if the current element is not already full screen, make it full screen
    if (!documentFSElement) {
      if (element?.requestFullscreen) {
        element.requestFullscreen();
      } else if (element?.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element?.webkitRequestFullscreen) {
        element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      } else if (element?.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.webkitEnterFullscreen) {
        element.webkitEnterFullscreen();
      } else {
      throw new Error('Full screen is not supported');
      }
    } else {
      documentFSElement && exitFullScreen();
    }
  };

  return { toggleFullScreen, isFullScreen };
};

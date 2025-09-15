import { useState, useCallback, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeOptions {
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean;
}

interface SwipeState {
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | 'up' | 'down' | null;
  deltaX: number;
  deltaY: number;
}

export const useSwipe = (
  handlers: SwipeHandlers = {},
  options: SwipeOptions = {}
) => {
  const {
    threshold = 50,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    isSwiping: false,
    swipeDirection: null,
    deltaX: 0,
    deltaY: 0
  });

  const touchStart = useRef({ x: 0, y: 0, time: 0 });
  const touchEnd = useRef({ x: 0, y: 0, time: 0 });

  const updateSwipeState = useCallback((updates: Partial<SwipeState>) => {
    setSwipeState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleStart = useCallback((clientX: number, clientY: number) => {
    touchStart.current = { x: clientX, y: clientY, time: Date.now() };
    touchEnd.current = { x: clientX, y: clientY, time: Date.now() };
    updateSwipeState({ isSwiping: true, deltaX: 0, deltaY: 0, swipeDirection: null });
  }, [updateSwipeState]);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!swipeState.isSwiping) return;

    touchEnd.current = { x: clientX, y: clientY, time: Date.now() };
    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;

    updateSwipeState({ deltaX, deltaY });
  }, [swipeState.isSwiping, updateSwipeState]);

  const handleEnd = useCallback(() => {
    if (!swipeState.isSwiping) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const deltaTime = touchEnd.current.time - touchStart.current.time;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Only trigger swipe if it's fast enough (< 300ms) and far enough
    if (deltaTime < 300 && Math.max(absX, absY) > threshold) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
          updateSwipeState({ swipeDirection: 'right' });
        } else {
          handlers.onSwipeLeft?.();
          updateSwipeState({ swipeDirection: 'left' });
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
          updateSwipeState({ swipeDirection: 'down' });
        } else {
          handlers.onSwipeUp?.();
          updateSwipeState({ swipeDirection: 'up' });
        }
      }
    }

    updateSwipeState({ isSwiping: false, deltaX: 0, deltaY: 0 });
  }, [swipeState.isSwiping, threshold, handlers, updateSwipeState]);

  const swipeHandlers = {
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    onTouchEnd: () => {
      handleEnd();
    },
    ...(trackMouse && {
      onMouseDown: (e: React.MouseEvent) => {
        handleStart(e.clientX, e.clientY);
      },
      onMouseMove: (e: React.MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      },
      onMouseUp: () => {
        handleEnd();
      }
    })
  };

  return {
    swipeHandlers,
    swipeState,
    resetSwipe: () => updateSwipeState({ 
      isSwiping: false, 
      swipeDirection: null, 
      deltaX: 0, 
      deltaY: 0 
    })
  };
};
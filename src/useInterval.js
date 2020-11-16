// https://overreacted.io/making-setinterval-declarative-with-react-hooks/

import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay, immediately=false) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (immediately) {
      setTimeout(tick, 0);
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, immediately]);
}

export default useInterval;
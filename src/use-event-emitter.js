import { useRef, useEffect } from 'react';
import { Subscription } from './types';

export class EventEmitter {
  
  subscriptions = new Set();
  
  emit = (val) => {
    for (const subscription of this.subscriptions) {
      subscription(val);
    }
  };

  useSubscription = (callback) => {
    const callbackRef = useRef();
    callbackRef.current = callback;
    useEffect(() => {
      function subscription(val) {
        if (callbackRef.current) {
          callbackRef.current(val);
        }
      }
      this.subscriptions.add(subscription);
      return () => {
        this.subscriptions.delete(subscription);
      };
    }, []);
  };
}

export function useEventEmitter() {
  const ref = useRef();
  if (!ref.current) {
    ref.current = new EventEmitter();
  }
  return ref.current;
}
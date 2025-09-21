import { useState, useEffect, useRef } from 'react';
import { Badge } from 'ui/badge';

/**
 * Timer component to display countdown based on creation time and expiration duration.
 * @param {string} createdAt - The creation time in ISO format.
 * @param {number} expireTime - The expiration time in minutes.
 * @param {string} [className] - Optional additional CSS classes for styling.
 * @param {function} [onExpire] - Optional callback function to be called when the timer expires.
 * @returns {JSX.Element | null} - Returns a Badge component with the remaining time or null if expired.
 */
const Timer = ({
  createdAt,
  expireTime,
  className,
  onExpire
}: {
  createdAt: string;
  expireTime: number;
  className?: string;
  onExpire?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const hasExpiredCalled = useRef(false);

  useEffect(() => {
    if (!createdAt) return;

    const expirationTime = new Date(createdAt).getTime() + expireTime * 60 * 1000;

    const calculateRemaining = () => {
      const now = new Date().getTime();
      const remaining = expirationTime - now;

      if (remaining <= 0) {
        setTimeLeft(0);

        // Call onExpire only once
        if (!hasExpiredCalled.current && onExpire) {
          onExpire();
          hasExpiredCalled.current = true;
        }
      } else {
        setTimeLeft(remaining);
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [createdAt, expireTime, onExpire]);

  const isLeft = timeLeft !== null && timeLeft > 0;

  const minutes = Math.floor((timeLeft ?? 0) / (1000 * 60));
  const seconds = Math.floor(((timeLeft ?? 0) % (1000 * 60)) / 1000);

  return (
    <Badge
      className={`text-sm font-medium border ${
        isLeft
          ? 'border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white'
          : 'border-gray-400 text-gray-400 bg-transparent'
      } ${className}`}
    >
      {isLeft ? (
        <>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </>
      ) : (
        <>Expired</>
      )}
    </Badge>
  );
};

export default Timer;

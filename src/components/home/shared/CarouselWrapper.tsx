import React, { ReactNode, Children, isValidElement, cloneElement } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
} from '@/components/ui/carousel';

interface CarouselWrapperProps {
  children: ReactNode;
  itemClassName?: string;
  className?: string;
  opts?: { align?: 'start' | 'center' | 'end'; loop?: boolean };
}
export default function CarouselWrapper({
  children,
  itemClassName = 'flex-none',
  className = 'w-full',
  opts = { align: 'start', loop: false },
}: CarouselWrapperProps) {
  const wrappedItems = Children.map(children, (child) => {
    if (isValidElement(child) && child.type !== CarouselItem) {
      return (
        <CarouselItem className={`${itemClassName} pl-4`}>
          {child}
        </CarouselItem>
      );
    }
    return child;
  });

  return (
    <div className={className}>
      <Carousel opts={opts}>
        <CarouselContent className="flex -ml-4">
          {wrappedItems}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
}

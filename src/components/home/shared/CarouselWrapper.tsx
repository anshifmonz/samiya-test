import React, { ReactNode, Children, isValidElement } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  CarouselItem,
} from 'components/ui/carousel';

interface CarouselWrapperProps {
  children: ReactNode;
  itemClassName?: string;
  className?: string;
  opts?: { align?: 'start' | 'center' | 'end'; loop?: boolean; dragFree?: boolean; containScroll?: "trimSnaps" | "keepSnaps"; [key: string]: any };
  disableSwipe?: boolean;
  setApi?: (api: any) => void;
}
export default function CarouselWrapper({
  children,
  itemClassName = 'flex-none',
  className = 'w-full',
  opts = { align: 'start', loop: false, dragFree: true, containScroll: "trimSnaps" },
  disableSwipe = false,
  setApi,
}: CarouselWrapperProps) {
  // clone opts to avoid mutating the prop
  const carouselOpts = { ...opts };
  if (disableSwipe) {
    carouselOpts.watchDrag = false;
  }
  const wrappedItems = Children.map(children, (child) => {
    if (isValidElement(child) && child.type !== CarouselItem) {
      return (
        <CarouselItem className={`${itemClassName} pl-2`}>
          {child}
        </CarouselItem>
      );
    }
    return child;
  });

  return (
    <div className="relative mx-auto pl-1">
      <div className={className}>
        <Carousel opts={carouselOpts} setApi={setApi}>
          <CarouselContent className="flex -ml-0">
            {wrappedItems}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </div>
  );
}

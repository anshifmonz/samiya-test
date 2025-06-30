import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "ui/carousel";
import { type NewArrival } from "@/data/newarrivals";
import NewArrivalsCard from './NewArrivalsCard';

const NewArrivalCarousel = ({ newArrivals }: { newArrivals: NewArrival[] }) => {
  return (
    <div className="relative ml-10 mr-10 mx-auto px-4">
      <Carousel className="w-full" opts={{ align: "start", loop: false }}>
        <CarouselContent className="-ml-2 md:-ml-4">
          {newArrivals.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <NewArrivalsCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default NewArrivalCarousel;

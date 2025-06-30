export type NewArrival = {
  id: number;
  image: string;
  title: string;
  price: string;
};

const newArrivals: NewArrival[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80",
    title: "Elegant Dress",
    price: "2,999"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
    title: "Premium Laptop",
    price: "45,999"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    title: "Work Essentials",
    price: "1,899"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80",
    title: "Tech Accessories",
    price: "899"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=600&q=80",
    title: "Home Decor",
    price: "3,499"
  }
];

export default newArrivals;

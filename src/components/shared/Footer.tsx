import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#E0DDD3] text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start gap-8 flex-wrap">
          <div className="">
            <h3 className="text-2xl font-light mb-4 tracking-wide text-[#1A1A1A]">Samiya Wedding Center</h3>
            <p className="text-[#1A1A1A] text-sm leading-relaxed max-w-md">
              Discover the latest trends and timeless pieces that define your unique style.
              Quality fashion for the modern lifestyle.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wide text-[#1A1A1A]">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-[#333]">
              <li><Link href="/about" className="hover:text-luxury-gold-dark transition-colors">About Us</Link></li>
              <li><Link href="/collections" className="hover:text-luxury-gold-dark transition-colors">Collections</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-luxury-gold-dark transition-colors">New Arrivals</Link></li>
              <li><Link href="/contact" className="hover:text-luxury-gold-dark transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-sm tracking-wide text-[#1A1A1A]">SUPPORT</h4>
            <ul className="space-y-2 text-sm text-[#333]">
              <li><Link href="#" className="hover:text-luxury-gold-dark transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="hover:text-luxury-gold-dark transition-colors">Returns</Link></li>
              <li><Link href="#" className="hover:text-luxury-gold-dark transition-colors">Shipping</Link></li>
              <li><Link href="#" className="hover:text-luxury-gold-dark transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-[#1A1A1A] text-sm">
            © {new Date().getFullYear()} Fashion Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

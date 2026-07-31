import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 px-12 py-16 border-t border-stone-850">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-playfair text-lg font-bold tracking-widest text-white">
            CARATLINE
          </span>
          <p className="text-xs leading-relaxed text-stone-500 max-w-xs">
            Designing production-grade customizable luxury jewellery powered by state of the art artificial intelligence and interactive 3D visualizers.
          </p>
        </div>

        {/* Collections links */}
        <div className="flex flex-col gap-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Collections</h5>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <Link href="/catalog?category=rings" className="hover:text-white transition-colors">
                Rings
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=necklaces" className="hover:text-white transition-colors">
                Necklaces
              </Link>
            </li>
            <li>
              <Link href="/catalog?category=earrings" className="hover:text-white transition-colors">
                Earrings
              </Link>
            </li>
          </ul>
        </div>

        {/* Services links */}
        <div className="flex flex-col gap-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Design Studio</h5>
          <ul className="flex flex-col gap-2 text-xs">
            <li>
              <Link href="/customizer" className="hover:text-white transition-colors">
                3D Customizer
              </Link>
            </li>
            <li>
              <Link href="/ai-assistant" className="hover:text-white transition-colors">
                AI Prompt Designer
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal info */}
        <div className="flex flex-col gap-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-white">Heritage</h5>
          <ul className="flex flex-col gap-2 text-xs text-stone-500">
            <li>Caratline Craftsmanship</li>
            <li>Ethics & Sustainability</li>
            <li>Privacy & Service Terms</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-stone-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between text-[11px] text-stone-600">
        <span>© {new Date().getFullYear()} Caratline, Inc. All rights reserved.</span>
        <span>Premium AI Jewellery Craftsmanship.</span>
      </div>
    </footer>
  );
};
export default Footer;

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/play', label: 'Play', icon: '🎣' },
  { href: '/shop', label: 'Shop', icon: '🏪' },
  { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  { href: '/settings', label: 'Account', icon: '👤' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-gray-200 shadow-lg z-50 md:relative md:border-t-0 md:border-b-4 md:mb-6">
      <div className="flex justify-around items-center max-w-4xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.href} href={item.href} className="flex-1">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex flex-col items-center justify-center py-3 px-2 transition-all
                  ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-500'
                  }
                `}
              >
                <span className="text-2xl mb-1">{item.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wide">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
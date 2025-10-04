'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, Phone, Menu as MenuIcon, ShoppingBag, Users, Truck } from 'lucide-react';
import { shops } from '@/lib/db/data';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Left Sidebar - Color Filler */}
      <div className="hidden xl:block fixed left-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

      {/* Right Sidebar - Color Filler */}
      <div className="hidden xl:block fixed right-0 top-0 h-full w-32 bg-orange-600 z-30"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-green-700 backdrop-blur-sm shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <Image
                  src="/brand/logo-small-transparent.png"
                  alt="Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative h-12 w-40">
                <Image
                  src="/brand/logo-text-white.png"
                  alt="Hungry Mays"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-white">
              <a href="#services" className="hover:text-orange-200 transition font-medium">
                Services
              </a>
              <a href="#how-it-works" className="hover:text-orange-200 transition font-medium">
                How It Works
              </a>
              <a href="#locations" className="hover:text-orange-200 transition font-medium">
                Locations
              </a>
              <Link
                href="/my-orders"
                className="hover:text-orange-200 transition font-medium"
              >
                My Orders
              </Link>
              <Link
                href="/menu"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-md"
              >
                Order Now
              </Link>
            </div>
            <button className="md:hidden text-gray-700">
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content - with margin for sidebars on xl screens */}
      <div className="xl:mx-32">
        {/* Hero Section with Background */}
        <div className="relative h-screen flex items-center justify-center">
        <Image
          src="/smash-burger.jpg"
          alt="Delicious smash burger"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-12 shadow-2xl border border-white/10">
            <div className="flex relative mx-auto h-32 w-32">
              <Image
                src="/brand/logo-small-transparent.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
              </div>
            <div className="relative h-26 md:h-32 w-full mb-6">
              <Image
                src="/brand/logo-text-white.png"
                alt="Hungry Mays"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
            <p className="text-2xl md:text-3xl mb-8 drop-shadow-lg">Fresh burgers. Fast delivery. No account needed.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/menu"
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition shadow-2xl text-lg"
              >
                Order Now
              </Link>
              <a
                href="#services"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 backdrop-blur-sm transition text-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">How You Want It</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">We serve you the way that suits you best</p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Walk-in */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition">
              <div className="relative h-64">
                <Image
                  src="/walk-in.jpg"
                  alt="Walk-in dining"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="text-orange-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900">Walk-In</h3>
                </div>
                <p className="text-gray-600">Visit us and enjoy your burger fresh off the grill. Dine in or grab it to go!</p>
              </div>
            </div>

            {/* Takeaway */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition">
              <div className="relative h-64">
                <Image
                  src="/takeaway.jpg"
                  alt="Takeaway service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <ShoppingBag className="text-green-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900">Takeaway</h3>
                </div>
                <p className="text-gray-600">Order ahead and pick it up when ready. Skip the wait and get going!</p>
              </div>
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition">
              <div className="relative h-64">
                <Image
                  src="/delivery.jpg"
                  alt="Delivery service"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="text-amber-600" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900">Delivery</h3>
                </div>
                <p className="text-gray-600">We bring the burgers to you. Hot, fresh, and right to your door!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">How It Works</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Three simple steps to burger bliss</p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl font-bold text-orange-600">1</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900">Browse Menu</h3>
              <p className="text-gray-600">Check out our delicious selection of burgers and sides</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900">Order & Pay</h3>
              <p className="text-gray-600">Pick your favorites and pay online or cash on delivery</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-3xl font-bold text-amber-600">3</span>
              </div>
              <h3 className="font-semibold text-xl mb-2 text-gray-900">Track & Enjoy</h3>
              <p className="text-gray-600">Get real-time updates and enjoy your meal!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Where We Are - Footer Section */}
      <footer id="locations" className="py-16 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3">Where We Are</h2>
          <p className="text-center text-gray-400 mb-12">Find us at any of our locations across Sydney</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {shops.map(shop => (
              <div
                key={shop.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-orange-500 transition"
              >
                <h3 className="text-xl font-semibold mb-4 text-orange-400">{shop.name}</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{shop.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm">{shop.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm">11:00am - 10:00pm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <Link href="/" className="relative inline-block h-10 w-32 hover:opacity-80 transition">
                  <Image
                    src="/brand/logo-text-white.png"
                    alt="Hungry Mays"
                    fill
                    className="object-contain"
                  />
                </Link>
                <p className="text-gray-400 text-sm mt-3">Fresh burgers. Fast delivery. No account needed.</p>
              </div>
              <div className="text-center md:text-right text-gray-400 text-sm">
                <p>&copy; 2025 Hungry Mays. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}


import React from 'react';
import RestaurantCarousel from '@/components/home/RestaurantCarousel';
import RestaurantHero from '@/components/home/RestaurantHero';
import ReviewsSection from '@/components/home/ReviewsSection';
import RestaurantFooter from '@/components/home/RestaurantFooter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <RestaurantCarousel />
      <RestaurantHero />
      <ReviewsSection />
      <RestaurantFooter />
    </div>
  );
};

export default Index;

import React from 'react';
import MenuSection from '@/components/MenuSection';
import ReservationSection from '@/components/ReservationSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center" 
               style={{
                 backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')",
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}>
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">La Belle Cuisine</h1>
          <p className="text-xl mb-8">Experience Fine Dining at its Best</p>
        </div>
      </section>

      {/* Menu Section */}
      <MenuSection />

      {/* Reservation Section */}
      <ReservationSection />
    </div>
  );
};

export default Index;
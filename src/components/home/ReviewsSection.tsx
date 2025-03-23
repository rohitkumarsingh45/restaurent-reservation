
import React from 'react';
import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  comment: string;
}

const ReviewsSection = () => {
  const reviews: Review[] = [
    {
      name: "John Doe",
      rating: 5,
      comment: "Exceptional dining experience! The atmosphere and service were impeccable."
    },
    {
      name: "Jane Smith",
      rating: 5,
      comment: "The best fine dining restaurant in the city. Every dish was a masterpiece."
    },
    {
      name: "Mike Johnson",
      rating: 5,
      comment: "Outstanding service and amazing food. Will definitely come back!"
    }
  ];
  
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">What Our Guests Say</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((review, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              <p className="font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

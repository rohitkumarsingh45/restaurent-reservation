import React from 'react';
import { Star, Quote } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  image: string;
  role: string;
}

const ReviewsSection = () => {
  const reviews: Review[] = [
    {
      name: "Sarah Anderson",
      rating: 5,
      comment: "Absolutely phenomenal dining experience! The chef's tasting menu was a culinary journey that exceeded all expectations. Every dish was a perfect harmony of flavors and presentation.",
      date: "March 15, 2025",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      role: "Food Critic"
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "The wine pairing was expertly curated, and the sommelier's knowledge added an extra dimension to our meal. The ambiance perfectly balances luxury with comfort.",
      date: "April 2, 2025",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      role: "Wine Enthusiast"
    },
    {
      name: "Isabella Martinez",
      rating: 5,
      comment: "From the moment we walked in, the service was impeccable. The seasonal menu showcases local ingredients at their finest. The dessert was simply unforgettable!",
      date: "April 8, 2025",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      role: "Regular Guest"
    },
    {
      name: "James Wilson",
      rating: 5,
      comment: "The attention to detail in both food and service is remarkable. Their commitment to sustainability and local sourcing makes dining here even more special.",
      date: "March 28, 2025",
      image: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      role: "Food Blogger"
    },
    {
      name: "Emily Thompson",
      rating: 5,
      comment: "Celebrated our anniversary here and it was magical! The custom tasting menu and personalized service made our special evening unforgettable.",
      date: "April 5, 2025",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      role: "Verified Diner"
    },
    {
      name: "David Kumar",
      rating: 5,
      comment: "A true culinary gem! The fusion of traditional and modern techniques creates dishes that are both innovative and deeply satisfying.",
      date: "March 22, 2025",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      role: "Culinary Professional"
    }
  ];
  
  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued guests have to say about their dining experience at La Belle Cuisine.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className={cn(
                "bg-card p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                "border border-border/50"
              )}
            >
              <div className="relative">
                <Quote className="absolute text-primary/10 w-12 h-12 -top-2 -left-2" />
                <div className="flex items-center mb-4">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-card-foreground mb-6 relative z-10 italic">"{review.comment}"</p>
              </div>
              
              <div className="flex items-center mt-6 pt-6 border-t border-border/50">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-primary/10">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-card-foreground">{review.name}</p>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Utensils, Users, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Story</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the passion, tradition, and innovation behind La Belle Cuisine
          </p>
        </div>

        {/* History Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-semibold mb-6">A Legacy of Excellence</h2>
            <p className="text-gray-600 mb-4">
              Founded in 1998 by renowned chef Jean-Pierre Dubois, La Belle Cuisine began as a small family restaurant with a big dream: to create extraordinary dining experiences that celebrate the art of French cuisine while embracing modern culinary innovations.
            </p>
            <p className="text-gray-600">
              Over the past 25 years, we've grown from a modest bistro into one of the city's most beloved fine dining establishments, earning numerous accolades and building a community of loyal patrons who share our passion for exceptional food and service.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt="Restaurant interior"
              className="rounded-lg shadow-xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-lg shadow-lg">
              <p className="font-semibold">Est. 1998</p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent>
                <Utensils className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Culinary Excellence</h3>
                <p className="text-gray-600">
                  We pursue perfection in every dish, combining traditional techniques with innovative approaches.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <Leaf className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
                <p className="text-gray-600">
                  Our commitment to local sourcing and sustainable practices ensures the finest ingredients while supporting our community.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent>
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Exceptional Service</h3>
                <p className="text-gray-600">
                  Our dedicated team strives to create memorable experiences for every guest who walks through our doors.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt="Executive Chef"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Jean-Pierre Dubois</h3>
              <p className="text-primary mb-2">Executive Chef & Founder</p>
              <p className="text-gray-600 max-w-md mx-auto">
                With over 25 years of culinary expertise, Chef Jean-Pierre brings his passion for French cuisine and innovative cooking techniques to every dish.
              </p>
            </div>
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1744023238070-062811b3a702?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Head Sommelier"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">Marie Laurent</h3>
              <p className="text-primary mb-2">Head Sommelier</p>
              <p className="text-gray-600 max-w-md mx-auto">
                A certified sommelier with extensive knowledge of wine regions worldwide, Marie curates our award-winning wine collection.
              </p>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold mb-8">Recognition & Awards</h2>
          <div className="flex justify-center items-center mb-4">
            <Award className="w-8 h-8 text-yellow-500 mr-2" />
            <span className="text-xl font-semibold">Excellence in Fine Dining 2024</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're honored to be recognized for our commitment to culinary excellence and exceptional dining experiences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
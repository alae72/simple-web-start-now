
import React from "react";
import { ChevronDown } from "lucide-react";

const BecomeAHost = () => {
  const [openFaq, setOpenFaq] = React.useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(135deg, #1A5D91 0%, #DAA520 100%)'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Start Hosting with
            <span className="block text-yellow-300">MartilHaven</span>
          </h1>
          <p className="text-xl md:text-3xl mb-8 max-w-4xl mx-auto font-light">
            Share your space, earn income, and connect with travelers worldwide
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
              Try Hosting
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg">
              Learn More
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-white opacity-70" />
        </div>
      </section>

      {/* Why Host with Us Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Host with MartilHaven?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of hosts who are earning extra income while sharing their love for Morocco
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Earn Extra Income", 
                icon: "💰",
                description: "Hosts in Martil earn an average of $2,500 per month during peak season"
              },
              { 
                title: "Full Control of Your Property", 
                icon: "🏠",
                description: "Set your own prices, availability, and house rules. You decide when and how to host"
              },
              { 
                title: "Meet Travelers from Around the World", 
                icon: "🌍",
                description: "Connect with amazing people and share your culture with visitors from every continent"
              },
              { 
                title: "We're With You Every Step", 
                icon: "🤝",
                description: "24/7 support, host protection insurance, and secure payment processing"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center group"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host Story or Testimonial */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Successful host"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-yellow-500 text-black p-4 rounded-xl shadow-lg">
                  <div className="text-2xl font-bold">$3,200</div>
                  <div className="text-sm">earned last month</div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                    A
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">Amina</h4>
                    <p className="text-gray-600">Host since 2022 • Martil</p>
                  </div>
                </div>
                <blockquote className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed mb-6">
                  "Hosting with MartilHaven has completely changed my life. I've been able to renovate my traditional riad and create lasting friendships with guests from around the world."
                </blockquote>
                <p className="text-lg text-gray-600 leading-relaxed">
                  "The platform makes everything so easy - from listing my property to managing bookings. The support team is always there when I need them, and the guests love experiencing authentic Moroccan hospitality."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-yellow-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "1", 
                title: "Sign up", 
                icon: "📝",
                description: "Create your host account in under 5 minutes. It's completely free to get started."
              },
              { 
                step: "2", 
                title: "List your place", 
                icon: "🏡",
                description: "Add photos, set your price, and describe your space. Our team will help optimize your listing."
              },
              { 
                step: "3", 
                title: "Start earning", 
                icon: "💵",
                description: "Once approved, start receiving bookings and earning money from day one."
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative text-center group"
              >
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-yellow-300 transform translate-x-4 z-0"></div>
                )}
                
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about hosting with MartilHaven
            </p>
          </div>
          
          <div className="space-y-4">
            {[
              { 
                question: "How much can I earn hosting my property?", 
                answer: "Earnings vary by location, property type, and seasonality. In Martil, hosts typically earn between $1,500-$3,500 per month during peak season. Use our earnings calculator to get a personalized estimate for your space."
              },
              { 
                question: "What fees does MartilHaven charge?", 
                answer: "We charge a small service fee of 3% on each booking. This covers payment processing, 24/7 customer support, and host protection insurance. There are no upfront costs or monthly fees to list your property."
              },
              { 
                question: "How does MartilHaven protect me as a host?", 
                answer: "We provide comprehensive host protection including up to $1M in property damage coverage, verified guest profiles, secure payment processing, and 24/7 support. All payments are processed securely and released 24 hours after guest check-in."
              },
              { 
                question: "Can I host part-time or seasonally?", 
                answer: "Absolutely! You have complete control over your availability calendar. Many hosts only rent during peak tourist season or when they're traveling. You can block dates anytime and set minimum stay requirements."
              },
              { 
                question: "What support do you provide to new hosts?", 
                answer: "New hosts receive a comprehensive welcome guide, one-on-one onboarding call, professional photography tips, pricing recommendations, and ongoing support via phone, email, or chat. We're here to help you succeed from day one."
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <button
                  className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-500 transform transition-transform duration-200 flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Hosting?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Join thousands of hosts in Morocco who are earning extra income and sharing their culture with travelers from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg">
              Contact Support
            </button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Have questions? Our support team is available 24/7 to help you get started.
          </p>
        </div>
      </section>
    </div>
  );
};

export default BecomeAHost;

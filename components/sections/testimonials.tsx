import Card from '../ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    name: "Alex Chen",
    role: "Software Engineer at Google",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    content: "My mentor helped me prepare for technical interviews and improve my system design skills. I landed my dream job thanks to their guidance!"
  },
  {
    name: "Sarah Miller",
    role: "Product Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    content: "The structured learning approach and real-world projects helped me transition from graphic design to UX/UI design in just 6 months."
  },
  {
    name: "James Wilson",
    role: "Data Scientist at Meta",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
    content: "Weekly sessions with my mentor accelerated my learning curve. Their practical insights were invaluable for my career growth."
  }
];

export function Testimonials() {
  return (
    <div className="py-20 bg-gradient-to-b from-sky-50 to-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Success Stories</h2>
          <p className="text-xl text-blue-600">Join thousands of successful mentees</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
                <div className="flex items-center mb-4">
                    <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                    />
                    <div>
                        <h3 className="font-semibold text-blue-900">{testimonial.name}</h3>
                        <p className="text-blue-600 text-sm">{testimonial.role}</p>
                    </div>
                </div>
                <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                </div>
                <p className="text-blue-700">{testimonial.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
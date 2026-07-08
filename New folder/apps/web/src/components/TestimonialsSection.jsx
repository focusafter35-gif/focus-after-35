import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Maya Chen",
        role: "Marketing Director",
        age: 42,
        initials: "MC",
        quote: "I thought my lack of focus was just burnout, but understanding my hormonal health changed everything. The strategies here lifted the brain fog completely—I'm sharper now than I was in my thirties."
    },
    {
        name: "Lucia Torres",
        role: "Teacher",
        age: 47,
        initials: "LT",
        quote: "Managing a classroom requires constant energy. When perimenopause hit, I was exhausted. This resource gave me actionable tools to reclaim my energy levels and keep my cognitive function at its peak."
    },
    {
        name: "Anika Bergström",
        role: "Entrepreneur",
        age: 44,
        initials: "AB",
        quote: "Building a business during midlife is challenging enough without hormonal shifts. Discovering Focus After 35 helped me optimize my routine so my mind stays clear, no matter what my hormones are doing."
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-muted/30 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 
                        className="text-3xl md:text-4xl font-bold text-balance mb-4 text-foreground" 
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        Real Stories from Women Like You
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        See how others have reclaimed their focus and vitality during midlife.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <Card 
                            key={i} 
                            className="h-full flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-muted/50 bg-card group overflow-hidden"
                        >
                            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                <Avatar className="h-12 w-12 rounded-xl border border-primary/10">
                                    <AvatarFallback className="bg-primary/5 text-primary rounded-xl font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                        {testimonial.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-base text-card-foreground leading-tight">
                                        {testimonial.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {testimonial.role}, Age {testimonial.age}
                                    </p>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow relative pt-2">
                                <Quote className="absolute top-0 right-6 w-10 h-10 text-primary/5 -z-0 rotate-180" aria-hidden="true" />
                                <p className="text-muted-foreground leading-relaxed relative z-10">
                                    "{testimonial.quote}"
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
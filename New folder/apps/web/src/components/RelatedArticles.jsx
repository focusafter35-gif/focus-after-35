import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';

const RelatedArticles = ({ articles = [] }) => {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="w-full py-12 mt-8 border-t border-border/50">
      <div className="flex items-center gap-2 mb-8">
        <BookOpen className="w-5 h-5 text-primary" />
        <h2 className="text-2xl font-bold tracking-tight text-foreground">You Might Also Like</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link key={article.id} to={article.path} className="group flex flex-col h-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl">
            <Card className="h-full flex flex-col bg-card border-border/50 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 group-hover:bg-muted/30">
              <CardContent className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors text-balance">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {article.description}
                </p>
                <div className="mt-6 flex items-center text-sm font-medium text-primary">
                  Read article
                  <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
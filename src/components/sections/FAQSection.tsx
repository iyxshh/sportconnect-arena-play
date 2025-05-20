
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is SportConnect available in my area?",
    answer: "SportConnect is available globally! The experience is best in areas with more active users, so invite your friends to join and grow your local community."
  },
  {
    question: "How do bid challenges work?",
    answer: "Bid challenges allow you to add a monetary stake to your matches. Funds are held in escrow until a winner is confirmed, then automatically transferred to the winner."
  },
  {
    question: "How does the ranking system work?",
    answer: "We use an Elo-based ranking system that awards or deducts points based on match results and opponent ranking. Different colored badges are awarded as you climb the ranks."
  },
  {
    question: "Can I use SportConnect for team sports?",
    answer: "Yes! While initially focused on individual sports, SportConnect supports team challenges where you can coordinate team formations through the in-app chat."
  },
  {
    question: "How are match results verified?",
    answer: "Match results are verified through mutual confirmation. Both participants must confirm the result, or it can be auto-verified via fitness tracker APIs like Strava or Apple Health."
  },
  {
    question: "What happens if I can't attend a scheduled match?",
    answer: "You should notify your opponent as soon as possible through the in-app chat. Repeated no-shows may affect your ranking. For bid challenges, our cancellation policy applies."
  }
];

function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>("item-0");

  return (
    <section id="faq" className="bg-muted/50 py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have questions about SportConnect? Here are answers to the most common questions.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full" value={openItem} onValueChange={setOpenItem}>
            {faqs.map((faq, index) => (
              <AccordionItem key={`item-${index}`} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;

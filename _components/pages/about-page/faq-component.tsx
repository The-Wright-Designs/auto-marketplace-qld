import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/_components/ui/accordion";
import aboutPageData from "@/_data/general-data.json";

const {
  aboutPage: { faqs },
} = aboutPageData;

const FaqComponent = () => {
  return (
    <Accordion
      type="single"
      defaultValue="item-0"
      collapsible
      className="grid gap-5"
    >
      {faqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-blue/20"
        >
          <AccordionTrigger className="text-left text-[20px] desktop-small:text-[24px] font-semibold text-blue desktop-small:hover:text-grey ease-in-out duration-300">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-[20px]">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FaqComponent;

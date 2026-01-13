import { FileText, CheckCircle, ThumbsUp, DollarSign } from "lucide-react";

import aboutPageData from "@/_data/general-data.json";

const {
  aboutPage: { howItWorksSection },
} = aboutPageData;

const iconStyles = "h-16 w-16";
const iconColor = "#13103F";

const HowItWorksComponent = () => {
  return (
    <div className="grid gap-10">
      <p>{howItWorksSection.description}</p>
      <div className="grid gap-5">
        <p>{howItWorksSection.intro}</p>
        <div className="grid gap-10 tablet:grid-cols-2 desktop:grid-cols-4">
          {howItWorksSection.steps.map((step, index) => (
            <div
              key={index}
              className="grid gap-5 border-2 border-blue p-7 rounded-md"
            >
              <div className="flex gap-5 justify-between">
                <p className="text-heading text-blue">{index + 1}.</p>
                {step.title === "Share your car details" && (
                  <FileText className={iconStyles} color={iconColor} />
                )}
                {step.title === "We prepare your listing" && (
                  <CheckCircle className={iconStyles} color={iconColor} />
                )}
                {step.title === "Get your best offer" && (
                  <ThumbsUp className={iconStyles} color={iconColor} />
                )}
                {step.title === "Sell & get paid fast" && (
                  <DollarSign className={iconStyles} color={iconColor} />
                )}
              </div>
              <h3 className="font-bold leading-[100%] text-[26px] mb-2">
                {step.title}
              </h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksComponent;

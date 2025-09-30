import React from "react";
import termsData from "@/_data/terms-and-conditions.json";
import { PageWrapper } from "@/_lib/utils/page-wrapper";

interface ContentItem {
  type: "paragraph" | "list";
  text?: string;
  items?: string[];
}

interface Section {
  title: string;
  content: ContentItem[];
}

const TermsAndConditions = () => {
  const renderContent = (content: ContentItem[]) => {
    return content.map((item: ContentItem, index: number) => {
      switch (item.type) {
        case "paragraph":
          return <p key={index}>{item.text!}</p>;
        case "list":
          return (
            <ul key={index} className="list-disc pl-10 space-y-2">
              {item.items!.map((listItem: string, listIndex: number) => (
                <li key={listIndex} className="text-paragraph">
                  {listItem}
                </li>
              ))}
            </ul>
          );
        default:
          return null;
      }
    });
  };

  return (
    <PageWrapper useMainElement cssClasses="space-y-10">
      <h2 className="text-subheading full-hd:text-subheading-desktop">
        Website Terms and Conditions of Use
      </h2>

      {(termsData as Section[]).map((section: Section, index: number) => (
        <section key={index} className="space-y-5">
          <h2 className="text-paragraph-desktop font-bold">{section.title}</h2>
          {renderContent(section.content)}
        </section>
      ))}

      <p className="italic">
        Last updated:{" "}
        {new Date().toLocaleDateString("en-AU", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </PageWrapper>
  );
};

export default TermsAndConditions;

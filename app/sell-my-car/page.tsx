"use client";

import { PageWrapper } from "@/_lib/utils/page-wrapper";
import ButtonType from "@/_components/ui/buttons/button-type";
import {
  FormInputText,
  FormInputEmail,
  FormInputNumber,
  FormInputTel,
  FormInputSelect,
  FormInputFile,
} from "@/_components/ui/form";

const SellMyCarPage = () => {
  return (
    <PageWrapper useMainElement cssClasses="max-w-6xl mx-auto">
      <div className="space-y-7">
        <h2 className="text-subheading full-hd:text-subheading-desktop">
          Sell My Car
        </h2>

        <p className="text-[16px]">
          Please fill out your personal & vehicle details below, and our team
          reach out to you ASAP.
        </p>

        <form className="space-y-5">
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-10">
            <div className="space-y-5">
              <h3 className="text-blue font-bold text-paragraph-desktop">
                Personal
              </h3>
              <div className="space-y-5 desktop-small:space-y-3">
                <FormInputText
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  required
                  label="First Name"
                  labelClassName="visually-hidden"
                />

                <FormInputText
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  label="Last Name"
                  labelClassName="visually-hidden"
                />

                <FormInputTel
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Contact Number"
                  required
                  label="Contact Number"
                  labelClassName="visually-hidden"
                />

                <FormInputEmail
                  id="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  label="Email Address"
                  labelClassName="visually-hidden"
                />
              </div>
            </div>
            <div className="space-y-5">
              <h3 className="text-blue font-bold text-paragraph-desktop">
                Vehicle Information
              </h3>
              <div className="space-y-5 desktop-small:space-y-3">
                <FormInputText
                  id="vehicleMake"
                  name="vehicleMake"
                  placeholder="Vehicle Make"
                  required
                  label="Vehicle Make"
                  labelClassName="visually-hidden"
                />

                <FormInputText
                  id="vehicleModel"
                  name="vehicleModel"
                  placeholder="Vehicle Model"
                  required
                  label="Vehicle Model"
                  labelClassName="visually-hidden"
                />

                <FormInputNumber
                  id="vehicleYear"
                  name="vehicleYear"
                  placeholder="Vehicle Year"
                  required
                  label="Vehicle Year"
                  labelClassName="visually-hidden"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                />

                <FormInputSelect
                  id="fuelType"
                  name="fuelType"
                  options={[
                    { value: "diesel", label: "Diesel" },
                    { value: "petrol", label: "Petrol" },
                  ]}
                  required
                  placeholder="Select Fuel Type"
                  label="Fuel Type"
                  labelClassName="visually-hidden"
                />

                <FormInputSelect
                  id="transmission"
                  name="transmission"
                  options={[
                    { value: "manual", label: "Manual" },
                    { value: "automatic", label: "Automatic" },
                  ]}
                  required
                  placeholder="Select Transmission"
                  label="Transmission"
                  labelClassName="visually-hidden"
                />
              </div>
              <FormInputFile
                id="images"
                name="images"
                label="Vehicle Images"
                labelClassName="visually-hidden"
                description="Upload vehicle images (minimum 2)"
                multiple
                required
                accept="image/*"
              />
            </div>
          </div>
          <div className="flex justify-center mt-15 min-[600px]:justify-start">
            <ButtonType
              type="submit"
              cssClasses="w-full min-[600px]:w-auto desktop-small:px-10"
            >
              Submit Vehicle
            </ButtonType>
          </div>
        </form>
      </div>
    </PageWrapper>
  );
};

export default SellMyCarPage;

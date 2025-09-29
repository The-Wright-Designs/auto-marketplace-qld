import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import FormInputTel from "@/_components/ui/form/form-input-tel";
import ButtonType from "@/_components/ui/buttons/button-type";
import classNames from "classnames";

interface PersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
  };
  onInputChange: (name: string, value: string) => void;
  imageCount: number;
  error: string | null;
  isSubmitting?: boolean;
}

const PersonalInfoSection = ({
  formData,
  onInputChange,
  imageCount,
  error,
  isSubmitting,
}: PersonalInfoSectionProps) => {
  return (
    <div
      className={classNames("flex flex-col", {
        "gap-[42px]": imageCount < 2,
        "gap-18": imageCount > 2,
      })}
    >
      <div className="space-y-5">
        <h3 className="text-blue font-bold text-paragraph-desktop">Personal</h3>
        <div className="space-y-5 desktop-small:space-y-3">
          <FormInputText
            id="firstName"
            name="firstName"
            placeholder="First Name"
            required
            label="First Name"
            labelClassName="visually-hidden"
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
          />

          <FormInputText
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            required
            label="Last Name"
            labelClassName="visually-hidden"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
          />

          <FormInputTel
            id="contactNumber"
            name="contactNumber"
            placeholder="Contact Number"
            required
            label="Contact Number"
            labelClassName="visually-hidden"
            value={formData.contactNumber}
            onChange={(e) => onInputChange("contactNumber", e.target.value)}
          />

          <FormInputEmail
            id="email"
            name="email"
            placeholder="Email Address"
            required
            label="Email Address"
            labelClassName="visually-hidden"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-5">
        <div className="hidden tablet:flex flex-col gap-1">
          {imageCount < 2 && (
            <p className="text-[14px] text-red italic">
              Please upload at least 2 images
            </p>
          )}
          <ButtonType
            type="submit"
            disabled={imageCount < 2 || isSubmitting}
            title={imageCount < 2 ? "Please upload at least 2 images" : ""}
          >
            {isSubmitting ? "Submitting..." : "Submit Vehicle"}
          </ButtonType>
        </div>
        {error && (
          <div className="hidden bg-red/50 rounded-md p-3 tablet:block">
            <h4 className="text-paragraph font-semibold">Submission error:</h4>
            <p className="text-[16px]">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;

import FormInputText from "@/_components/ui/form/form-input-text";
import FormInputEmail from "@/_components/ui/form/form-input-email";
import FormInputTel from "@/_components/ui/form/form-input-tel";
import ButtonType from "@/_components/ui/buttons/button-type";

interface PersonalInfoSectionProps {
  imageCount: number;
  error: string | null;
}

const PersonalInfoSection = ({
  imageCount,
  error,
}: PersonalInfoSectionProps) => {
  return (
    <div className="flex flex-col justify-between">
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
        <div className="hidden tablet:flex flex-col gap-1">
          {imageCount < 2 && (
            <p className="text-[14px] text-red italic">
              Please upload at least 2 images
            </p>
          )}
          <ButtonType
            type="submit"
            disabled={imageCount < 2}
            title={imageCount < 2 ? "Please upload at least 2 images" : ""}
          >
            Submit Vehicle
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

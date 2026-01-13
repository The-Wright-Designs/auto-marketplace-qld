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
  rateLimitStatus?: {
    remaining: number;
    blocked: boolean;
    timeRemaining: string | null;
  } | null;
}

const PersonalInfoSection = ({
  formData,
  onInputChange,
  imageCount,
  error,
  isSubmitting,
  rateLimitStatus,
}: PersonalInfoSectionProps) => {
  return (
    <div
      className={classNames("flex flex-col", {
        "gap-[38px]": imageCount < 2,
        "gap-18": imageCount >= 2,
      })}
    >
      <div className="grid gap-5">
        <h3 className="text-blue font-bold text-paragraph-desktop">Personal</h3>
        <div className="grid gap-5 desktop-small:gap-3">
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
      <div className="grid gap-5">
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
            {isSubmitting ? (
              <span>
                Submitting
                <span className="inline-flex">
                  <span
                    className="inline-block transition-all duration-300"
                    style={{
                      animation: "growShrink 1.4s infinite",
                      animationDelay: "0s",
                    }}
                  >
                    .
                  </span>
                  <span
                    className="inline-block transition-all duration-300"
                    style={{
                      animation: "growShrink 1.4s infinite",
                      animationDelay: "0.2s",
                    }}
                  >
                    .
                  </span>
                  <span
                    className="inline-block transition-all duration-300"
                    style={{
                      animation: "growShrink 1.4s infinite",
                      animationDelay: "0.4s",
                    }}
                  >
                    .
                  </span>
                </span>
                <style jsx>{`
                  @keyframes growShrink {
                    0%,
                    100% {
                      transform: scale(0.8);
                      opacity: 0.3;
                    }
                    50% {
                      transform: scale(1.2);
                      opacity: 1;
                    }
                  }
                `}</style>
              </span>
            ) : (
              "Submit Vehicle"
            )}
          </ButtonType>
        </div>
        {error && (
          <div className="hidden bg-red/50 rounded-md p-3 tablet:block">
            <h4 className="text-paragraph font-semibold">Submission error:</h4>
            <p className="text-[16px]">{error}</p>
          </div>
        )}

        {/* Rate limit status for desktop - only show when blocked */}
        {rateLimitStatus && rateLimitStatus.blocked && (
          <div className="hidden bg-blue/10 rounded-md p-3 tablet:block">
            <p className="text-[14px] text-blue">
              Rate limit active. Please try again in{" "}
              {rateLimitStatus.timeRemaining}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;

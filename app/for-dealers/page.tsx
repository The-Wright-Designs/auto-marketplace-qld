import ButtonLink from "@/_components/ui/buttons/button-link";
import { PageWrapper } from "@/_lib/utils/page-wrapper";
import Image from "next/image";

const ForDealers = () => {
  return (
    <PageWrapper>
      <div className="grid items-start tablet:grid-cols-2 gap-10">
        <div className="grid gap-50px">
          <h2 className="text-subheading full-hd:text-subheading-desktop">
            For Dealers
          </h2>
          <p>
            Join Queensland&apos;s trusted vehicle marketplace where dealers can
            expand their inventory and accelerate sales with our secure, fast,
            and easy-to-use platform designed for professional automotive
            trading.
          </p>
          <div className="grid items-start gap-5 tablet:gap-10 tablet:grid-cols-2">
            <ButtonLink
              href="/for-dealers/register"
              ariaLabel="Register now for dealers"
              traditionalButton
            >
              Register now
            </ButtonLink>
            <ButtonLink
              href="/for-dealers/login"
              ariaLabel="Login for dealers"
              traditionalButton
              whiteButton
            >
              Login
            </ButtonLink>
          </div>
        </div>
        <div className="h-full">
          <Image
            src="/images/about/auto-marketplace-qld-3.jpg"
            alt="Dealership showcase"
            width={800}
            height={500}
            className="object-cover aspect-video w-full h-full"
          />
        </div>
      </div>
    </PageWrapper>
  );
};

export default ForDealers;

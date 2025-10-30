import { MobileGeneralFooter } from "./mobile/mobile-general-footer";
import { DesktopGeneralFooter } from "./desktop/desktop-general-footer";

export function GeneralFooter() {
  return (
    <footer className="bg-blue py-50px desktop:py-[64px] desktop-small:px-50px full-hd:px-120px">
      <div className="max-w-[1920px] mx-auto">
        <MobileGeneralFooter />
        <DesktopGeneralFooter />
      </div>
    </footer>
  );
}
import { MobileUserFooter } from "./mobile/mobile-user-footer";
import { DesktopUserFooter } from "./desktop/desktop-user-footer";

export function UserFooter() {
  return (
    <footer className="bg-blue py-50px desktop:py-[64px] desktop-small:px-50px full-hd:px-120px">
      <div className="max-w-[1920px] mx-auto">
        <MobileUserFooter />
        <DesktopUserFooter />
      </div>
    </footer>
  );
}
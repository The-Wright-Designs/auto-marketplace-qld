import { MobileFooter } from "./mobile/mobile-footer";
import { DesktopFooter } from "./desktop/desktop-footer";

export function Footer() {
  return (
    <footer className="bg-blue py-50px desktop:py-[64px] desktop-small:px-50px full-hd:px-120px">
      <div className="max-w-[1920px] mx-auto">
        <MobileFooter />
        <DesktopFooter />
      </div>
    </footer>
  );
}

export interface HeaderProps {
  isScrolled: boolean;
}

export interface showContactProps {
  buttonClasses?: string;
  linkClasses?: string;
}

export interface StrainProps {
  title: string;
  images: string[];
  description: string[];
  price: number;
  inStock: boolean;
  variety?: string;
  tac?: string;
  height?: string;
  yield?: string;
  floweringTime?: string;
  flavours?: string;
  medicinal?: string;
  supplier?: string;
}

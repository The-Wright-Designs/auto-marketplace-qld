import HeroComponent from "@/_components/home-page/hero-component";

export default function Home() {
  return (
    <div className="px-5 desktop-small:px-50px full-hd:px-120px">
      <div className="max-w-[1920px] mx-auto">
        <HeroComponent cssClasses="-mx-5 desktop-small:-mx-50px full-hd:-mx-120px" />
        <div className="py-50px">
          <h1>Heading</h1>
          <h3>Subheading</h3>
          <button>Button {">>>"}</button>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, aut
            beatae qui pariatur fuga at sapiente nisi tenetur, repudiandae
            dolorum cupiditate quos repellat praesentium? Enim cum quaerat
            architecto officiis nulla, minima, repellat iusto impedit sint
            reprehenderit maiores voluptatibus. Asperiores, provident laborum
            repellendus ipsa fugiat exercitationem reiciendis, impedit dolore
            ullam nihil, totam tenetur natus blanditiis nisi. Ducimus, harum
            sequi ratione itaque impedit doloribus aliquid eligendi at ad
            placeat temporibus earum exercitationem. Sint voluptatibus vitae
            voluptatem. Voluptates ratione fugiat earum. Inventore dolorum dicta
            maxime a iusto blanditiis rerum rem consequatur, doloribus harum
            dolorem ipsa repellendus quis? Minus unde consectetur nisi tempora
            dolor?
          </p>
        </div>
      </div>
    </div>
  );
}

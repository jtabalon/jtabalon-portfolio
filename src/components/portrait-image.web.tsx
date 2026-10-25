export function PortraitImage() {
  return (
    <img
      src="/portraits/joseph-tabalon-640.webp"
      srcSet="/portraits/joseph-tabalon-320.webp 320w, /portraits/joseph-tabalon-640.webp 640w, /portraits/joseph-tabalon-960.webp 960w"
      sizes="(min-width: 768px) 280px, 148px"
      alt="Portrait of Joseph Tabalon"
      width={1024}
      height={1024}
      className="h-[148px] w-[148px] md:h-[330px] md:w-[280px] object-cover"
    />
  );
}

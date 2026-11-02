import { Reveal } from "@/components/motion/Reveal";

type Props = {
  index: string;
  kicker: string;
  title: string;
  subtitle: string;
};

export function SectionHeading({ index, kicker, title, subtitle }: Props) {
  return (
    <Reveal className="flex flex-col gap-3">
      <p className="font-mono text-sm text-lilac">
        <span className="text-muted">{index}.</span> {"// "}
        {kicker}
      </p>
      <h2 className="font-display text-4xl font-semibold sm:text-5xl">{title}</h2>
      <p className="max-w-2xl text-muted">{subtitle}</p>
    </Reveal>
  );
}

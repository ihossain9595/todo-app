import { Button } from "@/components/ui/button";

type HeaderSectionProps = {
  title: string;
  buttonLabel: string;
  onButtonClick: () => void;
};

const SectionHeader = ({ title, buttonLabel, onButtonClick }: HeaderSectionProps) => {
  return (
    <div className="flex gap-4 items-center justify-between">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button size={"lg"} className="cursor-pointer" onClick={onButtonClick}>
        {buttonLabel}
      </Button>
    </div>
  );
};

export default SectionHeader;

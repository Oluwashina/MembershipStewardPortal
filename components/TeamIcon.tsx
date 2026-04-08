import {
  Music,
  Speaker,
  Shield,
  Camera,
  Heart,
  SmilePlus,
  Megaphone,
  ShieldCheck,
  AtSign,
  HelpCircle,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Music,
  Speaker,
  Shield,
  Camera,
  Heart,
  SmilePlus,
  Megaphone,
  ShieldCheck,
  AtSign,
};

export default function TeamIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] || HelpCircle;
  return <Icon className={className} />;
}

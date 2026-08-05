import { Icon, Root } from "./styles";

export type SparkleIconProps = {
  className?: string;
};

export default function SparkleIcon({ className }: SparkleIconProps) {
  return (
    <Root className={className} aria-hidden="true">
      <Icon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 1.2 13.55 9.2 21.8 12 13.55 14.8 12 22.8 10.45 14.8 2.2 12 10.45 9.2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
      </Icon>
    </Root>
  );
}

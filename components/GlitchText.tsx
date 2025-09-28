import { FC, CSSProperties } from "react";

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
  color?: string;
}

interface CustomCSSProperties extends CSSProperties {
  "--glitch-duration": string;
  "--glitch-delay": string;
}

const GlitchText: FC<GlitchTextProps> = ({
  children,
  speed = 0.5,
  enableOnHover = false,
  className = "",
  color = "text-black",
}) => {
  const inlineStyles: CustomCSSProperties = {
    "--glitch-duration": `${speed * 2}s`,
    "--glitch-delay": `${speed * 0.5}s`,
  };

  const baseClasses = `${color} relative inline-block font-black select-none cursor-pointer`;

  const glitchClasses = enableOnHover
    ? `hover:animate-glitch hover:before:content-[attr(data-text)] hover:before:absolute hover:before:top-0 hover:before:left-0 hover:before:text-red-500 hover:before:animate-glitch-red hover:before:z-[-1] hover:before:pointer-events-none hover:after:content-[attr(data-text)] hover:after:absolute hover:after:top-0 hover:after:left-0 hover:after:text-cyan-500 hover:after:animate-glitch-cyan hover:after:z-[-1] hover:after:pointer-events-none`
    : `animate-glitch before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:text-red-500 before:animate-glitch-red before:z-[-1] before:pointer-events-none after:content-[attr(data-text)] after:absolute after:top-0 after:left-0 after:text-cyan-500 after:animate-glitch-cyan after:z-[-1] after:pointer-events-none`;

  const combinedClasses = `${baseClasses} ${glitchClasses} ${className}`;

  return (
    <span style={inlineStyles} data-text={children} className={combinedClasses}>
      {children}
    </span>
  );
};

export default GlitchText;

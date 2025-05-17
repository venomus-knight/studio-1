import Image from 'next/image';

interface IndianEmblemProps {
  width?: number;
  height?: number;
  alt?: string;
}

export function IndianEmblem({ width = 50, height = 50, alt = "Emblem of India" }: IndianEmblemProps) {
  return (
    <Image
      src="/images/Emblem-of-India-01.svg"
      alt={alt}
      width={width}
      height={height}
    />
  );
}
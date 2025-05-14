import { JSX } from 'react';

type Props = {
  img: string;
  alt?: string;
}

export function Avatar({ alt, img }: Props): JSX.Element {
  return (
    <div className="rounded-full overflow-hidden w-full relative pt-[100%]">
      <div className="absolute inset-0">
        <img src={img} alt={alt || img} />
      </div>
    </div>
  );
}

import React, { useState } from 'react';

interface BookThumbnailProps {
  src?: string;
  title: string;
  category?: string;
  className?: string;
}

export const BookThumbnail: React.FC<BookThumbnailProps> = ({
  src,
  title,
  category,
  className = 'w-16 h-22 object-cover rounded-lg shadow-xs border border-[#E6D8C5] shrink-0',
}) => {
  const [error, setError] = useState(false);

  if (!error && src) {
    return (
      <img
        src={src}
        alt={title}
        onError={() => setError(true)}
        className={className}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={`${className} flex flex-col justify-between p-2 text-white bg-gradient-to-br from-[#4D251F] via-[#6B352A] to-[#2B211D] overflow-hidden relative border border-[#E6D8C5]`}
      title={title}
    >
      <div className="w-1.5 absolute top-0 bottom-0 left-0 bg-white/10 border-r border-white/20" />
      <div className="pl-1.5">
        {category && (
          <span className="text-[8px] uppercase font-bold tracking-wider text-[#FFF1A6] block line-clamp-1">
            {category}
          </span>
        )}
        <span className="font-editorial font-bold text-[9px] leading-tight line-clamp-2 text-white block">
          {title}
        </span>
      </div>
      <div className="pl-1.5 text-[7px] text-[#E6D8C5] font-sans uppercase tracking-widest font-semibold">
        Book
      </div>
    </div>
  );
};

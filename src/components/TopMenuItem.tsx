import React from "react";
import Link from "next/link";

interface TopMenuItemProps {
  title: string;
  pageRef: string;
  styles: string;
  onMouseOver?: (e: React.SyntheticEvent) => void;
  onMouseOut?: (e: React.SyntheticEvent) => void;
  onClick?: () => void;
}

const TopMenuItem: React.FC<TopMenuItemProps> = ({
  title,
  pageRef,
  styles,
  onMouseOver,
  onMouseOut,
  onClick,
}) => {
  return (
    <div
      className={`font-medium text-lg ${styles}`}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick} 
    >
      <Link href={pageRef}>{title}</Link>
    </div>
  );
};

export default TopMenuItem;

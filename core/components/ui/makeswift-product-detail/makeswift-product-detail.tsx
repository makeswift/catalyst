import { ReactNode } from 'react';

type Props = {
  className?: string;
  show?: boolean;
  content: ReactNode;
};

const MakeswiftProductDetail = ({ className, content, show = false }: Props) => {
  // TODO: Conditionally render based on show prop. This is to avoid rendering an empty box on live pages.
  // if (!show) return;

  return <div className={className}>{content}</div>;
};

export { MakeswiftProductDetail };

interface UIHeader {
  className?: string;
  text: string | number;
}
export const UIHeader: React.FC<UIHeader> = ({ className, text }) => {
  return (
    <h2
      className={
        className ? className : (
          'font-semibold mb-2 py-2 px-10 text-white bg-purple-800 rounded-md inline-block text-center'
        )
      }
    >
      {text}
    </h2>
  );
};

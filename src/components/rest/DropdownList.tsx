interface DropdownListProps {
  showDropdown: boolean;
  dropdownPosition: { top: number; left: number };
  options: { key: string }[];
  onSelect: (key: string) => void;
}

export default function DropdownList({ showDropdown, dropdownPosition, options, onSelect }: DropdownListProps) {
  if (!showDropdown) return null;

  return (
    <ul
      className="fixed z-10 bg-white border rounded shadow-md max-h-60 overflow-auto"
      style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
    >
      {options.map(({ key }) => (
        <li
          key={key}
          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(key);
          }}
        >
          {key}
        </li>
      ))}
    </ul>
  );
}

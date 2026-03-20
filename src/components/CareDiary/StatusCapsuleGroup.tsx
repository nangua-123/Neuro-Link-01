import React from 'react';

interface StatusCapsuleGroupProps {
  options: { value: string; label: string; color?: string; bg?: string }[];
  value: string | string[];
  onChange: (val: any) => void;
  multiple?: boolean;
}

export const StatusCapsuleGroup: React.FC<StatusCapsuleGroupProps> = ({
  options,
  value,
  onChange,
  multiple = false
}) => {
  const isSelected = (val: string) => {
    if (multiple) {
      return (value as string[]).includes(val);
    }
    return value === val;
  };

  const handleSelect = (val: string) => {
    if (multiple) {
      const current = value as string[];
      if (current.includes(val)) {
        onChange(current.filter(v => v !== val));
      } else {
        onChange([...current, val]);
      }
    } else {
      onChange(val);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const selected = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${selected 
                ? `${opt.bg || 'bg-blue-50'} ${opt.color || 'text-blue-600'} shadow-[0_0_12px_rgba(37,99,235,0.15)] ring-1 ring-blue-100` 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }
            `}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

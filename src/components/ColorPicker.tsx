
import React from 'react';
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  showTextInput?: boolean;
}

const ColorPicker = ({ label, value, onChange, showTextInput = false }: ColorPickerProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">{label}</label>
      {showTextInput ? (
        <div className="flex gap-2">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-16 h-10"
          />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1"
          />
        </div>
      ) : (
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 p-1"
        />
      )}
    </div>
  );
};

export default ColorPicker;

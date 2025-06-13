
import React from 'react';
import ColorPicker from './ColorPicker';

interface StickyNoteColorGridProps {
  colors: string[];
  onColorChange: (index: number, color: string) => void;
}

const StickyNoteColorGrid = ({ colors, onColorChange }: StickyNoteColorGridProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Sticky Note Colors</label>
      <div className="grid grid-cols-5 gap-2">
        {colors.map((color, index) => (
          <ColorPicker
            key={index}
            label=""
            value={color}
            onChange={(newColor) => onColorChange(index, newColor)}
          />
        ))}
      </div>
    </div>
  );
};

export default StickyNoteColorGrid;

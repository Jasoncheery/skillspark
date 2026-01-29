import { InputHTMLAttributes, useState } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = ({ 
  value = [0], 
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
  ...props 
}: SliderProps) => {
  const [internalValue, setInternalValue] = useState(value[0] || min);
  
  const currentValue = value[0] !== undefined ? value[0] : internalValue;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);
    if (onValueChange) {
      onValueChange([newValue]);
    }
  };
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((currentValue - min) / (max - min)) * 100}%, #E5E7EB ${((currentValue - min) / (max - min)) * 100}%, #E5E7EB 100%)`
        }}
        {...props}
      />
    </div>
  );
};

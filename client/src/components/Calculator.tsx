import React, { useState } from 'react';
import { SECRET_CODE } from '../constants';

interface CalculatorProps {
  onUnlock: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onUnlock }) => {
  const [display, setDisplay] = useState('0');
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [isResult, setIsResult] = useState(false);
  const [error, setError] = useState(false);

  const handleInput = (value: string) => {
    setError(false);
    if (display.length > 12 && !isOperator(value) && value !== '=') return;

    if (isDigit(value)) {
      if (isResult || display === '0') {
        setDisplay(value);
        setIsResult(false);
      } else {
        setDisplay(display + value);
      }
    } else if (isOperator(value)) {
      if (currentValue !== null && operator && !isResult) {
        calculate();
      } else {
        setCurrentValue(parseFloat(display));
      }
      setOperator(value);
      setIsResult(true);
    } else if (value === '.') {
      if (!display.includes('.')) {
        setDisplay(display + '.');
        setIsResult(false);
      }
    } else if (value === 'C') {
      setDisplay('0');
      setCurrentValue(null);
      setOperator(null);
      setIsResult(false);
    } else if (value === '=') {
      if (display === SECRET_CODE) {
        onUnlock();
        return;
      }
      calculate();
    }
  };

  const isDigit = (v: string) => !isNaN(parseInt(v));
  const isOperator = (v: string) => ['/', '*', '-', '+'].includes(v);

  const calculate = () => {
    if (operator && currentValue !== null) {
      const secondValue = parseFloat(display);
      let result;
      switch (operator) {
        case '+': result = currentValue + secondValue; break;
        case '-': result = currentValue - secondValue; break;
        case '*': result = currentValue * secondValue; break;
        case '/':
          if (secondValue === 0) {
            setError(true);
            setDisplay('ERROR');
            setCurrentValue(null);
            setOperator(null);
            setIsResult(true);
            return;
          }
          result = currentValue / secondValue;
          break;
        default: return;
      }
      const finalResult = parseFloat(result.toPrecision(10));
      setDisplay(String(finalResult));
      setCurrentValue(finalResult);
      setOperator(null);
      setIsResult(true);
    }
  };

  const buttons = [
    'C', '', '', '/',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '' , '='
  ];
  
  const getButtonClass = (btn: string) => {
    if (isOperator(btn)) return 'bg-[#1A1A1A] text-[#A1A7B2] text-3xl';
    if (btn === '=') return 'bg-[#A1A7B2] text-black text-3xl col-span-2 shadow-[0_0_20px_rgba(161,167,178,0.3)]';
    if (btn === 'C') return 'bg-[#1A1A1A] text-[#FF3B30] text-2xl col-span-3';
    if (btn === '0') return 'col-span-2';
    if (btn === '') return 'pointer-events-none';
    return 'bg-[#0A0A0A]';
  };

  return (
    <div className="h-full w-full bg-black flex flex-col justify-end p-4 font-mono">
      <div className="flex-1 flex items-end justify-end p-8">
        <h1 className={`text-7xl font-light text-right transition-colors ${error ? 'text-red-500' : 'text-white'}`} style={{ transform: `scale(${Math.min(1, 20 / display.length)})`, transformOrigin: 'right' }}>
          {display}
        </h1>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => handleInput(btn)}
            className={`h-20 rounded-2xl text-2xl font-bold transition-all active:brightness-125 focus:outline-none focus:ring-2 focus:ring-[#A1A7B2]/50 ${getButtonClass(btn)}`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
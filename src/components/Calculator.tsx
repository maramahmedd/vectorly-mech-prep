import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = display;
    
    if (previousValue !== null && operation !== null && !newNumber) {
      calculate();
    } else {
      setPreviousValue(currentValue);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = () => {
    if (previousValue === null || operation === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = prev + current;
        break;
      case '-':
        result = prev - current;
        break;
      case '×':
        result = prev * current;
        break;
      case '÷':
        result = prev / current;
        break;
      default:
        return;
    }

    setDisplay(result.toString());
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const buttonClass = "h-12 text-lg";
  const operationClass = "h-12 text-lg bg-blue-500 hover:bg-blue-600 text-white";

  return (
    <Card className="p-4 w-full max-w-xs" role="region" aria-label="Calculator">
      <div className="mb-4 p-3 bg-gray-100 rounded text-right" role="status" aria-live="polite">
        <div className="text-sm text-gray-500 h-6" aria-label="Previous calculation">
          {previousValue && operation ? `${previousValue} ${operation}` : ''}
        </div>
        <div className="text-2xl break-all" aria-label="Calculator display">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-2" role="grid" aria-label="Calculator buttons">
        <Button variant="outline" className={buttonClass} onClick={handleClear} aria-label="Clear all">
          AC
        </Button>
        <Button variant="outline" className={buttonClass} onClick={handleBackspace} aria-label="Backspace">
          ←
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleOperation('÷')} aria-label="Divide">
          ÷
        </Button>
        <Button className={operationClass} onClick={() => handleOperation('×')} aria-label="Multiply">
          ×
        </Button>

        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('7')}>
          7
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('8')}>
          8
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('9')}>
          9
        </Button>
        <Button className={operationClass} onClick={() => handleOperation('-')} aria-label="Subtract">
          −
        </Button>

        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('4')} aria-label="4">
          4
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('5')} aria-label="5">
          5
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('6')} aria-label="6">
          6
        </Button>
        <Button className={operationClass} onClick={() => handleOperation('+')} aria-label="Add">
          +
        </Button>

        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('1')}>
          1
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('2')}>
          2
        </Button>
        <Button variant="outline" className={buttonClass} onClick={() => handleNumber('3')}>
          3
        </Button>
        <Button
          className="row-span-2 h-full bg-green-500 hover:bg-green-600 text-white text-lg"
          onClick={calculate}
          aria-label="Calculate result"
        >
          =
        </Button>

        <Button
          variant="outline"
          className="col-span-2 h-12 text-lg"
          onClick={() => handleNumber('0')}
          aria-label="0"
        >
          0
        </Button>
        <Button variant="outline" className={buttonClass} onClick={handleDecimal} aria-label="Decimal point">
          .
        </Button>
      </div>
    </Card>
  );
}

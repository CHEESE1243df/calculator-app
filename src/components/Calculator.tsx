import React, { useState } from 'react';
import styled from 'styled-components';

const CalculatorContainer = styled.div`
  width: 400px;
  background: #1a472a;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #c41e3a;
  position: relative;
  overflow: hidden;

  &::before {
    content: '🎄';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 40px;
  }
`;

const Display = styled.div`
  background: #f8f8f8;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  text-align: right;
  font-size: 2em;
  font-family: monospace;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 60px;
  word-wrap: break-word;
  border: 2px solid #c41e3a;
  color: #1a472a;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
`;

const Button = styled.button<{ span?: number }>`
  padding: 15px;
  font-size: 1.2em;
  border: none;
  border-radius: 5px;
  background: #f8f8f8;
  cursor: pointer;
  transition: all 0.2s;
  grid-column: span ${props => props.span || 1};
  color: #1a472a;
  border: 1px solid #c41e3a;

  &:hover {
    background: #e0e0e0;
    transform: translateY(-2px);
  }

  &:active {
    background: #d0d0d0;
    transform: translateY(0);
  }
`;

const OperatorButton = styled(Button)`
  background: #c41e3a;
  color: white;

  &:hover {
    background: #a01830;
  }

  &:active {
    background: #8b1528;
  }
`;

const ScientificButton = styled(Button)`
  background: #2d5a27;
  color: white;
  border: 1px solid #c41e3a;

  &:hover {
    background: #1a472a;
  }

  &:active {
    background: #0f2d1a;
  }
`;

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState<number>(0);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (operator === '+') {
      return firstOperand! + inputValue;
    } else if (operator === '-') {
      return firstOperand! - inputValue;
    } else if (operator === '*') {
      return firstOperand! * inputValue;
    } else if (operator === '/') {
      return firstOperand! / inputValue;
    } else if (operator === '^') {
      return Math.pow(firstOperand!, inputValue);
    }

    return inputValue;
  };

  const handleScientificFunction = (func: string) => {
    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(inputValue * (Math.PI / 180));
        break;
      case 'cos':
        result = Math.cos(inputValue * (Math.PI / 180));
        break;
      case 'tan':
        result = Math.tan(inputValue * (Math.PI / 180));
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'pi':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
  };

  const handleMemory = (action: string) => {
    const currentValue = parseFloat(display);
    
    switch (action) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'M+':
        setMemory(memory + currentValue);
        break;
      case 'M-':
        setMemory(memory - currentValue);
        break;
    }
  };

  const handleEquals = () => {
    if (!operator || firstOperand === null) return;

    const result = performCalculation();
    setDisplay(String(result));
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <CalculatorContainer>
      <Display>{display}</Display>
      <ButtonGrid>
        <ScientificButton onClick={() => handleMemory('MC')}>MC</ScientificButton>
        <ScientificButton onClick={() => handleMemory('MR')}>MR</ScientificButton>
        <ScientificButton onClick={() => handleMemory('M+')}>M+</ScientificButton>
        <ScientificButton onClick={() => handleMemory('M-')}>M-</ScientificButton>
        <ScientificButton onClick={clearDisplay}>C</ScientificButton>

        <ScientificButton onClick={() => handleScientificFunction('sin')}>sin</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('cos')}>cos</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('tan')}>tan</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('log')}>log</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('ln')}>ln</ScientificButton>

        <ScientificButton onClick={() => handleScientificFunction('sqrt')}>√</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('square')}>x²</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('pi')}>π</ScientificButton>
        <ScientificButton onClick={() => handleScientificFunction('e')}>e</ScientificButton>
        <ScientificButton onClick={() => setDisplay(String(-parseFloat(display)))}>±</ScientificButton>

        <Button onClick={() => inputDigit('7')}>7</Button>
        <Button onClick={() => inputDigit('8')}>8</Button>
        <Button onClick={() => inputDigit('9')}>9</Button>
        <OperatorButton onClick={() => handleOperator('/')}>÷</OperatorButton>
        <OperatorButton onClick={() => handleOperator('^')}>x^y</OperatorButton>

        <Button onClick={() => inputDigit('4')}>4</Button>
        <Button onClick={() => inputDigit('5')}>5</Button>
        <Button onClick={() => inputDigit('6')}>6</Button>
        <OperatorButton onClick={() => handleOperator('*')}>×</OperatorButton>
        <Button onClick={() => setDisplay(String(parseFloat(display) / 100))}>%</Button>

        <Button onClick={() => inputDigit('1')}>1</Button>
        <Button onClick={() => inputDigit('2')}>2</Button>
        <Button onClick={() => inputDigit('3')}>3</Button>
        <OperatorButton onClick={() => handleOperator('-')}>−</OperatorButton>
        <Button onClick={() => setDisplay(String(1 / parseFloat(display)))}>1/x</Button>

        <Button span={2} onClick={() => inputDigit('0')}>0</Button>
        <Button onClick={inputDecimal}>.</Button>
        <OperatorButton onClick={() => handleOperator('+')}>+</OperatorButton>
        <OperatorButton onClick={handleEquals}>=</OperatorButton>
      </ButtonGrid>
    </CalculatorContainer>
  );
};

export default Calculator; 
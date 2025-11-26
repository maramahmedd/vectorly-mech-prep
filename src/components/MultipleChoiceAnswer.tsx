import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MultipleChoiceOption } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface MultipleChoiceAnswerProps {
  options: MultipleChoiceOption[];
  selectedAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
  correctAnswer?: string;
}

export function MultipleChoiceAnswer({
  options,
  selectedAnswer,
  onAnswerChange,
  disabled = false,
  showFeedback = false,
  correctAnswer
}: MultipleChoiceAnswerProps) {
  const getOptionClassName = (optionKey: string) => {
    if (!showFeedback) return '';

    if (optionKey === correctAnswer) {
      return 'border-green-500 bg-green-50';
    }

    if (optionKey === selectedAnswer && optionKey !== correctAnswer) {
      return 'border-red-500 bg-red-50';
    }

    return '';
  };

  const getOptionIcon = (optionKey: string) => {
    if (!showFeedback) return null;

    if (optionKey === correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (optionKey === selectedAnswer && optionKey !== correctAnswer) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  return (
    <RadioGroup value={selectedAnswer} onValueChange={onAnswerChange} disabled={disabled}>
      <div className="space-y-3">
        {options.map((option) => (
          <Card
            key={option.key}
            className={`p-4 cursor-pointer hover:shadow-md transition-all ${getOptionClassName(option.key)}`}
          >
            <div className="flex items-start gap-3">
              <RadioGroupItem value={option.key} id={`option-${option.key}`} />
              <Label
                htmlFor={`option-${option.key}`}
                className="flex-1 cursor-pointer"
              >
                <span className="font-semibold mr-2">{option.key}.</span>
                {option.text}
              </Label>
              {getOptionIcon(option.key)}
            </div>
          </Card>
        ))}
      </div>
    </RadioGroup>
  );
}

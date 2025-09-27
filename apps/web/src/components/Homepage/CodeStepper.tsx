import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BrowserWrapper } from "./browser-wrapper";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SyntaxHighlight } from "../syntax-highlight";
import { cn } from "@/lib/utils";

export type CodeStepperStep = {
  id: string;
  comment: string;
  code: string;
  browser: (handleStepClick: (index: number) => void) => React.ReactNode;
};
export const CodeStepper = ({ steps }: { steps: CodeStepperStep[] }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleStepClick = (index: number) => {
    if (index === activeStep) return;

    setActiveStep(index);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex flex-wrap gap-px rounded-xl bg-slate-800 p-2 md:min-h-[600px] md:flex-nowrap">
      <div className="mb-4 w-full max-w-full space-y-px overflow-x-auto font-mono text-sm md:pr-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              `cursor-pointer rounded-lg p-4 opacity-50 transition-opacity duration-300 hover:bg-slate-700/50`,
              { "bg-slate-700/50 opacity-100": index === activeStep }
            )}
            onClick={() => handleStepClick(index)}
          >
            <div className="mb-3 text-slate-400">{`// ` + step.comment}</div>
            <pre className="whitespace-pre-wrap text-white md:whitespace-pre-line">
              <SyntaxHighlight
                code={step.code}
                language="tsx"
              ></SyntaxHighlight>
            </pre>
          </div>
        ))}
      </div>
      <div className="min-h-[400px] w-full min-w-80 overflow-hidden md:max-h-full md:max-w-[500px]">
        <BrowserWrapper>
          <motion.div
            key={isLoading ? "loading" : activeStep}
            className="p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <div className="flex h-full w-full items-center justify-center py-8">
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              steps[activeStep]?.browser(handleStepClick)
            )}
          </motion.div>
        </BrowserWrapper>
      </div>
    </div>
  );
};

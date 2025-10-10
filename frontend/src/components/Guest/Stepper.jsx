import React, { useState, Children, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = (newStep) => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      updateStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (!isLastStep) {
      setDirection(1);
      updateStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    setDirection(1);
    updateStep(totalSteps + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100, scale: 0.85, y: 20 }}
    whileInView={{ opacity: 1, x: 0,scale: 1,y: 0 }}
    transition={{ duration: 0.5 }}
      className="flex min-h-full flex-1 flex-col items-center justify-center p-4"
      {...rest}
    >
      <div
        className="mx-auto w-full max-w-lg rounded-2xl bg-slate-800/80 backdrop-blur-sm p-6 md:p-10 border border-slate-700 shadow-2xl shadow-teal-500/10 transition-all duration-500 ease-in-out [transform-style:preserve-3d] hover:[transform:rotateY(10deg)_rotateX(5deg)] text-white"
      >
        <div className="flex w-full items-center mb-8">
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                  step={stepNumber}
                  currentStep={currentStep}
                  onClickStep={(clicked) => {
                    setDirection(clicked > currentStep ? 1 : -1);
                    updateStep(clicked);
                  }}
                />
                {isNotLastStep && (
                  <StepConnector isComplete={currentStep > stepNumber} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className="space-y-4"
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className="mt-10 flex justify-between items-center text-sm">
            {currentStep !== 1 && (
              <button
                onClick={handleBack}
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                {backButtonText}
              </button>
            )}
            <button
              onClick={isLastStep ? handleComplete : handleNext}
              className="ml-auto flex items-center justify-center rounded-full bg-teal-500 py-2 px-6 font-semibold tracking-tight text-white transition-all hover:bg-teal-400"
            >
              {isLastStep ? 'Complete' : nextButtonText}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0);

  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition
            key={currentStep}
            direction={direction}
            onHeightReady={(h) => setParentHeight(h)}
          >
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: (dir) => ({
    x: dir >= 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? '-50%' : '50%',
    opacity: 0,
  }),
};

export function Step({ children, title, description, icon }) {
  return (
    <div className="text-left py-4">
      {icon && <div className="text-3xl sm:text-4xl text-teal-400 mb-4 animate-fade-in-up">{icon}</div>}
      {title && (
        <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-sky-500 animate-fade-in-up">
          {title}
        </h3>
      )}
      {description && <p className="text-slate-400 text-sm md:text-base animate-fade-in-up">{description}</p>}
      {children}
    </div>
  );
}

function StepIndicator({ step, currentStep, onClickStep }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';

  const handleClick = () => {
    if (step !== currentStep) onClickStep(step);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="relative cursor-pointer outline-none focus:outline-none flex-1 flex flex-col items-center"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: '#334155', color: '#64748b' },
          active: { scale: 1, backgroundColor: '#5EEAD4', color: '#060010' },
          complete: { scale: 1, backgroundColor: '#5EEAD4', color: '#060010' },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-10 w-10 items-center justify-center rounded-full font-semibold"
      >
        {status === 'complete' ? (
          <CheckIcon className="h-6 w-6 text-slate-900" />
        ) : status === 'active' ? (
          <div className="h-4 w-4 rounded-full bg-slate-900" />
        ) : (
          <span className="text-lg">{step}</span>
        )}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  const lineVariants = {
    incomplete: { width: 0, backgroundColor: '#334155' },
    complete: { width: '100%', backgroundColor: '#5EEAD4' },
  };

  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded bg-slate-700">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={lineVariants}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: 'tween', ease: 'easeOut', duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
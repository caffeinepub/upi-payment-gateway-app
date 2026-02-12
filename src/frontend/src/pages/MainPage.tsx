import { useState } from 'react';
import UPIAppSelector from '../components/UPIAppSelector';
import UTRSubmissionForm from '../components/UTRSubmissionForm';

type Step = 'select-app' | 'submit-utr';

export default function MainPage() {
  const [currentStep, setCurrentStep] = useState<Step>('select-app');

  if (currentStep === 'submit-utr') {
    return <UTRSubmissionForm onBack={() => setCurrentStep('select-app')} />;
  }

  return <UPIAppSelector onNext={() => setCurrentStep('submit-utr')} />;
}

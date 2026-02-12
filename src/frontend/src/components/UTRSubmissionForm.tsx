import { useState } from 'react';
import { useSubmitUTR } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Heart, Info } from 'lucide-react';
import { toast } from 'sonner';

interface UTRSubmissionFormProps {
  onBack: () => void;
}

export default function UTRSubmissionForm({ onBack }: UTRSubmissionFormProps) {
  const [utr, setUtr] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submitUTR = useSubmitUTR();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!utr.trim()) {
      toast.error('Please enter your UTR number');
      return;
    }

    if (utr.trim().length < 8) {
      toast.error('UTR number must be at least 8 characters');
      return;
    }

    try {
      await submitUTR.mutateAsync(utr.trim());
      setSubmitted(true);
      toast.success('UTR submitted successfully!');
    } catch (error: any) {
      console.error('UTR submission error:', error);
      toast.error(error.message || 'Failed to submit UTR. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-success/10 via-success/5 to-success/10 flex flex-col">
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-2xl">
            <div className="bg-card border-2 border-success/30 rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-success flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-success-foreground" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-success mb-4">
                Payment Confirmed!
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your transaction reference has been submitted successfully.
              </p>
              <div className="p-6 bg-success/10 rounded-2xl border-2 border-success/20 mb-8">
                <p className="text-sm text-muted-foreground mb-2 font-medium">Transaction Reference</p>
                <p className="text-2xl font-bold text-success break-all">{utr}</p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                className="gradient-premium h-14 px-10 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
              >
                Make Another Payment
              </Button>
            </div>
          </div>
        </main>

        <footer className="py-6 text-center text-sm text-muted-foreground border-t">
          <p className="flex items-center justify-center gap-1">
            © 2025. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-primary/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to UPI Apps
          </Button>

          <div className="bg-card border-2 border-border rounded-3xl shadow-2xl p-6 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold gradient-premium-text mb-3">
                Submit UTR Number
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Enter your transaction reference to complete the process
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="utr" className="text-lg font-bold">
                  UTR / Transaction ID
                </Label>
                <Input
                  id="utr"
                  placeholder="Enter 12-digit UTR number"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  className="h-14 text-lg border-2 focus:border-primary"
                  autoFocus
                />
              </div>

              <div className="bg-muted/50 rounded-2xl p-5 border-2 border-muted">
                <div className="flex gap-3 mb-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <h4 className="font-bold text-base">How to find your UTR:</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 ml-8 list-decimal">
                  <li>Open your UPI app (Google Pay, PhonePe, etc.)</li>
                  <li>Go to transaction history or recent payments</li>
                  <li>Select the payment you just made</li>
                  <li>Look for "UTR", "Transaction ID", or "Reference Number"</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full gradient-premium h-14 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                disabled={submitUTR.isPending}
              >
                {submitUTR.isPending ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit UTR'
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        <p className="flex items-center justify-center gap-1">
          © 2025. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium hover:text-primary transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

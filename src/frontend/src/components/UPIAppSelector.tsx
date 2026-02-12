import { useGetAvailableUPIApps, useGetUPIId } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { ExternalLink, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface UPIAppSelectorProps {
  onNext: () => void;
}

const appLogos: Record<string, string> = {
  'Google Pay': '/assets/generated/google-pay-icon.dim_64x64.png',
  'PhonePe': '/assets/generated/phonepe-icon.dim_64x64.png',
  'Paytm': '/assets/generated/paytm-icon.dim_64x64.png',
  'BHIM': '/assets/generated/bhim-icon.dim_64x64.png',
  'Amazon Pay': '/assets/generated/amazon-pay-icon.dim_64x64.png',
};

const appColors: Record<string, string> = {
  'Google Pay': 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
  'PhonePe': 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
  'Paytm': 'hover:bg-cyan-50 dark:hover:bg-cyan-950/20',
  'BHIM': 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
  'Amazon Pay': 'hover:bg-yellow-50 dark:hover:bg-yellow-950/20',
};

export default function UPIAppSelector({ onNext }: UPIAppSelectorProps) {
  const { data: upiApps, isLoading } = useGetAvailableUPIApps();
  const { data: upiId } = useGetUPIId();

  const handleAppSelect = (appName: string) => {
    if (!upiId) {
      toast.error('UPI ID not available');
      return;
    }

    // Generate UPI deep link
    const upiLink = `upi://pay?pa=${upiId}&pn=UPI%20Gateway&cu=INR`;
    
    // Try to open the UPI app
    window.location.href = upiLink;
    
    // Show success message and move to next step
    toast.success(`Opening ${appName}...`);
    setTimeout(() => {
      onNext();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-premium-text mb-4">
              UPI Payment Gateway
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6">
              Select your preferred UPI app to pay
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary/10 rounded-full border-2 border-primary/20">
              <span className="text-sm font-medium text-muted-foreground">Pay to:</span>
              <span className="text-xl font-bold text-primary">{upiId || 'Loading...'}</span>
            </div>
          </div>

          {/* UPI Apps Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="inline-block w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p>Loading payment options...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-8">
              {upiApps?.map((app) => (
                <button
                  key={app}
                  onClick={() => handleAppSelect(app)}
                  className={`group relative overflow-hidden rounded-2xl border-3 border-border transition-all p-6 sm:p-8 bg-card shadow-lg hover:shadow-2xl hover:scale-105 hover:border-primary/50 ${appColors[app] || ''}`}
                >
                  <div className="flex flex-col items-center gap-3 sm:gap-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white shadow-md">
                      <img 
                        src={appLogos[app]} 
                        alt={app}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-base sm:text-lg mb-1">{app}</p>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <span>Pay Now</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-card border-2 border-border rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-3 text-center">How it works</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-2 text-lg">
                  1
                </div>
                <p className="text-sm font-medium">Select UPI App</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-2 text-lg">
                  2
                </div>
                <p className="text-sm font-medium">Complete Payment</p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center mx-auto mb-2 text-lg">
                  3
                </div>
                <p className="text-sm font-medium">Submit UTR</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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

"use client";

import { useState, FormEvent, useRef, useEffect } from 'react'; // useEffect hinzugefügt
import PublicNavbar from '@/components/PublicNavbar';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // useSearchParams hinzugefügt

// Entferne Stripe Elements spezifische Imports, wenn nicht mehr direkt genutzt
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Plan-Definition
const plans = [
  {
    id: "free",
    name: "Free Tier",
    price: "$0",
    frequency: "/ month",
    features: [
      "1 AI Agent",
      "100 Tasks/month",
      "Basic AI Models",
      "Basic Analytics",
      "Community Support",
    ],
    buttonText: "Select Free Plan",
    stripePriceId: null, // Kein Stripe Preis für kostenlosen Plan
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$49",
    frequency: "/ month",
    features: [
      "10 AI Agents",
      "5,000 Tasks/month",
      "Advanced AI Models",
      "Advanced Analytics",
      "Priority Email Support",
      "API Access",
    ],
    buttonText: "Select Pro Plan",
    featured: true,
    stripePriceId: "price_1Ra8hOIgMlIzBuZNLLjAlT6T", // ERSETZE DAS DURCH DEINE ECHTE STRIPE PRICE ID
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    frequency: "",
    features: [
      "Unlimited AI Agents",
      "Unlimited Tasks",
      "Custom AI Models & Fine-tuning",
      "Custom Analytics & Reporting",
      "Dedicated Support Manager",
    ],
    buttonText: "Contact Us for Enterprise",
    stripePriceId: null, // Enterprise wird manuell gehandhabt
  },
];

// PaymentForm Komponente wird nicht mehr benötigt und kann entfernt werden.

export default function CreateOrganisationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orgName, setOrgName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState(''); // Zustand für Promo-Code hinzugefügt
  // selectedPaymentMethod wird nicht mehr für Stripe Checkout benötigt
  // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null); 

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const isSubmittingRef = useRef(false); 
  const router = useRouter();
  const searchParams = useSearchParams(); // Für das Auslesen von Query-Parametern

  // Effekt zum Behandeln von Weiterleitungen von Stripe (Abbruch)
  useEffect(() => {
    const stripeCheckoutCancelled = searchParams.get('stripe_checkout_cancelled');
    if (stripeCheckoutCancelled === 'true') {
      setError("Payment process was cancelled. Please select a plan to try again.");
      // Optional: Zu einem bestimmten Schritt zurückkehren, z.B. Planauswahl
      // setCurrentStep(3); 
    }
  }, [searchParams]);

  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPrevStep = () => setCurrentStep(prev => prev - 1);

  const handlePlanSelected = async (planId: string) => {
    setSelectedPlanId(planId);
    setError(null); 
    setSuccessMessage(null);

    const planDetails = plans.find(p => p.id === planId);
    if (!planDetails) {
      setError("Invalid plan selected.");
      return;
    }

    if (planId === "free") {
      // Übergib die planId direkt, um nicht auf das State-Update warten zu müssen
      await handleCreateOrganisationSubmit(undefined, undefined, planId); 
    } else if (planId === "enterprise") {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/enterprise-lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            organisation_name: orgName,
            contact_email: email,
            phone: phone || undefined,
            address: address || undefined,
            website: website || undefined,
            // notes: "Submitted from create-organisation page" // Optional: Feste Notiz hinzufügen
          }),
        });
        const data = await response.json();

        if (response.ok && data && data.status === "success") {
          setSuccessMessage("Thank you for your interest in the Enterprise plan. We have received your details and will contact you shortly to finalize your setup.");
          setCurrentStep(5); 
        } else {
          setError(data.message || "Failed to submit your interest for the Enterprise plan. Please try again or contact us directly.");
        }
      } catch (err) {
        console.error("Enterprise lead submission error:", err);
        setError("An unexpected error occurred while submitting your interest. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else if (planDetails.stripePriceId) { // Kostenpflichtiger Plan mit Stripe Price ID
      setIsLoading(true);
      try {
        // Temporäre Speicherung der Formulardaten, da sie nach der Weiterleitung zu Stripe verloren gehen
        // und auf der Erfolgsseite für die Organisationserstellung benötigt werden.
        localStorage.setItem('pendingOrganisationData', JSON.stringify({
          orgName, email, phone, address, website, planId, promoCode // promoCode hinzugefügt
        }));

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/stripe/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan_id: planDetails.stripePriceId,
            success_url: `${window.location.origin}/create-organisation/payment-success`,
            cancel_url: `${window.location.origin}/create-organisation?stripe_checkout_cancelled=true`,
            organisation_name: orgName,
            user_email: email,
            promo_code: promoCode || undefined, // promoCode an API senden
          }),
        });

        const data = await response.json();

        if (response.ok && data.checkout_url) {
          router.push(data.checkout_url); // Weiterleitung zur Stripe Checkout-Seite
        } else {
          setError(data.detail || "Failed to create Stripe Checkout session. Please try again.");
          setIsLoading(false);
          localStorage.removeItem('pendingOrganisationData'); // Aufräumen bei Fehler
        }
      } catch (err) {
        console.error("Stripe Checkout session creation error:", err);
        setError("An unexpected error occurred while initiating payment. Please try again.");
        setIsLoading(false);
        localStorage.removeItem('pendingOrganisationData'); // Aufräumen bei Fehler
      }
    } else {
      setError("This plan is not configured for payment. Please contact support.");
    }
  };

  const handleCreateOrganisationSubmit = async (
    paymentMethodIdOrStripeSessionId?: string, 
    event?: FormEvent,
    planIdFromSelection?: string // Neuer optionaler Parameter
  ) => {
    const callTimestamp = Date.now();
    
    // Prüfe und setze den Ref-Guard als allererste Aktion
    if (isSubmittingRef.current) { 
      console.log(`[${callTimestamp}] handleCreateOrganisationSubmit: Submission already in progress (checked at entry), bailing out.`);
      if (event && typeof event.preventDefault === 'function') {
        event.preventDefault();
      }
      return;
    }
    isSubmittingRef.current = true; // Setze den Guard sofort
    console.log(`[${callTimestamp}] handleCreateOrganisationSubmit called. Set isSubmittingRef.current to true.`);

    if (event && typeof event.preventDefault === 'function') {
      console.log(`[${callTimestamp}] Event received, calling event.preventDefault()`);
      event.preventDefault(); 
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Verwende planIdFromSelection, falls vorhanden, sonst den State
    const currentPlanId = planIdFromSelection || selectedPlanId;

    if (!orgName.trim() || !email.trim()) {
      setError("Organisation name and email are required.");
      setCurrentStep(1); 
      setIsLoading(false);
      isSubmittingRef.current = false; 
      console.log(`[${callTimestamp}] Validation failed (orgName/email), reset isSubmittingRef.current to false.`);
      return;
    }
    // Validiere mit currentPlanId
    if (!currentPlanId) {
        setError("Plan selection is required.");
        setCurrentStep(3); 
        setIsLoading(false);
        isSubmittingRef.current = false; 
        console.log(`[${callTimestamp}] Validation failed (currentPlanId), reset isSubmittingRef.current to false.`);
        return;
    }
    
    const paymentMethodToUse = paymentMethodIdOrStripeSessionId; // Für Free-Plan ist dies undefined

    // Für "free" und "enterprise" ist keine paymentMethod erforderlich.
    // Diese Prüfung ist hier für den Free-Plan nicht mehr so relevant, da paymentMethodToUse undefined sein wird.
    // Die Hauptlogik für bezahlte Pläne wird auf der /payment-success Seite sein.
    // Validiere mit currentPlanId
    if (currentPlanId !== "enterprise" && currentPlanId !== "free" && !paymentMethodToUse) {
        setError("Payment method processing failed or was not selected.");
        // setCurrentStep(4); // Schritt 4 ist jetzt anders
        setIsLoading(false);
        isSubmittingRef.current = false; 
        console.log(`[${callTimestamp}] Validation failed (paymentMethodToUse for paid plan), reset isSubmittingRef.current to false.`);
        return;
    }
    
    const organisationData = {
        name: orgName,
        email,
        phone: phone || undefined,
        address: address || undefined,
        website: website || undefined,
        plan: currentPlanId, // Verwende currentPlanId
        // Für Free-Plan ist payment_method: undefined. Das Backend sollte das handhaben.
        // Für bezahlte Pläne wird die Stripe Session ID hier von der payment-success Seite übergeben.
        payment_method: paymentMethodToUse, 
    };
    console.log(`[${callTimestamp}] Proceeding with API call for org: ${organisationData.name}, plan: ${currentPlanId}`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/create/organisation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(organisationData),
      });
      const data = await response.json();
      console.log(`[${callTimestamp}] API response received in frontend:`, data);
      console.log(`[${callTimestamp}] response.ok: ${response.ok}`);
      if (data && typeof data.status === 'string') {
        console.log(`[${callTimestamp}] data.status: '${data.status}' (length: ${data.status.length}), comparison with 'success': ${data.status === "success"}`);
      } else {
        console.log(`[${callTimestamp}] data.status is not a string or data is null/undefined:`, data ? data.status : data);
      }

      if (response.ok && data && data.status === "success") {
        setSuccessMessage(`Organisation \"${orgName}\" with ${plans.find(p=>p.id === currentPlanId)?.name || 'selected plan'} created successfully! You can now log in.`);
        setCurrentStep(5); 
        setError(null);
        // Verwende currentPlanId für die Weiterleitung
        if (currentPlanId === "free") {
          router.push('/login');
        }
      } else {
        let detailedError = "Failed to create organisation. Please try again.";
        if (!response.ok) {
          detailedError = `API request failed with status: ${response.status}.`;
          try {
            const errorText = await response.text();
            detailedError += ` Response: ${errorText}`;
          } catch (e) {
            detailedError += ` Could not parse error response text.`;
          }
          console.error(`[${callTimestamp}] API Response not OK. Status: ${response.status}, Response text: ${await response.text().catch(() => 'failed to get text')}`);
        } else if (!data) {
          detailedError = "API response was OK, but no data was received after parsing JSON.";
          console.error(`[${callTimestamp}] Data is null/undefined after response.json().`);
        } else if (data.status !== "success") {
          detailedError = `API response was OK, but status was '${data.status}'. Expected 'success'.`;
          console.error(`[${callTimestamp}] Data status was '${data.status}', expected 'success'. Full data:`, data);
        } else {
            // Fallback, sollte nicht erreicht werden, wenn die obigen Bedingungen alle Fälle abdecken
            console.error(`[${callTimestamp}] Unknown reason for failure. response.ok: ${response.ok}, data:`, data);
        }
        // Bevorzugt die Nachricht vom Backend, falls vorhanden und aussagekräftig, sonst den detaillierten Fehler
        setError((data && data.message && data.status !== "success") ? data.message : detailedError);
      }
    } catch (err) {
      console.error(`[${callTimestamp}] Create organisation error:`, err);
      setError("An unexpected error occurred. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false; 
      console.log(`[${callTimestamp}] Finally block, reset isSubmittingRef.current to false.`);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="orgName" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                Organisation Name
              </label>
              <input
                type="text"
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                style={inputStyle}
                placeholder="Your Company Inc."
              />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                Your Email (Owner)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" style={buttonStyle}>
              {'Next: Organisation Details'}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={(e) => { e.preventDefault(); goToNextStep(); }}>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="phone" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                Phone Number (Optional)
              </label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} placeholder="+1 (555) 123-4567" />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="address" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                Address (Optional)
              </label>
              <textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} style={{...inputStyle, minHeight: "80px"}} placeholder="123 Main St, Anytown, USA" />
            </div>
            <div style={{ marginBottom: "2rem" }}>
              <label htmlFor="website" style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                Website (Optional)
              </label>
              <input type="text" id="website" value={website} onChange={(e) => setWebsite(e.target.value)} style={inputStyle} placeholder="https://yourcompany.com" />
            </div>
            <div style={{display: "flex", justifyContent:"space-between", gap: "1rem"}}>
                <button type="button" onClick={goToPrevStep} style={{...buttonStyle, background: "var(--glass-border)", color: "var(--text-primary)"}}>
                    Back
                </button>
                <button type="submit" style={buttonStyle}>
                {'Next: Select Plan'}
                </button>
            </div>
          </form>
        );
      case 3:
        return (
          <div>
            <div style={{
                display: "flex", // Geändert von grid zu flex
                flexWrap: "nowrap", // Verhindert das Umbrechen der Elemente
                gap: "1.5rem",
                alignItems: "stretch",
                justifyContent: "center", 
                overflowX: "auto", // Ermöglicht horizontales Scrollen, falls nötig
            }}>
              {plans.map((plan) => (
                <div key={plan.id} className="pricing-card-select" style={{
                  minWidth: "280px", // Behält die Mindestbreite bei, erlaubt aber Schrumpfen, falls flex-shrink nicht 0 ist
                  flex: "1 0 280px", // Erlaubt Wachstum, kein Schrumpfen, Basisbreite 280px
                  // Die Breite der Karte wird nun durch gridTemplateColumns bestimmt (280px)
                  background: plan.featured ? "rgba(30, 35, 50, 0.8)" : "var(--card-bg)",
                  border: plan.featured ? "2px solid var(--primary-color)" : "1px solid var(--glass-border)",
                  borderRadius: "15px",
                  padding: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: plan.featured ? "0 0 20px rgba(114, 137, 254, 0.25)" : "0 4px 10px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  cursor: isLoading ? "default" : "pointer", // Cursor ändern bei isLoading
                  opacity: isLoading && selectedPlanId !== plan.id ? 0.7 : 1, // Andere Pläne ausgrauen
                }}
                onClick={() => !isLoading && handlePlanSelected(plan.id)} 
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(-5px)")}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: plan.featured ? "var(--primary-color)" : "var(--text-primary)" }}>
                      {plan.name}
                    </h3>
                    <div style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" }}>
                      {plan.price}
                      {plan.frequency && <span style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-secondary)" }}>{plan.frequency}</span>}
                    </div>
                    <ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0", fontSize: "0.9rem" }}>
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                          <i className="fas fa-check-circle" style={{ color: "var(--success-color)", marginRight: "0.5rem", fontSize: "0.8rem" }}></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={(e) => {
                        e.stopPropagation(); 
                        if (!isLoading) {
                            handlePlanSelected(plan.id);
                        }
                    }} 
                    disabled={isLoading} // Generell Button deaktivieren bei isLoading
                    style={{
                        ...buttonStyle,
                        background: plan.featured ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" : "rgba(255,255,255,0.1)",
                        color: plan.featured ? "#fff" : "var(--text-primary)",
                        border: plan.featured ? "none" : "1px solid var(--glass-border)",
                        marginTop: "1rem",
                        width: "100%" // Button füllt die Kartenbreite
                    }}
                  >
                    {isLoading && selectedPlanId === plan.id ? 'Processing...' : plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
            {/* Eingabefeld für Promo-Code wurde entfernt */}
            <button type="button" onClick={goToPrevStep} disabled={isLoading} style={{...buttonStyle, background: "var(--glass-border)", color: "var(--text-primary)", marginTop: "2rem", width: "auto", padding: "0.9rem 2rem"}}>
                Back to Details
            </button>
          </div>
        );
      case 4: // Schritt 4: Wird jetzt übersprungen oder zeigt Ladezustand an
        // Wenn handlePlanSelected direkt weiterleitet, wird dieser Schritt kaum sichtbar sein.
        // Man könnte hier eine explizite Bestätigung oder einen Ladebildschirm zeigen, falls gewünscht.
        if (isLoading) {
          return <p style={{textAlign: 'center', fontSize: '1.2rem', color: 'var(--text-secondary)'}}>Redirecting to payment gateway...</p>;
        }
        // Normalerweise sollte dieser Zustand nicht lange bestehen bleiben, wenn die Weiterleitung funktioniert.
        // Es könnte ein Fallback sein, falls etwas bei der Planauswahl schiefgeht, bevor die Weiterleitung initiiert wird.
        return (
            <div>
                <p style={{textAlign: 'center', marginBottom: '1rem'}}>Please select a plan to proceed to payment.</p>
                <button type="button" onClick={goToPrevStep} style={{...buttonStyle, background: "var(--glass-border)", color: "var(--text-primary)", marginTop: "1rem", width: "auto", padding: "0.9rem 2rem"}}>
                    Back to Plan Selection
                </button>
            </div>
        );
        case 5: // Success step
            return null; // Success message is handled outside this render function
      default:
        return <p>Something went wrong. Please refresh.</p>;
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    border: "1px solid var(--glass-border)",
    background: "rgba(255, 255, 255, 0.05)",
    color: "var(--text-primary)",
    fontSize: "1rem"
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.9rem 1.5rem",
    borderRadius: "100px",
    border: "none",
    background: "linear-gradient(135deg, var(--primary-color), var(--secondary-color))",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    cursor: "pointer",
    boxShadow: "var(--glow-primary)",
    opacity: 1,
    transition: "opacity 0.2s, background 0.2s",
  };

  return (
    <div>
      <PublicNavbar />
      <main style={{ 
        paddingTop: "120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "calc(100vh - 80px)",
        paddingBottom: "2rem"
      }}>
        <div className="container" style={{ maxWidth: currentStep === 3 ? "1020px" : "500px", width: "100%", transition: "max-width 0.3s ease-in-out" }}>
          <div className="glass-card" style={{
            padding: "2rem 2.5rem",
            borderRadius: "20px",
            background: "var(--card-bg)",
            border: "1px solid var(--glass-border)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)"
          }}>
            <h1 style={{ 
              textAlign: "center", 
              fontSize: "2rem", 
              fontWeight: 700, 
              marginBottom: "1rem" 
            }}>
              {currentStep === 1 && "Create New Organisation"}
              {currentStep === 2 && `Organisation: ${orgName}`}
              {currentStep === 3 && "Choose Your Plan"}
              {currentStep === 4 && `Finalize for: ${plans.find(p => p.id === selectedPlanId)?.name || 'Selected Plan'}`}
              {currentStep === 5 && "Setup Complete!"}
            </h1>
            <p style={{textAlign: "center", color: "var(--text-secondary)", marginBottom: "2rem"}}>
                {currentStep === 1 && "Step 1 of 4: Basic Information"}
                {currentStep === 2 && "Step 2 of 4: Additional Details (Optional)"}
                {currentStep === 3 && "Step 3 of 4: Select a Plan"}
                {currentStep === 4 && selectedPlanId !== 'enterprise' && "Step 4 of 4: Payment Method"}
                {/* Für Enterprise wird Schritt 4 übersprungen, daher keine explizite Anzeige */}
            </p>

            {error && (
              <div style={{ background: "rgba(255, 99, 99, 0.1)", border: "1px solid var(--danger-color)", color: "var(--danger-color)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.5rem", textAlign: "center" }}>
                {error}
              </div>
            )}
            {successMessage && currentStep === 5 && ( // Geändert zu currentStep === 5
              <div style={{ background: "rgba(36, 204, 146, 0.1)", border: "1px solid var(--success-color)", color: "var(--success-color)", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1.5rem", textAlign: "center" }}>
                {successMessage}
                 <Link href="/login" style={{ display: 'block', marginTop: '1rem', color: "var(--primary-color)", textDecoration: 'none', fontWeight: 500 }}>
                    Proceed to Login
                </Link>
              </div>
            )}

            {currentStep !== 5 && renderStepContent()} 
            
            {currentStep === 1 && (
                 <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)" }}>
                    Already have an organisation? <Link href="/login" style={{ color: "var(--primary-color)", textDecoration: "none", fontWeight: 500 }}>Sign In</Link>
                </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

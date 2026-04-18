import { useState } from "react";

type Address = {
  id: string;
  line1: string;
  city: string;
};

type Skip = {
  id?: string;
  size: string;
  price: number;
  disabled: boolean;
};

export default function App() {
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [manualSuccess, setManualSuccess] = useState("");

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [selectedWasteButton, setSelectedWasteButton] = useState("");
  const [selectedPlasterboardButton, setSelectedPlasterboardButton] =
    useState("");

  const [wasteType, setWasteType] = useState("");
  const [plasterboardOption, setPlasterboardOption] = useState("");

  const [skips, setSkips] = useState<Skip[]>([]);
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);

  const [manualLine1, setManualLine1] = useState("");
  const [manualCity, setManualCity] = useState("");

  const [bookingId, setBookingId] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [manualAddressesByPostcode, setManualAddressesByPostcode] = useState<
    Record<string, Address[]>
  >({});

  const primaryButtonStyle = (selected: boolean) => ({
    padding: "14px 20px",
    borderRadius: "10px",
    border: selected ? "2px solid #333" : "1px solid #ccc",
    background: selected ? "#d9d9d9" : "#f3f3f3",
    cursor: "pointer",
    minWidth: "160px",
    fontSize: "16px",
    transition: "all 0.15s ease",
  });

  const secondaryButtonStyle = {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #d0d7de",
    background: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    color: "#1f2937",
  };

  const inputRowStyle = {
    display: "flex",
    gap: "14px",
    marginBottom: "20px",
    alignItems: "center" as const,
    flexWrap: "wrap" as const,
  };

  const postcodeInputStyle = {
    flex: "1 1 320px",
    minWidth: "280px",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d6d6d6",
    background: "#fff",
    outline: "none",
    fontSize: "16px",
  };
  const isValidUkPostcode = (value: string) => {
    const postcode = value.trim().toUpperCase();
    return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/.test(postcode);
  };
  const lookupButtonStyle = {
    padding: "14px 20px",
    borderRadius: "10px",
    border: "1px solid #d0d7e2",
    background: "#f3f4f6",
    color: "#111827",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
    minWidth: "96px",
  };

  const reviewBoxStyle = {
    marginTop: "24px",
    padding: "18px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fafafa",
  };

  async function handleLookup() {
    const normalizedPostcode = postcode.trim().toUpperCase();

    setSubmitted(false);
    setError("");
    setManualSuccess("");

    // ✅ 1. Empty validation
    if (!normalizedPostcode) {
      setError("Please enter a postcode");
      setSubmitted(true);
      return;
    }

    // ✅ 2. Format validation
    const isValidUkPostcode = (value: string) => {
      return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/.test(value);
    };

    if (!isValidUkPostcode(normalizedPostcode)) {
      setError("Please enter a valid UK postcode");
      setSubmitted(true);
      return;
    }

    // ✅ 3. Reset + loading
    setLoading(true);
    setAddresses([]);
    setSelectedAddress(null);
    setBookingSuccess(false);
    setBookingId("");
    setSelectedSkip(null);
    setWasteType("");
    setPlasterboardOption("");
    setSelectedWasteButton("");
    setSelectedPlasterboardButton("");

    try {
      const res = await fetch("http://localhost:3001/api/postcode/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postcode: normalizedPostcode }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      const apiAddresses = data.addresses || [];
      const savedManual = manualAddressesByPostcode[normalizedPostcode] || [];

      setAddresses([...apiAddresses, ...savedManual]);
      setSubmitted(true);
    } catch {
      // ✅ sadece API hatası
      setError("Temporary server error. Please retry");
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  async function postWasteType(payload: {
    heavyWaste: boolean;
    plasterboard: boolean;
    plasterboardOption: string | null;
  }) {
    await fetch("http://localhost:3001/api/waste-types", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  }

  async function fetchSkips(postcodeValue: string, heavyWaste: boolean) {
    const pc = postcodeValue.replace(/\s+/g, "").toUpperCase();

    const res = await fetch(
      `http://localhost:3001/api/skips?postcode=${pc}&heavyWaste=${heavyWaste}`,
    );

    const data = await res.json();
    setSkips(data.skips || []);
  }

  async function handleConfirmBooking() {
    if (!selectedSkip || confirming || bookingSuccess) return;

    try {
      setConfirming(true);

      const heavyWaste = wasteType === "heavy";
      const plasterboard = wasteType === "plasterboard";

      const res = await fetch("http://localhost:3001/api/booking/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postcode: postcode.trim().toUpperCase(),
          addressId: selectedAddress?.id,
          heavyWaste,
          plasterboard,
          skipSize: selectedSkip.size,
          price: selectedSkip.price,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error();

      setBookingId(data.bookingId);
      setBookingSuccess(true);
    } catch {
      setError("Booking failed");
    } finally {
      setConfirming(false);
    }
  }

  const vat = selectedSkip ? Math.round(selectedSkip.price * 0.2) : 0;
  const total = selectedSkip ? selectedSkip.price + vat : 0;

  return (
    <div className="page">
      {/* STEP 1 */}
      {step === 1 && (
        <div className="card">
          <h1>REM Waste Booking Flow</h1>

          <div style={inputRowStyle}>
            <input
              style={postcodeInputStyle}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              placeholder="Enter postcode"
            />

            <button
              style={{
                ...lookupButtonStyle,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onClick={handleLookup}
              disabled={loading}
            >
              Lookup
            </button>
          </div>

          {loading && <p>Loading addresses...</p>}

          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                border: "1px solid #e0b0b0",
                background: "#fff5f5",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  color: "#c62828",
                  marginBottom: "10px",
                  fontWeight: 500,
                }}
              >
                {error}
              </p>

              {error === "Something went wrong" && (
                <button
                  onClick={handleLookup}
                  style={{
                    background: "#f3f3f3",
                    color: "#333",
                    border: "1px solid #ccc",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {manualSuccess && (
            <p style={{ color: "green", marginBottom: "16px" }}>
              {manualSuccess}
            </p>
          )}

          {submitted && !loading && !error && addresses.length === 0 && (
            <div style={{ marginBottom: "20px" }}>
              <p>No addresses found</p>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <input
                  placeholder="Address line 1"
                  value={manualLine1}
                  onChange={(e) => setManualLine1(e.target.value)}
                />
                <input
                  placeholder="City"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "12px" }}>
                <button
                  onClick={() => {
                    const pc = postcode.trim().toUpperCase();

                    const addr = {
                      id: `manual-${Date.now()}`,
                      line1: manualLine1,
                      city: manualCity,
                    };

                    setManualAddressesByPostcode((prev) => ({
                      ...prev,
                      [pc]: [...(prev[pc] || []), addr],
                    }));

                    setAddresses((prev) => [...prev, addr]);
                    setManualSuccess("Address added");
                    setManualLine1("");
                    setManualCity("");
                  }}
                  disabled={
                    manualLine1.trim().length < 3 ||
                    manualCity.trim().length < 2
                  }
                  style={{
                    opacity:
                      manualLine1.trim().length < 3 ||
                      manualCity.trim().length < 2
                        ? 0.5
                        : 1,
                  }}
                >
                  Add address
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: "16px" }}>
            {addresses.map((a) => (
              <div key={a.id} style={{ marginBottom: "10px" }}>
                <button
                  onClick={() => {
                    setSelectedAddress(a);
                    setSelectedSkip(null);
                    setWasteType("");
                    setPlasterboardOption("");
                    setBookingSuccess(false);
                    setBookingId("");
                    setSelectedWasteButton("");
                    setSelectedPlasterboardButton("");
                    setStep(2);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "12px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {a.line1}, {a.city}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="card">
          <h2 style={{ fontSize: "22px", marginTop: 0, marginBottom: "18px" }}>
            Select Waste Type
          </h2>

          <div
            style={{
              display: "flex",
              gap: "14px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <button
              style={primaryButtonStyle(selectedWasteButton === "General")}
              onClick={() => {
                setSelectedWasteButton("General");

                setTimeout(async () => {
                  setWasteType("general");
                  setPlasterboardOption("");
                  setSelectedPlasterboardButton("");
                  setSelectedSkip(null);
                  setBookingSuccess(false);

                  await postWasteType({
                    heavyWaste: false,
                    plasterboard: false,
                    plasterboardOption: null,
                  });

                  await fetchSkips(postcode, false);
                  setStep(3);
                }, 120);
              }}
            >
              General
            </button>

            <button
              style={primaryButtonStyle(selectedWasteButton === "Heavy")}
              onClick={() => {
                setSelectedWasteButton("Heavy");

                setTimeout(async () => {
                  setWasteType("heavy");
                  setPlasterboardOption("");
                  setSelectedPlasterboardButton("");
                  setSelectedSkip(null);
                  setBookingSuccess(false);

                  await postWasteType({
                    heavyWaste: true,
                    plasterboard: false,
                    plasterboardOption: null,
                  });

                  await fetchSkips(postcode, true);
                  setStep(3);
                }, 120);
              }}
            >
              Heavy
            </button>

            <button
              style={primaryButtonStyle(selectedWasteButton === "Plasterboard")}
              onClick={() => {
                setSelectedWasteButton("Plasterboard");
                setWasteType("plasterboard");
                setPlasterboardOption("");
                setSelectedPlasterboardButton("");
                setSelectedSkip(null);
                setBookingSuccess(false);
              }}
            >
              Plasterboard
            </button>
          </div>

          {wasteType === "plasterboard" && (
            <div style={{ marginTop: "22px" }}>
              <h4
                style={{ marginTop: 0, marginBottom: "14px", fontSize: "18px" }}
              >
                Select plasterboard handling option
              </h4>

              <div
                style={{
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap",
                  marginBottom: "14px",
                }}
              >
                <button
                  style={primaryButtonStyle(
                    selectedPlasterboardButton === "bagged",
                  )}
                  onClick={() => {
                    setPlasterboardOption("bagged");
                    setSelectedPlasterboardButton("bagged");
                  }}
                >
                  Bagged
                </button>
                <button
                  style={primaryButtonStyle(
                    selectedPlasterboardButton === "sheeted",
                  )}
                  onClick={() => {
                    setPlasterboardOption("sheeted");
                    setSelectedPlasterboardButton("sheeted");
                  }}
                >
                  Sheeted
                </button>
                <button
                  style={primaryButtonStyle(
                    selectedPlasterboardButton === "mixed",
                  )}
                  onClick={() => {
                    setPlasterboardOption("mixed");
                    setSelectedPlasterboardButton("mixed");
                  }}
                >
                  Mixed
                </button>
              </div>

              {plasterboardOption && (
                <div style={{ marginTop: "15px" }}>
                  <p>Selected option: {plasterboardOption}</p>

                  <button
                    style={primaryButtonStyle(false)}
                    onClick={async () => {
                      setSelectedSkip(null);
                      setBookingSuccess(false);

                      await postWasteType({
                        heavyWaste: false,
                        plasterboard: true,
                        plasterboardOption,
                      });

                      await fetchSkips(postcode, false);
                      setStep(3);
                    }}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <button
              style={secondaryButtonStyle}
              onClick={() => {
                setSelectedWasteButton("");
                setSelectedPlasterboardButton("");
                setStep(1);
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="card">
          <h2 style={{ fontSize: "22px", marginTop: 0, marginBottom: "16px" }}>
            Select Skip
          </h2>

          <div style={{ marginTop: "20px" }}>
            {skips.map((s) => {
              const isSelected = selectedSkip?.size === s.size;

              return (
                <div key={s.id || s.size} style={{ marginBottom: "10px" }}>
                  <button
                    disabled={s.disabled}
                    onClick={() => {
                      if (s.disabled) return;

                      setSelectedSkip(s);
                      setBookingSuccess(false);
                      setBookingId("");
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "16px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #333" : "1px solid #ccc",
                      background: isSelected ? "#e7e7e7" : "#fff",
                      opacity: s.disabled ? 0.4 : 1,
                      color: s.disabled ? "#666" : "#111",
                      cursor: s.disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {s.size} - £{s.price}
                    {s.disabled && " (not allowed)"}
                  </button>
                </div>
              );
            })}
          </div>

          {selectedSkip && (
            <div style={reviewBoxStyle}>
              <h3>Review</h3>
              <p>
                <b>Postcode:</b> {postcode.trim().toUpperCase()}
              </p>
              <p>
                <b>Address:</b> {selectedAddress?.line1},{" "}
                {selectedAddress?.city}
              </p>
              <p>
                <b>Waste type:</b> {wasteType}
              </p>
              {wasteType === "plasterboard" && (
                <p>
                  <b>Handling:</b> {plasterboardOption}
                </p>
              )}
              <p>
                <b>Skip:</b> {selectedSkip.size}
              </p>

              <h4>Price breakdown</h4>
              <p>
                <b>Base price:</b> £{selectedSkip.price}
              </p>
              <p>
                <b>VAT (20%):</b> £{vat}
              </p>
              <p>
                <b>Total:</b> £{total}
              </p>

              <button
                onClick={handleConfirmBooking}
                disabled={confirming || bookingSuccess}
                style={{
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  opacity: confirming ? 0.6 : 1,
                }}
              >
                {confirming
                  ? "Confirming..."
                  : bookingSuccess
                    ? "Booked"
                    : "Confirm Booking"}
              </button>
            </div>
          )}

          {bookingSuccess && (
            <div
              style={{
                marginTop: "20px",
                padding: "16px",
                border: "1px solid #c8e6c9",
                background: "#f1f8f4",
                borderRadius: "8px",
              }}
            >
              <h3 style={{ color: "#2e7d32", marginBottom: "8px" }}>
                Booking confirmed successfully
              </h3>

              <p style={{ color: "#2e7d32" }}>
                <b>ID:</b> {bookingId}
              </p>
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <button
              style={secondaryButtonStyle}
              onClick={() => {
                setBookingSuccess(false);
                setStep(2);
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

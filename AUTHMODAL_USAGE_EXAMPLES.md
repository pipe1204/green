# Auth Modal System - Usage Examples

This guide shows how to use the new Auth Modal System to gate features behind authentication.

## Quick Start

### 1. Import the hook and modal

```tsx
import { useAuthActions } from "@/hooks/useAuthCheck";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
```

### 2. Use in your component

```tsx
function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const {
    requireAuthForFavorite,
    requireAuthForTestDrive,
    authPrompt,
    closeAuthPrompt,
    handleAuthSuccess,
  } = useAuthActions();

  const handleFavoriteClick = async () => {
    // This will either execute immediately (if logged in) or show auth prompt
    requireAuthForFavorite(async () => {
      // Your actual favorite logic here
      await addToFavorites(vehicle.id);
      toast.success("Added to favorites!");
    });
  };

  const handleTestDriveClick = () => {
    requireAuthForTestDrive(() => {
      // Your test drive booking logic
      openTestDriveModal(vehicle);
    });
  };

  return (
    <>
      <div className="vehicle-card">
        {/* Favorite Button */}
        <button onClick={handleFavoriteClick}>
          <Heart />
        </button>

        {/* Test Drive Button */}
        <button onClick={handleTestDriveClick}>Book Test Drive</button>
      </div>

      {/* Auth Prompt Modal - Include once per component */}
      <AuthPromptModal
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        action={authPrompt.action}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
```

## Complete Example: Vehicle Detail Page

```tsx
"use client";

import { useState } from "react";
import { useAuthActions } from "@/hooks/useAuthCheck";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { Vehicle } from "@/types";
import { supabase } from "@/lib/supabase";
import { Heart, Calendar, MessageCircle, Bell } from "lucide-react";

export default function VehicleDetailPage({ vehicle }: { vehicle: Vehicle }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showTestDriveModal, setShowTestDriveModal] = useState(false);
  const [showPriceAlertModal, setShowPriceAlertModal] = useState(false);

  const {
    requireAuthForFavorite,
    requireAuthForTestDrive,
    requireAuthForMessage,
    requireAuthForPriceAlert,
    isAuthenticated,
    authPrompt,
    closeAuthPrompt,
    handleAuthSuccess,
  } = useAuthActions();

  // ========================================
  // Favorite Feature
  // ========================================
  const toggleFavorite = async () => {
    requireAuthForFavorite(async () => {
      try {
        if (isFavorite) {
          // Remove from favorites
          await supabase
            .from("customer_favorites")
            .delete()
            .eq("vehicle_id", vehicle.id);
          setIsFavorite(false);
        } else {
          // Add to favorites
          const { data: userData } = await supabase.auth.getUser();
          await supabase.from("customer_favorites").insert({
            customer_id: userData.user?.id,
            vehicle_id: vehicle.id,
          });
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    });
  };

  // ========================================
  // Test Drive Feature
  // ========================================
  const handleBookTestDrive = () => {
    requireAuthForTestDrive(() => {
      setShowTestDriveModal(true);
    });
  };

  // ========================================
  // Contact Vendor Feature
  // ========================================
  const handleContactVendor = () => {
    // Note: For messages, we allow guests but encourage auth
    if (isAuthenticated) {
      setShowContactForm(true);
    } else {
      requireAuthForMessage(() => {
        setShowContactForm(true);
      });
    }
  };

  // ========================================
  // Price Alert Feature
  // ========================================
  const handleSetPriceAlert = () => {
    requireAuthForPriceAlert(() => {
      setShowPriceAlertModal(true);
    });
  };

  return (
    <div className="vehicle-detail-page">
      <div className="actions">
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
        >
          <Heart className={isFavorite ? "fill-red-500 text-red-500" : ""} />
          {isFavorite ? "Saved" : "Save"}
        </button>

        {/* Test Drive Button */}
        <button onClick={handleBookTestDrive} className="test-drive-btn">
          <Calendar />
          Book Test Drive
        </button>

        {/* Contact Vendor Button */}
        <button onClick={handleContactVendor} className="contact-btn">
          <MessageCircle />
          Contact Vendor
        </button>

        {/* Price Alert Button */}
        <button onClick={handleSetPriceAlert} className="price-alert-btn">
          <Bell />
          Price Alert
        </button>
      </div>

      {/* Modals */}
      {showTestDriveModal && (
        <TestDriveModal
          isOpen={showTestDriveModal}
          onClose={() => setShowTestDriveModal(false)}
          vehicle={vehicle}
        />
      )}

      {showContactForm && (
        <ContactFormModal
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          vehicle={vehicle}
        />
      )}

      {showPriceAlertModal && (
        <PriceAlertModal
          isOpen={showPriceAlertModal}
          onClose={() => setShowPriceAlertModal(false)}
          vehicle={vehicle}
        />
      )}

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        action={authPrompt.action}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
```

## Simple Example: Favorite Button Component

```tsx
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useAuthActions } from "@/hooks/useAuthCheck";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";
import { supabase } from "@/lib/supabase";

interface FavoriteButtonProps {
  vehicleId: string;
}

export function FavoriteButton({ vehicleId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    requireAuthForFavorite,
    isAuthenticated,
    authPrompt,
    closeAuthPrompt,
    handleAuthSuccess,
    user,
  } = useAuthActions();

  // Check if vehicle is already favorited
  useEffect(() => {
    if (isAuthenticated) {
      checkIfFavorited();
    }
  }, [isAuthenticated, vehicleId]);

  const checkIfFavorited = async () => {
    const { data } = await supabase
      .from("customer_favorites")
      .select("id")
      .eq("customer_id", user?.id)
      .eq("vehicle_id", vehicleId)
      .single();

    setIsFavorite(!!data);
  };

  const handleClick = async () => {
    requireAuthForFavorite(async () => {
      setLoading(true);
      try {
        if (isFavorite) {
          await supabase
            .from("customer_favorites")
            .delete()
            .eq("customer_id", user?.id)
            .eq("vehicle_id", vehicleId);
          setIsFavorite(false);
        } else {
          await supabase.from("customer_favorites").insert({
            customer_id: user?.id,
            vehicle_id: vehicleId,
          });
          setIsFavorite(true);
        }
      } catch (error) {
        console.error("Error toggling favorite:", error);
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-5 h-5 ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      <AuthPromptModal
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        action={authPrompt.action}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
```

## API Reference

### useAuthActions Hook

```typescript
const {
  // Direct auth requirement functions
  requireAuthForFavorite,
  requireAuthForTestDrive,
  requireAuthForMessage,
  requireAuthForPriceAlert,
  requireAuthGeneral,

  // Auth state
  user,
  isAuthenticated,

  // Modal control
  authPrompt, // { isOpen: boolean, action: AuthAction, callback?: () => void }
  closeAuthPrompt,
  handleAuthSuccess,
} = useAuthActions();
```

### requireAuth Functions

All `requireAuth*` functions accept a callback and return a boolean:

- Returns `true` if user is authenticated (callback executed immediately)
- Returns `false` if user is not authenticated (shows auth prompt, callback queued)

```typescript
const wasExecuted = requireAuthForFavorite(() => {
  console.log("User is authenticated!");
});
```

### AuthPromptModal Props

```typescript
interface AuthPromptModalProps {
  isOpen: boolean; // Control modal visibility
  onClose: () => void; // Called when modal closes without auth
  action: AuthAction; // Type of action: 'favorite' | 'testDrive' | 'message' | 'priceAlert' | 'general'
  onAuthSuccess?: () => void; // Called after successful authentication
}
```

## Best Practices

1. **Include the modal once per component** - Don't create multiple `AuthPromptModal` instances
2. **Use specific action types** - Choose the right `requireAuth*` function for better UX
3. **Handle loading states** - Show loading indicators during async operations
4. **Provide feedback** - Use toasts/notifications after successful actions
5. **Check authentication on mount** - For features like favorites, check if user has already performed the action

## Action Types

Each action type shows a different prompt to the user:

- **`favorite`**: "Guarda tus favoritos" - For saving vehicles to favorites
- **`testDrive`**: "Agenda tu prueba de manejo" - For booking test drives
- **`message`**: "Contacta al vendedor" - For sending messages to vendors
- **`priceAlert`**: "Recibe alertas de precio" - For setting price alerts
- **`general`**: "Accede a tu cuenta" - Generic auth prompt

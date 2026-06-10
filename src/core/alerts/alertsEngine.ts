// src/core/alerts/alertsEngine.ts

export type AlertStatus = "pending" | "sent" | "delivered" | "acknowledged";

export interface ActiveAlert {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  createdAt: number;
  status: AlertStatus;
  lastKnownLocation?: {
    lat: number;
    lng: number;
    timestamp: number;
  };
}

let activeAlert: ActiveAlert | null = null;

/**
 * Create a new alert
 */
export function createAlert(sender: string, receiver: string, message: string): ActiveAlert {
  activeAlert = {
    id: crypto.randomUUID(),
    sender,
    receiver,
    message,
    createdAt: Date.now(),
    status: "pending",
  };

  return activeAlert;
}

/**
 * Mark alert as sent (after SMS API success)
 */
export function markAlertSent() {
  if (activeAlert) {
    activeAlert.status = "sent";
  }
}

/**
 * Mark alert as delivered (optional, if MessageMedia delivery receipts are added later)
 */
export function markAlertDelivered() {
  if (activeAlert) {
    activeAlert.status = "delivered";
  }
}

/**
 * Mark alert as acknowledged by receiver
 */
export function acknowledgeAlert() {
  if (activeAlert) {
    activeAlert.status = "acknowledged";
  }
}

/**
 * Update last known location
 */
export function updateLocation(lat: number, lng: number) {
  if (activeAlert) {
    activeAlert.lastKnownLocation = {
      lat,
      lng,
      timestamp: Date.now(),
    };
  }
}

/**
 * Get the current active alert
 */
export function getActiveAlert(): ActiveAlert | null {
  return activeAlert;
}
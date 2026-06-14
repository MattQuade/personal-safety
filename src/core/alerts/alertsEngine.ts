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

export function markAlertSent() {
  if (activeAlert) activeAlert.status = "sent";
}

export function markAlertDelivered() {
  if (activeAlert) activeAlert.status = "delivered";
}

export function acknowledgeAlert() {
  if (activeAlert) activeAlert.status = "acknowledged";
}

export function updateLocation(lat: number, lng: number) {
  if (activeAlert) {
    activeAlert.lastKnownLocation = {
      lat,
      lng,
      timestamp: Date.now(),
    };
  }
}

export function getActiveAlert(): ActiveAlert | null {
  return activeAlert;
}

export function clearActiveAlert() {
  activeAlert = null;
}
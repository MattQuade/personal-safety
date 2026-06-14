export type Alert = {
  id: string;
  type: string;
  message: string;
  timestamp: number;
  acknowledged: boolean;
};

let activeAlert: Alert | null = null;

// Create a new alert
export function createAlert(
  type: string,
  message: string,
  timestamp: number
): Alert {
  activeAlert = {
    id: Math.random().toString(36).slice(2),
    type,
    message,
    timestamp,
    acknowledged: false,
  };

  return activeAlert;
}

// Get the active alert
export function getActiveAlert(): Alert | null {
  return activeAlert;
}

// Acknowledge the alert
export function acknowledgeAlert(): void {
  if (activeAlert) {
    activeAlert.acknowledged = true;
  }
}

// Clear the alert
export function clearAlert(): void {
  activeAlert = null;
}
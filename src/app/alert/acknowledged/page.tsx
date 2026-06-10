// src/app/alert/acknowledged/page.tsx

export default function AcknowledgedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Alert Acknowledged
        </h1>
        <p className="text-gray-700">
          The receiver has confirmed they have seen your alert.
        </p>
      </div>
    </div>
  );
}
import ParcelStatusBadge from "./ParcelStatusBadge";

export default function ParcelDetails({ parcel }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Sender */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Sender Information</h2>

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {parcel.pickupContact?.name}
          </p>
          <p>
            <strong>Phone:</strong> {parcel.pickupContact?.phone}
          </p>
          <p>
            <strong>Address:</strong> {parcel.pickupLocation?.address}
          </p>
        </div>
      </div>

      {/* Receiver */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Receiver Information</h2>

        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {parcel.deliveryContact?.name}
          </p>
          <p>
            <strong>Phone:</strong> {parcel.deliveryContact?.phone}
          </p>
          <p>
            <strong>Address:</strong> {parcel.deliveryLocation?.address}
          </p>
        </div>
      </div>

      {/* Parcel */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Parcel Information</h2>

        <div className="space-y-2">
          <p>
            <strong>Tracking:</strong> {parcel.trackingNumber}
          </p>
          <p>
            <strong>Weight:</strong> {parcel.weight} kg
          </p>
          <p>
            <strong>Type:</strong> {parcel.parcelType}
          </p>
          <p>
            <strong>Price:</strong> Rs. {parcel.price}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <ParcelStatusBadge status={parcel.status} />
          </p>
        </div>
      </div>

      {/* Driver */}
      <div className="rounded-xl bg-white p-6 shadow">
        <h2 className="mb-4 text-xl font-bold">Driver</h2>

        {parcel.driver ? (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {parcel.driver.name}
            </p>
            <p>
              <strong>Phone:</strong> {parcel.driver.phone}
            </p>
            <p>
              <strong>Email:</strong> {parcel.driver.email}
            </p>
          </div>
        ) : (
          <p className="text-red-500">No Driver Assigned</p>
        )}
      </div>
    </div>
  );
}

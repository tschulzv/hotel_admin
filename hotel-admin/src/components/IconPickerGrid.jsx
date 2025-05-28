const materialIcons = [
  "wifi",
  "pool",
  "restaurant",
  "local_bar",
  "spa",
  "fitness_center",
  "local_parking",
  "room_service",
  "ac_unit",             // Aire acondicionado
  "tv",
  "cleaning_services",   // Servicio de limpieza
  "local_laundry_service",
  "pets",
  "smoke_free",
  "smoking_rooms",
  "elevator",
  "meeting_room",
  "bed",
  "bathtub",
  "kitchen",
  "breakfast_dining",
  "security",
  "credit_card",
  "key",
  "lock",
  "local_taxi",
  "directions_bus",
  "directions_car",
  "airport_shuttle",
  "checkroom",
  "check",
  "star",
  "favorite",
  "info",
  "help",
  "error",
  "warning",
  "home",
  "person",
  "people",
  "phone",
  "email",
  "language",
  "map",
  "location_on",
  "calendar_today",
  "event",
  "access_time",
  "edit",
  "delete",
  "add",
  "remove",
  "visibility",
  "visibility_off",
  "shopping_cart",
  "payment",
  "attach_money",
  "print",
  "photo_camera",
  "translate",           
];


export default function IconPickerGrid({ selected, onSelect }) {
  return (
    <div className="d-flex flex-wrap gap-2">
      {materialIcons.map((name) => (
        <div
          key={name}
          onClick={() => onSelect(name)}
          style={{
            cursor: 'pointer',
            padding: '12px',
            border: selected === name ? '2px solid #007bff' : 'none',
            borderRadius: '2px',
            width: '10px',
            height: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: selected === name ? '#e7f1ff' : '#fff',
          }}
        >
          <span className="material-icons">{name}</span>
        </div>
      ))}
    </div>
  );
}

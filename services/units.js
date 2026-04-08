export const MEASUREMENT_TYPES = {
  LengthUnit: {
    label: "Length",
    icon: "📏",
    units: ["FEET", "INCHES", "YARDS", "CENTIMETERS", "METERS", "KILOMETERS", "MILES"],
    unitLabels: {
      FEET: "ft", INCHES: "in", YARDS: "yd",
      CENTIMETERS: "cm", METERS: "m", KILOMETERS: "km", MILES: "mi"
    }
  },
  VolumeUnit: {
    label: "Volume",
    icon: "🧪",
    units: ["MILLILITER", "LITRE", "GALLON", "CUBIC_METER", "CUBIC_CENTIMETER"],
    unitLabels: {
      MILLILITER: "mL", LITRE: "L", GALLON: "gal",
      CUBIC_METER: "m³", CUBIC_CENTIMETER: "cm³"
    }
  },
  WeightUnit: {
    label: "Weight",
    icon: "⚖️",
    units: ["GRAM", "KILOGRAM", "MILLIGRAM", "POUND", "TONNE"],
    unitLabels: {
      GRAM: "g", KILOGRAM: "kg", MILLIGRAM: "mg", POUND: "lb", TONNE: "t"
    }
  },
  TemperatureUnit: {
    label: "Temperature",
    icon: "🌡️",
    units: ["CELSIUS", "FAHRENHEIT", "KELVIN"],
    unitLabels: {
      CELSIUS: "°C", FAHRENHEIT: "°F", KELVIN: "K"
    }
  }
};

export const OPERATIONS = [
  { id: "convert",  label: "Convert",   icon: "⇄" },
  { id: "compare",  label: "Compare",   icon: "=" },
  { id: "add",      label: "Add",       icon: "+" },
  { id: "subtract", label: "Subtract",  icon: "−" },
  { id: "divide",   label: "Divide",    icon: "÷" },
];

export function getUnitLabel(type, unit) {
  return MEASUREMENT_TYPES[type]?.unitLabels[unit] || unit;
}

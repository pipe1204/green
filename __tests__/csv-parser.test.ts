import { describe, it, expect } from "vitest";
import { parseVehicleCSV } from "@/lib/csv-parser";

describe("CSV Parser", () => {
  const validCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
Tesla Model 3,Tesla,carro,50000000,Bogotá,in-stock,400,8,75 kWh,years,8,200,300,Vehículo eléctrico de alta gama con autopilot,"GPS,Bluetooth,Autopilot,Pantalla táctil"
BMW i3,BMW,carro,45000000,Medellín,in-stock,300,6,42 kWh,years,5,150,170,Compacto urbano eléctrico,"Climatización,Bluetooth,Navegación"`;

  const invalidCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
Tesla Model 3,Tesla,invalid-type,50000000,Bogotá,in-stock,400,8,75 kWh,years,8,200,300,Test vehicle,
BMW i3,BMW,carro,45000000,Medellín,invalid-availability,300,6,42 kWh,years,5,150,170,Test vehicle,`;

  const emptyCSV = ``;

  const missingFieldsCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
Tesla Model 3,Tesla,carro,50000000,Bogotá,in-stock,400,8,75 kWh,years,8,200,300,Test vehicle,
,BMW,carro,45000000,Medellín,in-stock,300,6,42 kWh,years,5,150,170,Test vehicle,`;

  it("should parse valid CSV successfully", () => {
    const result = parseVehicleCSV(validCSV);

    expect(result.success).toBe(true);
    expect(result.vehicles).toHaveLength(2);
    expect(result.errors).toHaveLength(0);

    // Check first vehicle
    const firstVehicle = result.vehicles[0];
    expect(firstVehicle.name).toBe("Tesla Model 3");
    expect(firstVehicle.brand).toBe("Tesla");
    expect(firstVehicle.type).toBe("carro");
    expect(firstVehicle.price).toBe(50000000);
    expect(firstVehicle.location).toBe("Bogotá");
    expect(firstVehicle.availability).toBe("in-stock");
    expect(firstVehicle.specifications.range).toBe("400");
    expect(firstVehicle.specifications.chargeTime).toBe("8");
    expect(firstVehicle.specifications.battery).toBe("75 kWh");
    expect(firstVehicle.specifications.performance.maxSpeed).toBe("200");
    expect(firstVehicle.specifications.performance.power).toBe("300");
    expect(firstVehicle.specifications.warranty).toBe("8 years");
    expect(firstVehicle.description).toBe(
      "Vehículo eléctrico de alta gama con autopilot"
    );

    expect(firstVehicle.features).toEqual([
      "GPS",
      "Bluetooth",
      "Autopilot",
      "Pantalla táctil",
    ]);
  });

  it("should handle invalid field values", () => {
    const result = parseVehicleCSV(invalidCSV);

    expect(result.success).toBe(false);
    expect(result.vehicles).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);

    // Check for specific error messages
    const typeError = result.errors.find((e) => e.field === "type");
    expect(typeError).toBeDefined();
    expect(typeError?.message).toContain("Invalid type");

    const availabilityError = result.errors.find(
      (e) => e.field === "availability"
    );
    expect(availabilityError).toBeDefined();
    expect(availabilityError?.message).toContain("Invalid availability");
  });

  it("should handle empty CSV", () => {
    const result = parseVehicleCSV(emptyCSV);

    expect(result.success).toBe(false);
    expect(result.vehicles).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].message).toBe("CSV file is empty");
  });

  it("should handle missing required fields", () => {
    const result = parseVehicleCSV(missingFieldsCSV);

    expect(result.success).toBe(false);
    expect(result.vehicles).toHaveLength(1); // Only first vehicle should be parsed
    expect(result.errors.length).toBeGreaterThan(0);

    // Check for missing field error
    const missingFieldError = result.errors.find((e) => e.field === "name");
    expect(missingFieldError).toBeDefined();
    expect(missingFieldError?.message).toContain("Required field is empty");
  });

  it("should handle CSV with quoted fields", () => {
    const quotedCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
"Tesla Model 3","Tesla","carro","50000000","Bogotá","in-stock","400","8","75 kWh","years","8","200","300","Vehículo eléctrico, con comas","GPS,Bluetooth,Autopilot"`;

    const result = parseVehicleCSV(quotedCSV);

    expect(result.success).toBe(true);
    expect(result.vehicles).toHaveLength(1);
    expect(result.vehicles[0].name).toBe("Tesla Model 3");
    expect(result.vehicles[0].description).toBe(
      "Vehículo eléctrico, con comas"
    );
    expect(result.vehicles[0].features).toEqual([
      "GPS",
      "Bluetooth",
      "Autopilot",
    ]);
  });

  it("should validate numeric fields", () => {
    const invalidNumericCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
Tesla Model 3,Tesla,carro,invalid-price,Bogotá,in-stock,400,8,75 kWh,years,8,200,300,Test vehicle,`;

    const result = parseVehicleCSV(invalidNumericCSV);

    expect(result.success).toBe(false);
    expect(result.vehicles).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);

    const priceError = result.errors.find((e) => e.field === "price");
    expect(priceError).toBeDefined();
    expect(priceError?.message).toContain("Invalid number");
  });

  it("should handle negative values with warnings", () => {
    const negativeValueCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
Tesla Model 3,Tesla,carro,50000000,Bogotá,in-stock,-100,8,75 kWh,years,8,200,300,Test vehicle,`;

    const result = parseVehicleCSV(negativeValueCSV);

    expect(result.success).toBe(true);
    expect(result.vehicles).toHaveLength(1);
    expect(result.warnings.length).toBeGreaterThan(0);

    const rangeWarning = result.warnings.find((w) => w.field === "range");
    expect(rangeWarning).toBeDefined();
    expect(rangeWarning?.message).toContain("Negative value");
  });

  it("should validate warranty units", () => {
    const invalidWarrantyCSV = `name,brand,type,price,location,availability,range,chargeTime,battery,warrantyUnit,warrantyValue,maxSpeed,power,description,features
Tesla Model 3,Tesla,carro,50000000,Bogotá,in-stock,400,8,75 kWh,invalid-unit,8,200,300,Test vehicle,`;

    const result = parseVehicleCSV(invalidWarrantyCSV);

    expect(result.success).toBe(false);
    expect(result.vehicles).toHaveLength(0);
    expect(result.errors.length).toBeGreaterThan(0);

    const warrantyError = result.errors.find((e) => e.field === "warrantyUnit");
    expect(warrantyError).toBeDefined();
    expect(warrantyError?.message).toContain("Invalid warranty unit");
  });
});

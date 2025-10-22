import { Vehicle } from "@/types";

export interface CSVParseResult {
  success: boolean;
  vehicles: Vehicle[];
  errors: CSVParseError[];
  warnings: CSVParseWarning[];
}

export interface CSVParseError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface CSVParseWarning {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface CSVRow {
  [key: string]: string;
}

// Spanish column names mapping
const SPANISH_TO_ENGLISH_MAP: { [key: string]: string } = {
  nombre: "name",
  marca: "brand",
  tipo: "type",
  precio: "price",
  ubicacion: "location",
  disponibilidad: "availability",
  autonomia: "range",
  tiempo_carga: "chargeTime",
  bateria: "battery",
  unidad_garantia: "warrantyUnit",
  valor_garantia: "warrantyValue",
  velocidad_maxima: "maxSpeed",
  potencia: "power",
  descripcion: "description",
  caracteristicas: "features",
};

// Required fields for vehicle creation (Spanish names)
const REQUIRED_FIELDS = [
  "nombre",
  "marca",
  "tipo",
  "precio",
  "ubicacion",
  "disponibilidad",
  "autonomia",
  "tiempo_carga",
  "bateria",
  "unidad_garantia",
  "valor_garantia",
  "velocidad_maxima",
  "potencia",
];

// Optional fields (for reference)
// const OPTIONAL_FIELDS = ["descripcion", "caracteristicas"];

// Valid values for specific fields
const VALID_TYPES = ["motocicleta", "patineta", "bicicleta", "carro", "camion"];
const VALID_AVAILABILITY = ["disponible", "pre-orden", "proximamente"];
const VALID_WARRANTY_UNITS = ["años", "año", "km"];

export class CSVParser {
  private errors: CSVParseError[] = [];
  private warnings: CSVParseWarning[] = [];

  /**
   * Parse CSV content and convert to Vehicle objects
   */
  parseCSV(csvContent: string): CSVParseResult {
    this.errors = [];
    this.warnings = [];

    try {
      const rows = this.parseCSVRows(csvContent);

      if (rows.length === 0) {
        this.errors.push({
          row: 0,
          field: "file",
          message: "CSV file is empty",
        });
        return this.createResult([]);
      }

      // Validate headers
      const headers = rows[0];
      this.validateHeaders(headers);

      // Parse vehicle data (skip header row)
      const vehicles: Vehicle[] = [];
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const vehicle = this.parseVehicleRow(row, i + 1);
        if (vehicle) {
          vehicles.push(vehicle);
        }
      }

      return this.createResult(vehicles);
    } catch (error) {
      this.errors.push({
        row: 0,
        field: "file",
        message: `Failed to parse CSV: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
      return this.createResult([]);
    }
  }

  /**
   * Parse CSV rows from content
   */
  private parseCSVRows(csvContent: string): CSVRow[] {
    const lines = csvContent.trim().split("\n");
    const rows: CSVRow[] = [];

    for (const line of lines) {
      if (line.trim() === "") continue; // Skip empty lines

      const row = this.parseCSVLine(line);
      if (row) {
        rows.push(row);
      }
    }

    return rows;
  }

  /**
   * Parse a single CSV line
   */
  private parseCSVLine(line: string): CSVRow | null {
    const fields: string[] = [];
    let currentField = "";
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          currentField += '"';
          i += 2;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
          i++;
        }
      } else if (char === "," && !inQuotes) {
        // Field separator
        fields.push(currentField.trim());
        currentField = "";
        i++;
      } else {
        currentField += char;
        i++;
      }
    }

    // Add the last field
    fields.push(currentField.trim());

    // Create row object with headers as keys
    if (fields.length > 0) {
      const row: CSVRow = {};
      const headers = this.getExpectedHeaders();

      for (let j = 0; j < Math.min(fields.length, headers.length); j++) {
        // Remove surrounding quotes if present
        let fieldValue = fields[j];
        if (fieldValue.startsWith('"') && fieldValue.endsWith('"')) {
          fieldValue = fieldValue.slice(1, -1);
        }
        row[headers[j]] = fieldValue;
      }

      return row;
    }

    return null;
  }

  /**
   * Get expected headers in correct order (Spanish names)
   */
  private getExpectedHeaders(): string[] {
    return [
      "nombre",
      "marca",
      "tipo",
      "precio",
      "ubicacion",
      "disponibilidad",
      "autonomia",
      "tiempo_carga",
      "bateria",
      "unidad_garantia",
      "valor_garantia",
      "velocidad_maxima",
      "potencia",
      "descripcion",
      "caracteristicas",
    ];
  }

  /**
   * Validate CSV headers
   */
  private validateHeaders(headers: CSVRow): void {
    const expectedHeaders = this.getExpectedHeaders();
    const actualHeaders = Object.keys(headers);

    // Check for missing required headers
    for (const requiredField of REQUIRED_FIELDS) {
      if (!actualHeaders.includes(requiredField)) {
        this.errors.push({
          row: 1,
          field: requiredField,
          message: `Missing required header: ${requiredField}`,
        });
      }
    }

    // Check for unexpected headers
    for (const actualHeader of actualHeaders) {
      if (!expectedHeaders.includes(actualHeader)) {
        this.warnings.push({
          row: 1,
          field: actualHeader,
          message: `Unexpected header: ${actualHeader}`,
        });
      }
    }
  }

  /**
   * Parse a single vehicle row
   */
  private parseVehicleRow(row: CSVRow, rowNumber: number): Vehicle | null {
    const errors: CSVParseError[] = [];
    const warnings: CSVParseWarning[] = [];

    try {
      // Convert Spanish column names to English for internal processing
      const englishRow: CSVRow = {};
      for (const [spanishKey, englishKey] of Object.entries(
        SPANISH_TO_ENGLISH_MAP
      )) {
        englishRow[englishKey] = row[spanishKey] || "";
      }

      // Validate required fields
      for (const field of REQUIRED_FIELDS) {
        const value = row[field];
        if (!value || value.trim() === "") {
          errors.push({
            row: rowNumber,
            field,
            message: `Campo requerido está vacío: ${field}`,
          });
        }
      }

      // If there are errors, add them and skip this row
      if (errors.length > 0) {
        this.errors.push(...errors);
        return null;
      }

      // Parse and validate individual fields
      const vehicle: Vehicle = {
        id: "", // Will be generated by database
        vendorId: "", // Will be set by the API
        name: this.validateString(englishRow.name, "name"),
        brand: this.validateString(englishRow.brand, "brand"),
        type: this.validateType(englishRow.type, rowNumber) as
          | "motocicleta"
          | "patineta"
          | "bicicleta"
          | "carro"
          | "camion",
        price: this.validatePrice(englishRow.price, rowNumber, warnings),
        images: [], // Will be set by the API
        specifications: {
          range: this.validateNumber(
            englishRow.range,
            "autonomia",
            rowNumber,
            warnings
          ).toString(),
          chargeTime: this.validateString(englishRow.chargeTime, "chargeTime"),
          warranty: `${this.validateNumber(
            englishRow.warrantyValue,
            "valor_garantia",
            rowNumber,
            warnings
          )} ${this.validateWarrantyUnit(englishRow.warrantyUnit, rowNumber)}`,
          battery: this.validateString(englishRow.battery, "battery"),
          performance: {
            maxSpeed: this.validateNumber(
              englishRow.maxSpeed,
              "velocidad_maxima",
              rowNumber,
              warnings
            ).toString(),
            power: this.validateNumber(
              englishRow.power,
              "potencia",
              rowNumber,
              warnings
            ).toString(),
          },
        },
        deliveryTime: "7-14 días", // Default value
        availability: this.validateAvailability(
          englishRow.availability,
          rowNumber
        ) as "in-stock" | "pre-order" | "coming-soon",
        passengerCapacity: 2, // Default value
        chargingTime: this.validateString(englishRow.chargeTime, "chargeTime"),
        maxSpeed: this.validateNumber(
          englishRow.maxSpeed,
          "velocidad_maxima",
          rowNumber,
          warnings
        ).toString(),
        power: this.validateNumber(
          englishRow.power,
          "potencia",
          rowNumber,
          warnings
        ).toString(),
        location: this.validateString(englishRow.location, "location"),
        description: englishRow.description?.trim() || "",
        features: this.parseFeatures(englishRow.features),
        reviews: {
          average: 0,
          count: 0,
        },
        vendor: {
          businessName: "", // Will be set by the API
          phone: "", // Will be set by the API
          email: "", // Will be set by the API
          rating: 0, // Will be set by the API
          isPro: false, // Will be set by the API based on vendor subscription
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add warnings to the main warnings array
      this.warnings.push(...warnings);

      return vehicle;
    } catch (error) {
      // If any validation fails, add the error and return null
      this.errors.push({
        row: rowNumber,
        field: "general",
        message:
          error instanceof Error
            ? error.message
            : "Error de validación desconocido",
      });
      return null;
    }
  }

  /**
   * Parse features string into array
   */
  private parseFeatures(features: string): string[] {
    if (!features || features.trim() === "") {
      return [];
    }
    return features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  }

  /**
   * Validate string field
   */
  private validateString(value: string, fieldName: string): string {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      throw new Error(`Required field ${fieldName} is empty`);
    }
    return trimmed;
  }

  /**
   * Validate number field
   */
  private validateNumber(
    value: string,
    fieldName: string,
    rowNumber: number,
    warnings: CSVParseWarning[]
  ): number {
    const num = parseFloat(value);
    if (isNaN(num)) {
      // Map English field names to Spanish for error messages
      const spanishFieldMap: { [key: string]: string } = {
        precio: "precio",
        autonomia: "autonomia",
        velocidad_maxima: "velocidad_maxima",
        potencia: "potencia",
        valor_garantia: "valor_garantia",
      };
      const spanishFieldName = spanishFieldMap[fieldName] || fieldName;

      this.errors.push({
        row: rowNumber,
        field: spanishFieldName,
        message: `Invalid number for ${spanishFieldName}: ${value}`,
        value,
      });
      throw new Error(`Invalid number for ${spanishFieldName}: ${value}`);
    }
    if (num < 0) {
      warnings.push({
        row: rowNumber,
        field: fieldName,
        message: `Negative value for ${fieldName}: ${value}`,
        value,
      });
    }
    return num;
  }

  /**
   * Validate price field
   */
  private validatePrice(
    value: string,
    rowNumber: number,
    warnings: CSVParseWarning[]
  ): number {
    const price = this.validateNumber(value, "precio", rowNumber, warnings);
    if (price < 0) {
      throw new Error(`Price cannot be negative: ${value}`);
    }
    return price;
  }

  /**
   * Validate type field
   */
  private validateType(value: string, rowNumber: number): string {
    const trimmed = value.trim().toLowerCase();
    if (!VALID_TYPES.includes(trimmed)) {
      this.errors.push({
        row: rowNumber,
        field: "tipo",
        message: `Invalid type: ${value}. Valid types are: ${VALID_TYPES.join(
          ", "
        )}`,
        value,
      });
      throw new Error(
        `Invalid type: ${value}. Valid types are: ${VALID_TYPES.join(", ")}`
      );
    }
    return trimmed;
  }

  /**
   * Validate availability field
   */
  private validateAvailability(value: string, rowNumber: number): string {
    const trimmed = value.trim().toLowerCase();

    // Map Spanish values to English
    const spanishToEnglishMap: { [key: string]: string } = {
      disponible: "in-stock",
      "pre-orden": "pre-order",
      proximamente: "coming-soon",
    };

    if (!VALID_AVAILABILITY.includes(trimmed)) {
      this.errors.push({
        row: rowNumber,
        field: "disponibilidad",
        message: `Disponibilidad inválida: ${value}. Opciones válidas son: ${VALID_AVAILABILITY.join(
          ", "
        )}`,
        value,
      });
      throw new Error(
        `Disponibilidad inválida: ${value}. Opciones válidas son: ${VALID_AVAILABILITY.join(
          ", "
        )}`
      );
    }

    // Convert Spanish to English for internal use
    return spanishToEnglishMap[trimmed] || trimmed;
  }

  /**
   * Validate warranty unit field
   */
  private validateWarrantyUnit(value: string, rowNumber: number): string {
    const trimmed = value.trim().toLowerCase();

    // Map Spanish values to English
    const spanishToEnglishMap: { [key: string]: string } = {
      años: "años",
      año: "años",
      km: "km",
    };

    if (!VALID_WARRANTY_UNITS.includes(trimmed)) {
      this.errors.push({
        row: rowNumber,
        field: "unidad_garantia",
        message: `Unidad de garantía inválida: ${value}. Unidades válidas son: ${VALID_WARRANTY_UNITS.join(
          ", "
        )}`,
        value,
      });
      throw new Error(
        `Unidad de garantía inválida: ${value}. Unidades válidas son: ${VALID_WARRANTY_UNITS.join(
          ", "
        )}`
      );
    }

    // Convert Spanish to English for internal use
    return spanishToEnglishMap[trimmed] || trimmed;
  }

  /**
   * Create result object
   */
  private createResult(vehicles: Vehicle[]): CSVParseResult {
    return {
      success: this.errors.length === 0,
      vehicles,
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}

/**
 * Parse CSV content and return vehicles with validation
 */
export function parseVehicleCSV(csvContent: string): CSVParseResult {
  const parser = new CSVParser();
  return parser.parseCSV(csvContent);
}

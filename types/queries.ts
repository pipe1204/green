import { Vehicle } from ".";

export interface PaginatedVehiclesResult {
  vehicles: Vehicle[];
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface VehicleQueryError {
  message: string;
  code?: string;
  details?: string;
}

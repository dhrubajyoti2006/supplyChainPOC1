import { ApiResponse } from "../models/ApiResponse";
import type { Employee } from "../types/Employee";

const employees: Employee[] = [
  { id: "emp-001", name: "Ava Patel", role: "Logistics Analyst", location: "Chicago", department: "Operations" },
  { id: "emp-002", name: "Noah Kim", role: "Supply Planner", location: "Seattle", department: "Planning" },
  { id: "emp-003", name: "Mia Chen", role: "Inventory Specialist", location: "Austin", department: "Warehouse" },
  { id: "emp-004", name: "Liam Garcia", role: "Procurement Lead", location: "Denver", department: "Procurement" },
  { id: "emp-005", name: "Sophia Nguyen", role: "Quality Manager", location: "Atlanta", department: "Quality" }
];

export class DataService {
  public static async list() {
    const response = new ApiResponse<Employee[]>();
    try {
      response.data = employees;
      response.addSuccess();
      return response;
    } catch (error) {
      response.addExceptionWithText(error instanceof Error ? error.message : "Unknown error");
      return response;
    }
  }

  public static async getById(id: string) {
    const response = new ApiResponse<Employee | null>();
    try {
      const employee = employees.find((item) => item.id === id) ?? null;
      response.data = employee;
      if (employee) {
        response.addSuccess();
      } else {
        response.addError("Employee not found");
      }
      return response;
    } catch (error) {
      response.addExceptionWithText(error instanceof Error ? error.message : "Unknown error");
      return response;
    }
  }
}

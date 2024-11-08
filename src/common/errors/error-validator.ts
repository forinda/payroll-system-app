import { z } from "zod";
import { ApiError } from "./base";
import { HttpStatus } from "../http";
import { injectable } from "inversify";
import { Dependency } from "../di";

@injectable()
@Dependency()
export class ApiErrorValidator {
  validateSchema<T>(schema: z.Schema<T>, payload: any) {
    const { success, error } = schema.safeParse(payload);
    if (!success) {
      const firstIssue = error.issues[0];
      const message = firstIssue.message
        .toLowerCase()
        .includes(firstIssue.path.toString().toLowerCase())
        ? firstIssue.message
        : `[${firstIssue.path}] ${firstIssue.message}`;
      throw new ApiError(message, HttpStatus.BAD_REQUEST, {
        status: "error",
        type: "validation_error",
      });
    }
    return payload as T;
  }
}

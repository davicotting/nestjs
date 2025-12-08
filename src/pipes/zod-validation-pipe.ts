import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
import { fromZodError } from "zod-validation-error";

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    console.log(value)
    try {
      this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(error),
          statusCode: 400,
          message: "Validation error",
        });
      }
      throw new BadRequestException("Validation failed.");
    }
    return value
  }
}

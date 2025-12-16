import z from "zod";

import * as schemas from "../schemas"; // Import everything from schemas

// Create a union type of all schema types
type AllSchemas = typeof schemas;

// Extract the types from each schema using z.infer
export type ValidatedData = {
  [K in keyof AllSchemas]: z.infer<AllSchemas[K]>;
}[keyof AllSchemas];

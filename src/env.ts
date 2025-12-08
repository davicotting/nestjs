import * as zod from "zod";

export const envSchema = zod.object({
    DATABASE_URL: zod.string(),
    PORT: zod.coerce.number().default(3333),
    JWT_SECRET: zod.string()
}); 

export type Env = zod.infer<typeof envSchema>;
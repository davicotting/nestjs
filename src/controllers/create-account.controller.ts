import { Controller, Post, Body, ConflictException, UsePipes } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type createAccountType = z.infer<typeof createAccountBodySchema>;
@Controller("/accounts")
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}
  @Post()
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: createAccountType) {
    console.log(body)
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        "User with same e-mail address already exists."
      );
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}

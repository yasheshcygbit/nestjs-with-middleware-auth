import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUserDto } from "../users/dto/auth-user.dto";

export const AuthUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): AuthUserDto => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
)
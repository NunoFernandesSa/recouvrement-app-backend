import { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

const getCurrentUserByContext: (ctx: ExecutionContext) => any = (
  ctx: ExecutionContext,
): any => ctx.switchToHttp().getRequest().user;

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): any => getCurrentUserByContext(ctx),
);

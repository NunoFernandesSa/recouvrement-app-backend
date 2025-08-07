import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const getCurrentUserByContexte: (context: ExecutionContext) => any = (
  context: ExecutionContext,
): any => context.switchToHttp().getRequest().user;

export const currentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Record<string, unknown> =>
    getCurrentUserByContexte(context) as Record<string, unknown>,
);

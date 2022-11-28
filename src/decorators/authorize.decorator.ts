import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/guards/is-authorized/roles';

export const Authorize = (...authorize: Roles[]) => SetMetadata('authorize', authorize);

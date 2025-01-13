import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH_ADMIN_GUARD } from '~/shared/constants';

export const SkipAuthAdminGuard = () => SetMetadata(SKIP_AUTH_ADMIN_GUARD, true);

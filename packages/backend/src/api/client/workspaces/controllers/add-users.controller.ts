import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import type { AddUsersToWorkspacePayload } from '../schema/schema';
import { addUsersToWorkspaceSchema } from '../schema/schema';
import { userAudit } from '@/common/utils/user-request-audit';
import { AddUserToWorkspaceService } from '../services/add-users.service';
import { createHttpResponse } from '@/common/utils/responder';

@injectable()
@Dependency()
@Controller()
export class AddUserToWorkspaceController extends BasePostController {
  @inject(AddUserToWorkspaceService)
  private service: AddUserToWorkspaceService;
  @ApiControllerMethod({
    bodySchema: addUsersToWorkspaceSchema,
    pathParamTransform: {
      id: 'department_id'
    },
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({ res, body }: ApiRequestContext<AddUsersToWorkspacePayload>) {
    const feedback = await this.service.create({ data: body! });

    return createHttpResponse(res, {
      ...feedback,
      statusCode: feedback.status
    });
  }
}

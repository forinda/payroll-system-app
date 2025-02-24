import { BasePostController } from '@/common/bases/controller';
import {
  Controller,
  ApiControllerMethod
} from '@/common/decorators/controller.decorator';
import { Dependency } from '@/common/di';
import { HttpStatus } from '@/common/http';
import type { ApiRequestContext } from '@/common/interfaces/controller';
import { inject, injectable } from 'inversify';

import { AddOrganizationMemberService } from '../services/add-organization-member.service';
import { userAudit } from '@/common/utils/user-request-audit';
import {
  addMemberToOrRemoveFromOrgSchema,
  type AddMemberToOrRemoveFromOrganizationType
} from '../schema';

@injectable()
@Dependency()
@Controller()
export class AddOrganizationMemberController extends BasePostController {
  @inject(AddOrganizationMemberService)
  private service: AddOrganizationMemberService;
  @ApiControllerMethod({
    bodySchema: addMemberToOrRemoveFromOrgSchema,
    auth: true,
    audit: userAudit('create'),
    bodyBindOrgId: true
  })
  async post({
    res,
    body
  }: ApiRequestContext<AddMemberToOrRemoveFromOrganizationType>) {
    const feedback = await this.service.add({ data: body! });

    return res.status(HttpStatus.CREATED).json(feedback);
  }
}

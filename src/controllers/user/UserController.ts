import {Controller, Get, Route, Security, Request, Hidden} from "tsoa";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import {Context} from "middleware/context";

@Route("api/users")
export class UserController extends Controller {
  @Get("me")
  @Hidden()
  @Security("bearerAuth", [ScopeRole.USER, ScopeRole.ADMIN])
  public async getUser(@Request() request: Context) {
  }

  @Get("updateProfile")
  @Hidden()
  @Security("bearerAuth", [ScopeRole.USER, ScopeRole.ADMIN])
  public async update(@Request() request: Context) {
  }
}

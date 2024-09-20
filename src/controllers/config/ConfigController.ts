import {Get, Route} from "tsoa";
import {Controller} from "@tsoa/runtime";
import {createResponse, ResponseData} from "config/ResponseData";
import httpStatus from "http-status";
import ConfigService from "services/configService/ConfigService";

@Route("api/config")
export class ConfigController extends Controller {
  @Get("")
  public async config(): Promise<ResponseData<any>> {
    const resp = await ConfigService.config();
    this.setStatus(httpStatus.OK);
    return createResponse(resp);
  }
}

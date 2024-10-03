import {Body, Controller, Get, Route, Request, Security, Post, Put, Delete, Tags} from "tsoa";
import {Context} from "middleware/context";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import CategoryDetailService from "services/categoryService/CategoryDetailService";
import httpStatus from "http-status";
import {createResponse} from "config/ResponseData";
import {CategoryDetailRequest, CategoryDetailUpdateRequest} from "root/src/entity/CategoryEntity";
import {validateCategoryDetail} from "root/src/validator/CategoryValidator";

@Route("api/category/{categoryId}/detail")
@Tags('Category Detail')
export class CategoryDetailController extends Controller {
    @Get("/")
    public async getCategoryDetail(categoryId: number): Promise<any> {
        const resp = await CategoryDetailService.get(categoryId);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeCategoryDetail(@Body() body: CategoryDetailRequest, categoryId: number, @Request() request: Context): Promise<any> {
        validateCategoryDetail(body)
        const resp = await CategoryDetailService.store(body, categoryId);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Get("/{categoryDetailId}")
    public async detailCategoryDetail(categoryId : number, categoryDetailId : number): Promise<any> {

        const resp = await CategoryDetailService.detail(categoryId, categoryDetailId);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Put("/update")
    @Security("bearerAuth", [ScopeRole.USER])
    public async updateCategoryDetail(categoryId : number, @Body() body: CategoryDetailUpdateRequest,@Request() request: Context): Promise<any> {
        validateCategoryDetail(body)
        const resp = await CategoryDetailService.update(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Delete("/destroy/{categoryDetailId}")
    @Security("bearerAuth", [ScopeRole.USER])
    public async deleteCategoryDetail(categoryId : number,categoryDetailId:number,@Request() request:Context): Promise<any> {
        const resp = await CategoryDetailService.delete(categoryId, categoryDetailId);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }
}

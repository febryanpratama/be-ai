import {Body, Controller, Get, Route, Request, Security, Post, Put, Delete, Tags} from "tsoa";
import {Context} from "middleware/context";
import {ScopeRole} from "root/src/enum/ScopeRoleEnum";
import CategoryService from "services/categoryService/CategoryService";
import httpStatus from "http-status";
import {createResponse} from "config/ResponseData";
import {CategoryRequest, CategoryUpdateRequest} from "root/src/entity/CategoryEntity";
import {validateCategory} from "root/src/validator/CategoryValidator";

@Route("api/category")
@Tags("Category")
export class CategoryController extends Controller {
    @Get("/")
    public async getCategory(): Promise<any> {
        const resp = await CategoryService.get();

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }
    @Post("/")
    @Security("bearerAuth", [ScopeRole.USER])
    public async storeCategory(@Body() body: CategoryRequest,@Request() request: Context): Promise<any> {
        validateCategory(body)
        const resp = await CategoryService.store(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Get("/{categoryId}")
    public async detailCategory(categoryId: number): Promise<any> {

        const resp = await CategoryService.detail(categoryId);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Put("/update")
    @Security("bearerAuth", [ScopeRole.USER])
    public async updateCategory(@Body() body: CategoryUpdateRequest,@Request() request: Context): Promise<any> {
        validateCategory(body)
        const resp = await CategoryService.update(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Delete("/destroy/{categoryId}")
    @Security("bearerAuth", [ScopeRole.USER])
    public async deleteCategory(categoryId:number,@Request() request:Context): Promise<any> {
        const resp = await CategoryService.delete(categoryId);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }
}

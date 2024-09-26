import { Body, Controller, Get, Post, Request, Route, Security, Delete } from "tsoa";
import { ScopeRole } from "root/src/enum/ScopeRoleEnum";
// import { Context } from "middleware/context";
import { PackageRequest, UpdatePackageRequest, DetailPackageRequest } from "entity/AuthEntity";
import { validateStorePackageFields, validateDetailPackageFields } from "root/src/validator/AuthValidator";
import { createResponse } from "config/ResponseData";

import httpStatus from "http-status";
import PackageService from "services/packageService/PackageService";


@Route("api/package")
export class PackageController extends Controller {
    @Get("/")
    public async getPackage(): Promise<any> {
        const resp = await PackageService.get();

        this.setStatus(httpStatus.OK)
        return createResponse(resp);

    }

    @Post("/")
    @Security("bearerAuth", [ScopeRole.ADMIN])
    public async storePackage(@Body() body: PackageRequest): Promise<any> {
        validateStorePackageFields(body);

        const resp = await PackageService.store(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("/detail")
    public async detailPackage(@Body() body: DetailPackageRequest): Promise<any> {
        validateDetailPackageFields(body);
        const resp = await PackageService.detail(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Post("/update")
    @Security("bearerAuth", [ScopeRole.ADMIN])
    public async updatePackage(@Body() body: UpdatePackageRequest): Promise<any> {
        validateStorePackageFields(body);

        const resp = await PackageService.update(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

    @Delete("/delete")
    @Security("bearerAuth", [ScopeRole.ADMIN])
    public async deletePackage(@Body() body: DetailPackageRequest): Promise<any> {
        validateDetailPackageFields(body);

        const resp = await PackageService.delete(body);

        this.setStatus(httpStatus.OK)
        return createResponse(resp);
    }

}
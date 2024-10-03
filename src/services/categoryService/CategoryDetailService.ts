import { client } from "root/src/db/db"


class CategoryDetailService {

    public get = async (categoryId: number): Promise<any> => {
        const dataCategoryDetail = await client().categoryDetail.findMany({
            include: {
                category: true, // Mengambil relasi posts
            },
            where: {
                categoryId: categoryId
            }
        })

        return dataCategoryDetail;
    }

    public store = async (body: any, categoryId: number): Promise<any> => {

        const storeCategoryDetail = await client().categoryDetail.create({
            data: {
                description: body.description,
                categoryId: categoryId
            }
        })

        return storeCategoryDetail;
    }

    public detail = async (categoryId:number, categoryDetailId:number): Promise<any> => {
        const dataCategoryDetail = await client().categoryDetail.findFirst({
            include: {
                category: true, // Mengambil relasi posts
            },
            where: {
                id: categoryDetailId
            }
            
        })

        return dataCategoryDetail;
    }

    public update = async (body: any): Promise<any> => {

        const updateCategoryDetail = await client().categoryDetail.update({
            where: {
                id: body.category_detail_id
            },
            data:{
                description: body.description,
            }
        })
        
        return updateCategoryDetail;
    }

    public delete = async (categoryId:number, categoryDetailId:number): Promise<any> => {

        const dataCategoryDetail = await client().categoryDetail.delete({
            where: {
                id: categoryDetailId
            }
        })
        
        return dataCategoryDetail;
    }
    
}

export default new CategoryDetailService();
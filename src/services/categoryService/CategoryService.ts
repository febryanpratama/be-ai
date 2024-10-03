import { client } from "root/src/db/db"


class CategoryService {

    public get = async (): Promise<any> => {
        const dataCategory = await client().category.findMany({
            include: {
                categoryDetail: true, // Mengambil relasi posts
            },
        })

        return dataCategory;
    }

    public store = async (body: any): Promise<any> => {

        const storeCategory = await client().category.create({
            data: {
                name: body.name,
                imgUrl: body.imgUrl,
            }
        })

        return storeCategory;
    }

    public detail = async (body: any): Promise<any> => {
        const dataCategory = await client().category.findFirst({
            include: {
                categoryDetail: true, // Mengambil relasi posts
            },
            where: {
                id: body.category_id
            }
            
        })

        return dataCategory;
    }

    public update = async (body: any): Promise<any> => {

        const updateCategory = await client().category.update({
            where: {
                id: body.category_id
            },
            data:{
                name: body.name,
                imgUrl: body.imgUrl,
            }
        })
        
        return updateCategory;
    }

    public delete = async (body: any): Promise<any> => {

        const dataCategory = await client().category.delete({
            where: {
                id: body.category_id
            }
        })
        
        return dataCategory;
    }
    
}

export default new CategoryService();
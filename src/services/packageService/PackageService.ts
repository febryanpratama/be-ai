import { client } from "root/src/db/db"


class PackageService {

    public get = async (): Promise<any> => {
        const dataPackage = await client().package.findMany()

        return dataPackage;
    }

    public store = async (body: any): Promise<any> => {

        const storePackage = await client().package.create({
            data: {
                price: body.price,
                total_people: body.total_people,
                type: body.type,
            }
        })

        return storePackage;
    }

    public detail = async (body: any): Promise<any> => {
        const dataPackage = await client().package.findFirst({
            where: {
                id: body.package_id
            }
            
        })

        return dataPackage;
    }

    public update = async (body: any): Promise<any> => {

        const updatePackage = await client().package.update({
            where: {
                id: body.package_id
            },
            data:{
                price: body.price,
                total_people: body.total_people,
                type: body.type,
            }
        })
        
        return updatePackage;
    }

    public delete = async (body: any): Promise<any> => {

        const dataPackage = await client().package.delete({
            where: {
                id: body.package_id
            }
        })
        
        return dataPackage;
    }
    
}

export default new PackageService();
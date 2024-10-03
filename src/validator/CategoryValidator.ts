import {LoginRequest} from "root/src/entity/AuthEntity";
import {validator} from "root/src/validator/Validator";
import {CategoryRequest, CategoryDetailRequest} from "root/src/entity/CategoryEntity";

export const validateCategory = (fields: CategoryRequest) => {
    validator.string(fields.name);
};

export const validateCategoryDetail = (fields: CategoryDetailRequest) => {
    validator.string(fields.description);
};

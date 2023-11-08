import { applyDecorators, Type } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PageResDto } from '../dto/res.dto';

export const ApiGetResponse = <T extends Type<any>>(model: T) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [{ $ref: getSchemaPath(model) }],
            },
        }),
    );
};

export const ApiPostResponse = <T extends Type<any>>(model: T) => {
    return applyDecorators(
        ApiCreatedResponse({
            schema: {
                allOf: [{ $ref: getSchemaPath(model) }],
            },
        }),
    );
};

export const ApiGetItemsResponse = <T extends Type<any>>(model: T) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PageResDto) },
                    {
                        properties: {
                            items: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                        required: ['items'],
                    },
                ],
            },
        }),
    );
};

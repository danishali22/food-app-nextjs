export const successResponse = (message: string, statusCode: number = 200, data: any = null) => {
    return Response.json({
            success: true,
            message,
            data,
    }, { status: statusCode })
};

export const errorResponse = (message: string, statusCode: number = 400) => {
    return Response.json({
            success: false,
            message,
        },{ status: statusCode })
};

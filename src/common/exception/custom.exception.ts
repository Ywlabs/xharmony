import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }

    /*BadRequestException
    UnauthorizedException
    NotFoundException
    ForbiddenException
    NotAcceptableException
    RequestTimeoutException
    ConflictException
    GoneException
    HttpVersionNotSupportedException
    PayloadTooLargeException
    UnsupportedMediaTypeException
    UnprocessableEntityException
    InternalServerErrorException
    NotImplementedException
    ImATeapotException
    MethodNotAllowedException
    BadGatewayException
    ServiceUnavailableException
    GatewayTimeoutException
    PreconditionFailedException
    throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
    */

}
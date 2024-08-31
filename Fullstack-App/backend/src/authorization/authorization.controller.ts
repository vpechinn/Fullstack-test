import {
    Controller,
    Post,
    Req,
    Res,
    Request,
    BadRequestException,
    Body,
    Put,
    UnauthorizedException, Delete
} from '@nestjs/common';
import {AppService} from "../app.service";
import {AuthorizationService} from "./authorization.service";
import {Response} from 'express';

class SignInOrUpReq {
    name: string
    password: string
}

@Controller('auth')
export class AuthorizationController {


    constructor(private readonly authService: AuthorizationService) {
    }

    @Post('sign-in')
    async postSignIn(@Body() body: SignInOrUpReq, @Res() res: Response): Promise<void> {
        if (!body.name || !body.password)
            throw new BadRequestException("Username and password is required");

        const token = await this.authService.signIn({name: body.name, password: body.password});


        res.status(200).json(token).send();

    }

    @Post('sign-up')
    async postSignUp(@Body() body: SignInOrUpReq, @Res() res: Response): Promise<void> {
        if (!body.name || !body.password)
            throw new BadRequestException("Username and password is required");

        try {
            await this.authService.createUser({name: body.name, password: body.password})
        } catch (err) {
            if (err.code === '23505') {
                res.status(409).send()
                return;
            }
            throw err;
        }

        res.status(201).send()

    }

    @Put('me')
    async putMe(@Body() body: SignInOrUpReq, @Req() req: Request, @Res() res: Response): Promise<void> {

        let token = req.headers['authorization'];
        if(!token)
            throw new UnauthorizedException("No token provided");

        if (!body.name || !body.password)
            throw new BadRequestException("Username and password is required");

        token = token.replace('Bearer ', '');

        const user =  await this.authService.getUserByAuthToken(token)
        if(user == null)
            throw new UnauthorizedException("Invalid token");

        await this.authService.updateUser({userid:user.userid, name: body.name, password: body.password})

        res.status(200).send()

    }
    @Delete('me')
    async deleteMe(@Req() req: Request, @Res() res: Response): Promise<void> {

        let token = req.headers['authorization'];
        if(!token)
            throw new UnauthorizedException("No token provided");

        token = token.replace('Bearer ', '');

        const user =  await this.authService.getUserByAuthToken(token)
        if(user == null)
            throw new UnauthorizedException("Invalid token");


        await this.authService.deleteUser(user.userid)

        res.status(200).send()

    }
    
}

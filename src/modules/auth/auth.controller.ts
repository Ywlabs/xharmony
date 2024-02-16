import { Controller, Post, Body, Req, Patch, Param, Delete, Get, UseFilters, ParseIntPipe, UseGuards, Version, HttpCode, Res, HttpStatus, Logger} from '@nestjs/common';
import { LoginUserDto, ReflashTokenDto } from 'src/modules/users/dto/users.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AccessGuard } from 'src/common/guard/access.guard';
import { RefreshGuard } from 'src/common/guard/refresh.guard';
import { ConfigService } from "@nestjs/config";
import { Roles } from 'src/common/decorator/roles.decorator';
import { RolesGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RoleType } from 'src/common/enum/roles.enum';

/* 테스트*/

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
      private readonly authService: AuthService,
      private readonly config: ConfigService
    ) {}
    
    //로그인 
    @Post('login')
    async login(@Body() dto: LoginUserDto, @Res() res: Response): Promise<any> {
      const token =  await this.authService.login(dto);
      //Bearer 토큰 생성 
      res.setHeader('Authorization', 'Bearer '+ token.access_token);
      res.cookie('refresh_token', token.refresh_token, {httpOnly: true,domain: 'localhost',path: '/',maxAge:Number(this.config.get('JWT_REFRESH_MS')) * 1000});
      return res.json(token);      
    }

    @Post('refresh')
    @UseGuards(AccessGuard)
    async refresh(@Body() dto: ReflashTokenDto, @Res() res: Response,): Promise<any> {
      const newAccessToken = (await this.authService.refresh(dto)).access_token;
      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      return res.json({"access_token":newAccessToken});      
    }

    @Post('logout')
    @UseGuards(RefreshGuard)
    async logout(@Req() req: any, @Res() res: Response): Promise<any> {
      
      await this.authService.removeToken(req.user.userid);
      res.clearCookie('refresh_token');
      return res.json({
        message: 'logout success'
      });
    }

    @Get('/roletest')
    @UseGuards(AccessGuard, RolesGuard)
    @Roles(RoleType.ADMIN, RoleType.USER)
    adminRole(@Req() req: any): any {
        const user: any = req.user;
        return user;
    }
}

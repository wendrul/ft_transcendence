import {
	Controller,
	Get,
	Param,
	StreamableFile,
	Res,
	NotFoundException,
} from "@nestjs/common";
import { LocalFilesService } from './localFiles.service';
import { Response } from 'express';
import {createReadStream} from 'fs';
import {UsersService} from "./users.service";

@Controller('localFiles')
export class LocalFilesController {
	constructor(
		private localFilesService: LocalFilesService,
		private usersService: UsersService,
	) {}

	@Get('/path/:id')
	async getFilePathByUserId(@Param('id') id: string) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('user not found');
		}

		if (user.defaultAvatar) {
			return ('/usr/src/avatars/default.jpg');
		}
		else {
			const file = await this.localFilesService.getFileById(user.avatarId);

			return file.path;
		}
	}

	@Get('/:id')
	async getFileByUserId(@Param('id') id: string, @Res({ passthrough: true }) response: Response) {
		const user = await this.usersService.findOne(parseInt(id));
		if (!user) {
			throw new NotFoundException('user not found');
		}

		if (user.defaultAvatar) {
			const stream = createReadStream('/usr/src/avatars/default.jpg');

			response.set({
				'Content-Disposition': 'inline; filename=default.jpg',
				'Content-Type': 'image'
			});

			return new StreamableFile(stream);
		}
		else {
			const file = await this.localFilesService.getFileById(user.avatarId);

			const stream = createReadStream(file.path);

			response.set({
				'Content-Disposition': `inline; filename="${file.filename}"`,
				'Content-Type': file.mimetype
			});

			return new StreamableFile(stream);
		}
	}
}

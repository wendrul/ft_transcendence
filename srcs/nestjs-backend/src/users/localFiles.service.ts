import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {LocalFileDto} from './dtos/localFile.dto';
import { LocalFile } from './entities/localFiles.entity';

@Injectable()
export class LocalFilesService {
	constructor(@InjectRepository(LocalFile) private repo: Repository<LocalFile>) {}

	async saveLocalFileData(fileData: LocalFileDto) {
		const newFile = this.repo.create(fileData);
		return this.repo.save(newFile);
	}

	async getFileById(id: number) {

		const file = await this.repo.findOneBy({id});
		if (!file) {
			throw new NotFoundException();
		}
		
		return file;
	}
}

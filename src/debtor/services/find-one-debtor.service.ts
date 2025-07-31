import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { DebtorResponseDto } from '../dtos/debtor-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FindOneDebtorService {
  constructor(private readonly prisma: PrismaService) {}
  /**
   * Service for finding a debtor by their ID
   * @class FindOneDebtorService
   */

  async findOneDebtor(id: string): Promise<DebtorResponseDto> {
    // Check if debtor exists
    // If not, throw error
    const existingDebtor = await this.prisma.debtor.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingDebtor) {
      throw new MyServicesError(`Debtor not found`, HttpStatus.NOT_FOUND);
    }

    return plainToInstance(DebtorResponseDto, existingDebtor);
  }
}

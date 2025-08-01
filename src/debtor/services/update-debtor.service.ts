import { HttpStatus, Injectable } from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';
import { UpdateDebtorDto } from '../dtos/update-debtor.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async updateDebtor(
    id: string,
    data: UpdateDebtorDto,
  ): Promise<{ data: UpdateDebtorDto; message: string }> {
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

    // Update debtor
    // If not, throw error
    const updatedDebtor = await this.prisma.debtor.update({
      where: {
        id: id,
      },
      data: data,
    });
    if (!updatedDebtor) {
      throw new MyServicesError(
        `Debtor not updated`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const debtorResponse = plainToInstance(UpdateDebtorDto, updatedDebtor);

    return { data: debtorResponse, message: 'Debtor updated successfully' };
  }
}

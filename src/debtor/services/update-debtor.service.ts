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
      select: {
        id: true,
        reference: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        zipcode: true,
        country: true,
        siret: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        client: {
          select: {
            id: true,
            internalRef: true,
            name: true,
          },
        },
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
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    if (!updatedDebtor) {
      throw new MyServicesError(
        `Debtor not updated`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const updatedData = plainToInstance(UpdateDebtorDto, updatedDebtor, {
      excludeExtraneousValues: true,
    });

    return {
      data: updatedData,
      message: 'Debtor updated successfully',
    };
  }
}

import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import MyServicesError from 'src/errors/my-services.error';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class DeleteDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteDebtor(id: string): Promise<any> {
    try {
      // Check if debtor exists
      // If not, throw error
      const existingDebtor = await this.prisma.debtor.findUnique({
        where: {
          id,
        },
      });

      if (!existingDebtor) {
        throw new MyServicesError('Debtor not found', HttpStatus.NOT_FOUND);
      }

      // delete debtor
      const deletedDebtor = await this.prisma.debtor.delete({
        where: {
          id,
        },
      });

      return {
        data: deletedDebtor,
        message: 'Debtor deleted successfully',
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An unknown error occurred while try deleting the debtor',
      );
    }
  }
}

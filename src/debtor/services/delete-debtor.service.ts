import { PrismaService } from 'src/prisma.service';

export class DeleteDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async deleteDebtor(id: string): Promise<any> {
    try {
      const debtor = await this.prisma.debtor.delete({
        where: {
          id,
        },
      });
      return debtor;
    } catch (error) {
      throw new Error('Failed to delete debtor');
    }
  }
}

import { PrismaService } from 'src/prisma.service';

export class CreateDebtorService {
  constructor(private readonly prisma: PrismaService) {}

  async createDebtor(data: any): Promise<any> {}
}

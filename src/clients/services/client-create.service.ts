import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from '../dto/create-client.dto';
import { CreateClientResponseDto } from '../dto/create-client-response.dto';
import { plainToInstance } from 'class-transformer';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateClientService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new client in the database
   * @param data - The client data transfer object containing client information
   * @param {string} data.internalRef - Internal reference for the client
   * @param {string} data.name - Client's name
   * @param {string[]} data.email - Array of client email addresses
   * @param {string} data.userId - ID of the user creating the client
   * @throws {Error} When internal reference is empty or missing
   * @throws {Error} When name is empty or missing
   * @throws {Error} When email array is empty or not an array
   * @throws {Error} When client with provided email already exists
   * @throws {InternalServerErrorException} When database operation fails
   * @returns {Promise<CreateClientResponseDto>} The created client data with assigned ID
   */
  async createClient(data: CreateClientDto): Promise<CreateClientResponseDto> {
    // -----||-------||-----
    // ----- Variables -----
    // -----||-------||-----
    let internalRef: string;

    // -----||-------------||-----
    // ----- Validate inputs -----
    // -----||-------------||-----

    if (!data.name.trim()) {
      throw new Error('Name is required');
    }

    if (!Array.isArray(data.email) || data.email.length === 0) {
      throw new Error('At least one email address is required');
    }

    // ----- Generate a unique internal reference -----
    if (data.name) {
      internalRef = `CLT-FR-${data.name}`;
    } else {
      internalRef = `CLT-FR-${uuidv4()}`;
    }

    // Check if the client already exists
    const existingClient = await this.prisma.client.findFirst({
      where: { internalRef },
    });

    if (existingClient) {
      throw new Error('Client already exists');
    }

    try {
      // Create the client
      const createdClient = await this.prisma.client.create({
        data: { ...data, userId: data.userId, internalRef: internalRef },
      });

      // Return the created client with the correct type
      return plainToInstance(CreateClientResponseDto, createdClient);
    } catch (error: any) {
      throw new InternalServerErrorException(
        'Failed to create client',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }
}

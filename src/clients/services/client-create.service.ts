import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateClientDto } from '../dtos/create-client.dto';
import { CreateClientResponseDto } from '../dtos/create-client-response.dto';
import { plainToInstance } from 'class-transformer';

import { v4 as uuidv4 } from 'uuid';
import { RequestWithUserId } from 'src/common/interface/requestWithUserId.interface';
import MyServicesError from 'src/errors/my-services.error';

@Injectable()
export class CreateClientService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Service for create a client
   * @class CreateClientService
   */

  /**
   * Creates a new client in the database
   * @param data - The client data transfer object containing client information
   * @param {string} data.name - Client's name
   * @param {string[]} data.email - Array of client email addresses
   * @param req - Request object containing authenticated user information
   * @throws {MyServicesError} When name is empty or missing
   * @throws {MyServicesError} When email array is empty or not an array
   * @throws {MyServicesError} When user is not found
   * @throws {MyServicesError} When client with generated internal reference already exists
   * @throws {MyServicesError} When database operation fails
   * @returns {Promise<CreateClientResponseDto>} The created client data with assigned ID and generated internal reference
   */
  async createClient(
    data: CreateClientDto,
    req: RequestWithUserId,
  ): Promise<CreateClientResponseDto> {
    // -----||-------||-----
    // ----- Variables -----
    // -----||-------||-----
    let internalRef: string;

    // -----||-------------||-----
    // ----- Validate inputs -----
    // -----||-------------||-----

    if (!data.name.trim()) {
      throw new MyServicesError('Name is required');
    }

    if (!Array.isArray(data.email) || data.email.length === 0) {
      throw new MyServicesError('At least one email address is required');
    }

    // Check if the user exists before creating the client
    const userIdExists = await this.prisma.user.findFirst({
      where: { id: req.user.id },
    });
    if (!userIdExists) {
      throw new MyServicesError('User not found', HttpStatus.NOT_FOUND);
    }

    // ----- Generate a unique internal reference -----
    if (data.name) {
      internalRef = `CLT-FR-${data.name.trim().replace(/\s+/g, '-')}`;
    } else {
      internalRef = `CLT-FR-${uuidv4()}`;
    }

    // Check if the client already exists
    const existingClient = await this.prisma.client.findFirst({
      where: { internalRef },
    });

    if (existingClient) {
      throw new MyServicesError('Client already exists', HttpStatus.CONFLICT);
    }

    try {
      // prepare data to create the client in the database
      // add userId from the request to the data object
      const dataCleaned = {
        ...data,
        internalRef,
        userId: req.user.id,
      };

      // Create the client
      const createdClient = await this.prisma.client.create({
        data: dataCleaned,
      });

      // Return the created client with the correct type
      return plainToInstance(CreateClientResponseDto, createdClient);
    } catch (error) {
      throw new MyServicesError(
        error instanceof Error
          ? error.message
          : 'An unknow error occurred while creating the client',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

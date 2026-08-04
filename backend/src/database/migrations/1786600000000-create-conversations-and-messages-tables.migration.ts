import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateConversationsAndMessagesTables1786600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Conversations
    await queryRunner.createTable(
      new Table({
        name: 'conversations',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
            default: "'DIRECT'",
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Conversation Participants
    await queryRunner.createTable(
      new Table({
        name: 'conversation_participants',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'conversationId',
            type: 'uuid',
          },
          {
            name: 'userId',
            type: 'uuid',
          },
          {
            name: 'lastReadAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_conversation_participants_conversation',
            columnNames: ['conversationId'],
            referencedTableName: 'conversations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: 'FK_conversation_participants_user',
            columnNames: ['userId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );

    // Messages
    await queryRunner.createTable(
      new Table({
        name: 'messages',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'conversationId',
            type: 'uuid',
          },
          {
            name: 'senderId',
            type: 'uuid',
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'mediaUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'mediaType',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_messages_conversation',
            columnNames: ['conversationId'],
            referencedTableName: 'conversations',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
          new TableForeignKey({
            name: 'FK_messages_sender',
            columnNames: ['senderId'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('messages', true);
    await queryRunner.dropTable('conversation_participants', true);
    await queryRunner.dropTable('conversations', true);
  }
}

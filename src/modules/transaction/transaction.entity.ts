import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';

export enum TransactionStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum UserType {
    SEEKER = 'seeker',
    COMPANY = 'company',
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'varchar',
        length: 24,
    })
    userId!: string;

    @Column({
        type: 'enum',
        enum: UserType,
    })
    userType!: UserType;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    amount!: number;

    @Column({
        type: 'varchar',
        length: 3,
        default: 'USD',
    })
    currency!: string;

    @Column({
        type: 'varchar',
        nullable: true,
    })
    paymentIdentifier?: string;

    @Column({
        type: 'json',
        nullable: true,
    })
    metadata?: Record<string, any>;

    @Column({
        type: 'enum',
        enum: TransactionStatus,
        default: TransactionStatus.PENDING,
    })
    status!: TransactionStatus;

    // Timestamps
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}

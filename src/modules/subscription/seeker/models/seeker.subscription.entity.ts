import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum SubscriptionPlan {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
}

@Entity('seeker_subscription_plans')
export class SeekerSubscriptionPlan {
    @PrimaryGeneratedColumn('uuid')  
    id!: string;

    @Column({
        type: 'varchar',
        length: 24,  
    })
    userId!: string;  

    @Column({
        type: 'enum',
        enum: SubscriptionPlan,
        default: SubscriptionPlan.FREE,
    })
    plan!: SubscriptionPlan; 

    @Column({
        type: 'varchar',
        nullable: true,
    })
    paymentIdentifier?: string | null; 

    @Column({
        type: 'int',
        default: 5,
    })
    jobApplicationsPerMonth!: number;  

    @Column({
        type: 'boolean',
        default: false,
    })
    canMessageAllSeekers!: boolean;  

    @Column({
        type: 'boolean',
        default: false,
    })
    canMessageOnlySeekers!: boolean; 
}

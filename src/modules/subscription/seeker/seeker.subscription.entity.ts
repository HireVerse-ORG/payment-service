import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum SubscriptionPlan {
    FREE = 'free',
    BASIC = 'basic',
    PREMIUM = 'premium',
}

@Entity('seeker_subscription_plan')
export class SeekerSubscriptionPlan {
    @PrimaryGeneratedColumn()
    id!: number;

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
        length: 255,
        unique: true,
    })
    stripeCustomerId!: string;  

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

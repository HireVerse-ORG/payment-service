/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export default  {
    // seeker
    SeekerSubscriptionController: Symbol('SeekerSubscriptionController'),
    SeekerSubscriptionGrpcController: Symbol('SeekerSubscriptionGrpcController'),
    SeekerSubscriptionService: Symbol('SeekerSubscriptionService'),
    SeekerSubscriptionRepository: Symbol('SeekerSubscriptionRepository'),

    SeekerSubscriptionUsageController: Symbol('SeekerSubscriptionUsageController'),
    SeekerSubscriptionUsageGrpcController: Symbol('SeekerSubscriptionUsageGrpcController'),
    SeekerSubscriptionUsageService: Symbol('SeekerSubscriptionUsageService'),
    SeekerSubscriptionUsageRepository: Symbol('SeekerSubscriptionUsageRepository'),

    // company
    CompanySubscriptionController: Symbol('CompanySubscriptionController'),
    CompanySubscriptionGrpcController: Symbol('CompanySubscriptionGrpcController'),
    CompanySubscriptionService: Symbol('CompanySubscriptionService'),
    CompanySubscriptionRepository: Symbol('CompanyProfileRepository'),

    CompanySubscriptionUsageController: Symbol('CompanySubscriptionUsageController'),
    CompanySubscriptionUsageGrpcController: Symbol('CompanySubscriptionUsageGrpcController'),
    CompanySubscriptionUsageService: Symbol('CompanySubscriptionUsageService'),
    CompanySubscriptionUsageRepository: Symbol('CompanySubscriptionUsageRepository'),
    
    // Payment
    PaymentAdapter: Symbol('PaymentAdapter'),
    PaymentService: Symbol('PaymentService'),

    // webhook
    WebhookController: Symbol('WebhookController'),
};

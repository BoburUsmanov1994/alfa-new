export const URLS = {
    login: 'api/auth/login',
    signUp: 'auth/signup',
    getMe: 'api/auth/get-me',
    regions: 'api/references/region',
    insuranceForm: 'api/references/insurance-form',
    districts: 'api/references/district',
    branches: 'api/branch',
    objectType: 'api/references/insurance-object-type',
    object: 'api/references/insurance-object',
    policyType: 'api/references/policy-type',
    riskType: 'api/references/risk-type',
    risk: 'api/references/risk',
    role: 'api/user/role',
    insuranceClass: 'api/references/insurance-class',
    subclasses: 'subclasses',
    sectorType: 'api/references/sector-type',
    policyFormat: 'api/references/policy-format',
    groupsofproducts: 'api/product/group',
    subgroupsofproducts: 'api/product/subgroup',
    applicationForm: 'api/references/application-form',
    contractForm: 'api/references/contract-form',
    additionaldocuments: 'api/references/additional-documents',
    claimSettlement: 'api/references/claim-settlement',
    typeofrefund: 'api/references/refund-type',
    typeoffranchise: 'api/references/franchise-type',
    products: 'api/product/list',
    product: 'api/product',
    productCreate: 'api/product',
    personType: 'api/references/person-type',
    statusofproduct: 'api/product/status',
    agents: 'api/agent',
    bank: 'api/bank',
    typeofpayment: 'api/references/payment-type',
    baseoffranchise: 'api/references/franchise-base',
    subgroupsofproductsFilter: 'api/product/subgroup/list',
    riskFilter: 'risk',
    tengebankContracts: 'integ/tengebank/contracts',
    translations: 'api/references/translation',
    accountroles: 'api/agent/role',
    accountstatus: 'api/agent/status',
    userStatus: 'api/user/status',
    typeofagent: 'api/agent/type',
    citizenship: 'citizenship',
    genders: 'api/references/gender',
    position: 'api/employee/pozition',
    typeofdocuments: 'typeofdocuments',
    levelofbranch: 'api/branch/level',
    branchStatus: 'api/branch/status',
    typeofdocumentsformanager: 'typeofdocumentsformanager',
    reasons: 'api/references/reason',
    agreements: 'api/agreement',
    endorsementType: 'api/references/endorsement-type',
    endorsementStatus: 'api/references/endorsement-status',
    fieldofendorsements: 'fieldofendorsements',
    productsfilter: 'products',
    agentsfilter: 'agreements/agentsfilter',
    paymentCurrency: 'api/references/payment-currency',
    districtsByRegion: 'districts/reg',
    objectFilterByType: 'object/type',
    policy: 'api/policy',
    bcoPolicyStatus: 'api/bco/policy-status',
    paymentStatus: 'api/references/payment-status',
    endorsements: 'api/endorsement',
    policyFilter: 'api/policy/list',
    endorsementFilter: 'endorsements/f',
    transactions: 'api/transaction',
    transactionlog: 'transactionlog',
    transactionExcel: 'transactionlog/f/exel',
    distributeType: 'api/distribute-type',
    statusbcopolicy: 'statusbcopolicy',
    actstatus: 'api/act/status',
    acts: 'api/act',
    bco: 'api/bco',
    bcoType: 'api/bco/type',
    bcoLanguage: 'api/bco/language',
    bcoStatus: 'api/bco/type-status',
    warehouse: 'api/warehouse',
    user: 'api/user',
    clients: 'api/client',
    policyblank: 'api/bco/blank',
    statusoftypebco: 'statusoftypebco',
    checkBlank: 'acts/f/cheakblank',
    clientsFind: 'clients/f/inn',
    employee: 'api/employee',
    objectFields: 'typeofobject/inputs',
    sendToFond: 'api/agreement/send',
    orgInfo: 'provider/orginfo',
    personalInfo: 'provider/personalinfo',
    transactionAgreements: 'api/transaction/agreements',
    transactionPolicies: 'api/transaction/policies',
    transactionAttach: 'api/transaction/attach',
    osagoTransactionAttach: 'api/osago/attach',
    osgorTransactionAttach: 'api/osgor/attach',
    osgopTransactionAttach: 'api/osgop/attach',
    smrTransactionAttach: 'api/smr/attach',
    transactionDistribute: 'api/transaction/distribute',
    ownershipForms: 'api/references/ownership-form',
    organizationInfoProvider: 'api/provider/organization-info',
    personalInfoProvider: 'api/provider/personal-info',
    residentTypes: 'api/references/resident-type',
    countries: 'api/references/country',
    areaTypes: 'api/references/area-types',
    okeds: 'api/references/okeds',
    vehicleType: 'api/references/vehicle-type',
    propertyType: 'api/references/property-type',
    propertyRightType: 'api/references/property-right-type',
    agriculturalType: 'api/references/agricultural-type',
    measurementType: 'api/references/measurement-type',
    act: 'api/act',
    actStatus: 'api/act/status',
    findOrCreateClient: 'api/client/find-or-create',
    residentType: 'api/references/resident-type/list',
    documentType: 'api/references/document-type',
    account: 'api/account',
    transactionLogs: 'api/transaction/log',
    acceptOrDenyAct: 'api/act/action',
    osgorCreate: 'api/osgor/create',
    osgorList: 'api/osgor/list',
    osgorView: 'api/osgor/show',
    osgorDelete: 'api/osgor/delete',
    osgorEdit: 'api/osgor/edit',
    osgorSendFond: 'api/osgor/send',
    osgorConfirmPayment: 'api/osgor/confirm-payed',
    osgorCheckPayment: 'api/osgor/check-payment',
    osgorEpolis: 'api/osgor/get-e-polis',
    osgopCreate: 'api/osgop/create',
    osgopView: 'api/osgop/show',
    osgopDelete: 'api/osgop/delete',
    osgopList: 'api/osgop/list',
    osgopConfirmPayment: 'api/osgop/confirm-payed',
    osgopCheckPayment: 'api/osgop/check-payment',
    osgopEpolis: 'api/osgop/get-e-polis',
    osgopSendFond: 'api/osgop/send',
    personalInfoNonCitizenProvider: 'api/provider/personal-info-non-citizen',
    vehicleInfoProvider: 'api/provider/vehicle-info',
    vehicleInfoForeignProvider: 'api/provider/vehicle-info-foreign',
    driverLicenceProvider: 'api/provider/driver-licence',
    passengerLicenceProvider: 'api/provider/passenger-licence',
    isPensionerProvider: 'api/provider/is-pensioner',
    isDisabledProvider: 'api/provider/is-disabled',
    insuranceTerms: 'api/references/insurance-terms',
    agencies: 'api/references/agencies',
    vehicleTypes: 'api/references/vehicle-type',
    activityAndRisk: 'api/references/activity-and-risks',
    osgorCalculate: 'api/osgor/calculate',
    getRatio: 'api/osgop/ratio',
    osgopCalculate: 'api/osgop/calculate',

    osagoCreate: 'api/osago/osago-form-create',
    osagoView: 'api/osago/show',
    osagoList: 'api/osago/osago-form-list',
    osagoDelete: 'api/osago/osago-form-delete',
    osagoEdit: 'api/osago/osago-form-edit',
    osagoSend: 'api/osago/osago-form-send',
    osagoConfirmPayment: 'api/osago/confirm-payed',
    osagoCheckPayment: 'api/osago/check-payment',
    ePolis: 'api/osago/get-e-polis',
    osagoPersonalInfoProvider: 'api/osago/personal-info',
    osagoOrganizationInfoProvider: 'api/osago/organization-info',
    osagoDriverLicenceProvider: 'api/osago/driver-licence',
    osagoPassengerLicenceProvider: 'api/v1/external-clients/passenger-licence',
    osagoIsPensionerProvider: 'api/osago/is-pensioner',
    osagoIsDisabledProvider: 'api/osago/is-disabled',
    osagoRegions: 'api/osago/regions',
    osagoDistricts: 'api/osago/districts',
    osagoGenders: 'api/osago/genders',
    osagoResidentTypes: 'api/osago/resident-types',
    osagoInsuranceTerms: 'api/osago/terms',
    calculator: 'api/osago/calc-insurance',
    termCategories: 'api/osago/term-categories',
    accidentTypes: 'api/osago/accident-types',
    discounts: 'api/osago/discounts',
    vehicleInfo: 'api/osago/vehicle-info',
    osagoVehicleTypes: 'api/osago/vehicle-types',
    driverTypes: 'api/osago/driver-types',
    osagoCountries: 'api/osago/driver-types',
    driverInfo: 'api/osago/driver-info',
    relatives: 'api/osago/relatives',

    smrCreate: 'api/smr/create',
    smrList: 'api/smr/list',
    smrView: 'api/smr/show',
    smrDelete: 'api/smr/delete',
    smrEdit: 'api/smr/edit',
    smrSendFond: 'api/smr/send',
    smrConfirmPayment: 'api/smr/confirm-payment',
    smrCheckPayment: 'api/smr/check-payment',
    smrEpolis: 'api/smr/get-e-polis',
    smrCalculate: 'api/smr/calculate',
    smrContractForm: 'api/smr/police-upload',
    getPolisFile: 'api/smr/get-polis-file',
    calculate: 'api/smr/calculate',
    smrDistribute: 'api/smr/distribute',
    smrAttach: 'api/smr/attach',
    getCadastrInfo: 'api/provider/property-info',
    agentCommission: 'api/agent/commission',
    file: 'api/file',
    agentAgreement: 'api/agent/agreement',
    policyByAgent: 'api/policy/byAgent',
    agentAct: 'api/agent/act',
    agentActBlank: 'api/agent/act/blank',
    agentActReport: 'api/agent/act/report',
    agentActBordero: 'api/agent/act/bordero',
    agentActStatus: 'api/agent/act/status',
    agentActList: 'api/agent/act/list',
    showFile: 'api/file/show',
    otherObjectType: 'api/references/other-type/list',
    agreementWeeklyReport: 'api/agreement/weekly/report',
    specificList: 'api/branch/specific/list',
    unattachPolicy: 'api/transaction/unattach-all',
    currencyList: 'api/references/currency/list',
    eimzoChallenge: 'api/eimzo/challenge',
    eimzoPkcs7: 'api/eimzo/timestamp/pkcs7',
    agreementGtkDetails: 'api/agreement/gtk/details',
    agreementGtkSend: 'api/agreement/gtk/send',
    policyUseType: 'api/references/gtk-policy-use-type',
    policyIntentType: 'api/references/gtk-policy-intent-type',
}

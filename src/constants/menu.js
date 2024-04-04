export const menuData = [
    // {
    //     id: 1,
    //     title: 'Панель приборов',
    //     path: '/dashboard',
    // },
    {
        id: 7,
        title: 'Продукты',
        path: '/products',
        submenu: [
            {
                id: 1,
                title: 'Все продукты',
                path: '/products/all',
            },
            {
                id: 44,
                title: 'Группы продуктов',
                path: '/products/product-groups',
            },
            {
                id: 18,
                title: 'Подгруппы продуктов',
                path: '/products/product-subgroups',
            },
            {
                id: 19,
                title: 'Статус продукта',
                path: '/products/product-status',
            },
            // {
            //     id: 20,
            //     title: 'Agent product',
            //     path: '/products/agent-product',
            // },
            // {
            //     id: 21,
            //     title: 'Tenge bank contracts',
            //     path: '/products/tengebank-contracts',
            // },
            // {
            //     id: 22,
            //     title: 'Agreements',
            //     path: '/agreements',
            // },
            // {
            //     id: 2,
            //     title: 'Классы страхования',
            //     path: '/products/insurance-classes',
            // },
            // {
            //     id: 3,
            //     title: 'Риски',
            //     path: '/products/risks',
            // },
            // {
            //     id: 6,
            //     title: 'Страховые продукты',
            //     path: '/products/insurance-products',
            // },
            // {
            //     id: 7,
            //     title: 'Вординги',
            //     path: '/products/wordings',
            // },
        ]
    },
    {
        id: 222,
        title: 'Соглашения',
        path: '/agreements',
    },
    {
        id: 2,
        title: 'Клиенты',
        path: '/clients',
        submenu: [
            {
                id: 1,
                title: 'Физические лица',
                path: '/clients/physical',
            },
            {
                id: 2,
                title: 'Юридические лица',
                path: '/clients/juridical',
            },
            {
                id: 5,
                title: 'Тип человека',
                path: '/clients/person-type',
            }
        ]
    },
    {
        id: 8,
        title: 'Агенты',
        path: '/agents',
        submenu: [
            {
                id: 1,
                title: 'Страховые агенты',
                path: '/agents/insurance-agents',
            },
            {
                id: 2,
                title: 'Agent types',
                path: '/agents/types',
            },
            {
                id: 3,
                title: 'Agent roles',
                path: '/agents/roles',
            },
            {
                id: 4,
                title: 'Agent status',
                path: '/agents/status',
            },
            {
                id: 5,
                title: 'Bank',
                path: '/agents/bank',
            },
        ]
    },
    {
        id: 222,
        title: 'Аккаунты',
        path: '/accounts',
        submenu: [
            {
                id: 1,
                title: 'Users',
                path: '/accounts/list',
            },
            {
                id: 2,
                title: 'Account role',
                path: '/accounts/role',
            },
            {
                id: 3,
                title: 'Account status',
                path: '/accounts/status',
            },

        ]
    },
    {
        id: 111,
        title: 'Филиалы и сотрудники',
        path: '/branches',
        submenu: [
            {
                id: 1,
                title: 'Филиалы',
                path: '/branches/list',
            },
            {
                id: 2,
                title: 'Employees',
                path: '/branches/employees',
            },
            {
                id: 3,
                title: 'Position',
                path: '/branches/position',
            },
            {
                id: 31,
                title: 'Branch level',
                path: '/handbook/branch-level',
            },
            {
                id: 32,
                title: 'Branch status',
                path: '/handbook/branch-status',
            },
        ]
    },
    {
        id: 3,
        title: 'Бухгалтерия',
        path: '/accounting',
        submenu: [
            {
                id: 1,
                title: 'Импорт платёжные документы',
                path: '/accounting/import-payment-documents',
            },
            // {
            //     id: 2,
            //     title: 'Распределение',
            //     path: '/accounting/distribution',
            // },
            // {
            //     id: 3,
            //     title: 'Тип распределения',
            //     path: '/accounting/distribution-type',
            // },
            {
                id: 4,
                title: 'К полису',
                path: '/accounting/policy',
            },
            {
                id: 5,
                title: 'ACTS',
                path: '/accounting/act',
            },
            // {
            //     id: 55,
            //     title: 'BCO list',
            //     path: '/accounting/bco',
            // },
            // {
            //     id: 6,
            //     title: 'BCO Type',
            //     path: '/accounting/bco-type',
            // },
            // {
            //     id: 66,
            //     title: 'BCO language',
            //     path: '/handbook/bco-language-policy',
            // },
            // {
            //     id: 666,
            //     title: 'BCO blanks',
            //     path: '/accounting/bco-blanks',
            // },
            {
                id: 7,
                title: 'Warehouse',
                path: '/accounting/warehouse',
            }

        ]
    },
    {
        id: 2,
        title: 'БСО',
        path: '/bco',
        submenu: [
            {
                id: 11,
                title: 'БСО',
                path: '/bco',
            },
            {
                id: 1,
                title: 'Тип БСО',
                path: '/bco/type',
            },
            {
                id: 2,
                title: 'БСО статус полиса',
                path: '/bco/policy-status',
            },
            {
                id: 3,
                title: 'БСО статус',
                path: '/bco/status',
            },
            {
                id: 4,
                title: 'БСО язык',
                path: '/bco/language',
            },
        ]
    },


    // {
    //     id: 4,
    //     title: 'Страховой',
    //     path: '/insurance',
    //     submenu: [
    //         {
    //             id: 1,
    //             title: 'Прямое страхование',
    //             path: '/insurance/direct-insurance',
    //         },
    //         {
    //             id: 2,
    //             title: 'Входящее перестрахование',
    //             path: '/insurance/incoming-reinsurance',
    //         },
    //         {
    //             id: 3,
    //             title: 'Исходящее перестрахование',
    //             path: '/insurance/outgoing-reinsurance',
    //         },
    //         {
    //             id: 4,
    //             title: 'Обмен данными',
    //             path: '/insurance/data-exchange',
    //         }
    //     ]
    // },
    // {
    //     id: 5,
    //     title: 'Претензионый портфель',
    //     path: '/portfolio',
    //     submenu: [
    //         {
    //             id: 1,
    //             title: 'Документооборот по претензиям',
    //             path: '/portfolio/paperwork',
    //         },
    //         {
    //             id: 2,
    //             title: 'Страховые дела',
    //             path: '/portfolio/insurance-cases',
    //         },
    //         {
    //             id: 3,
    //             title: 'Страховой комитет',
    //             path: '/portfolio/insurance-committee',
    //         },
    //         {
    //             id: 4,
    //             title: 'Регрессы / Суброгация',
    //             path: '/insurance/recourses-subrogation',
    //         }
    //     ]
    // },
    // {
    //     id: 6,
    //     title: 'Бланки полисов',
    //     path: '/policy-blanks',
    //     submenu: [
    //         {
    //             id: 1,
    //             title: 'Распределение бланков',
    //             path: '/policy-blanks/form-distribution',
    //         },
    //         {
    //             id: 2,
    //             title: 'Отчет по бланкам',
    //             path: '/policy-blanks/form-report',
    //         },
    //     ]
    // },


    // {
    //     id: 9,
    //     title: 'Отчёты',
    //     path: '/reports',
    // },

    {
        id: 10,
        title: 'Справочники',
        path: '/handbook',
        submenu: [

            {
                id: 3,
                title: 'Регионы',
                path: '/handbook/regions',
            },
            {
                id: 4,
                title: 'Districts',
                path: '/handbook/districts',
            },
            {
                id: 444,
                title: 'Insurance form',
                path: '/handbook/insurance-form',
            },
            {
                id: 5,
                title: 'Объект страхования',
                path: '/handbook/object',
            },
            {
                id: 6,
                title: 'Вид объекта страхования',
                path: '/handbook/object-type',
            },
            {
                id: 8,
                title: 'Тип полиции',
                path: '/handbook/police-type',
            },
            {
                id: 9,
                title: 'Тип риска',
                path: '/handbook/risk-type',
            },
            {
                id: 10,
                title: 'Риск',
                path: '/handbook/risk',
            },
            // {
            //     id: 11,
            //     title: 'Ролевой аккаунт',
            //     path: '/handbook/role',
            // },
            {
                id: 12,
                title: 'Класс страхования',
                path: '/handbook/insurance-classes',
            },
            // {
            //     id: 13,
            //     title: 'Подкласс страхования',
            //     path: '/handbook/insurance-subclasses',
            // },
            {
                id: 14,
                title: 'Тип сектора',
                path: '/handbook/sector-type',
            },
            {
                id: 15,
                title: 'Формат полиса',
                path: '/handbook/policy-formats',
            },
            // {
            //     id: 16,
            //     title: 'Тип страховщика',
            //     path: '/handbook/insurer-type',
            // },
            {
                id: 19,
                title: 'Документы формы заявки',
                path: '/handbook/application-form-docs',
            },
            {
                id: 20,
                title: 'Форма контракта',
                path: '/handbook/contract-form',
            },
            {
                id: 21,
                title: 'Дополнительные документы',
                path: '/handbook/additional-documents',
            },
            {
                id: 22,
                title: 'Тип урегулирование претензии',
                path: '/handbook/settlement-claim-type',
            },
            {
                id: 23,
                title: 'Тип возврата',
                path: '/handbook/refund-type',
            },
            {
                id: 24,
                title: 'Тип франшизы',
                path: '/handbook/franchise-type',
            },
            {
                id: 24,
                title: 'База франшизы',
                path: '/handbook/franchise-base',
            },
            {
                id: 25,
                title: 'Способ оплаты',
                path: '/handbook/payment-type',
            },
            {
                id: 28,
                title: 'Genders',
                path: '/handbook/genders',
            },

            {
                id: 34,
                title: 'Reasons',
                path: '/handbook/reasons',
            },
            {
                id: 35,
                title: 'Typeofendorsements',
                path: '/handbook/typeofendorsements',
            },
            {
                id: 36,
                title: 'Status endorsements',
                path: '/handbook/endorsements-status',
            },
            {
                id: 37,
                title: 'Payment currency',
                path: '/handbook/payment-currency',
            },
            {
                id: 38,
                title: 'Policy status',
                path: '/handbook/policy-status',
            },
            {
                id: 39,
                title: 'Payment status',
                path: '/handbook/payment-status',
            },
            {
                id: 41,
                title: 'Vehicle type',
                path: '/handbook/vehicle-type',
            },
            {
                id: 42,
                title: 'Property type',
                path: '/handbook/property-type',
            },
            {
                id: 46,
                title: 'Property right type',
                path: '/handbook/property-right-type',
            },
            {
                id: 43,
                title: 'Agricultural type',
                path: '/handbook/agricultural-type',
            },
            {
                id: 44,
                title: 'Measurement type',
                path: '/handbook/measurement-type',
            },
            {
                id: 45,
                title: 'Document type',
                path: '/handbook/document-type',
            },
            // {
            //     id: 26,
            //     title: 'Translations',
            //     path: '/handbook/translations',
            // },
        ]
    },
    {
        id: 222,
        title: 'Translations',
        path: '/handbook/translations',
    },
    // {
    //     id: 11,
    //     title: 'Администрирование',
    //     path: '/settings',
    // },
]
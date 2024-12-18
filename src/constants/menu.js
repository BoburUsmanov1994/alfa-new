import {includes} from "lodash";
import config from "../config";

export const menuData = (role) => [
    includes([config.ROLES.admin],role) && {
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
        ]
    },
    includes([config.ROLES.admin, config.ROLES.user],role) && {
        id: 222,
        title: 'Соглашения',
        path: '/agreements',
    },
    includes([config.ROLES.admin, config.ROLES.user],role) && {
        id: 2,
        title: 'Клиенты',
        path: '/clients',
        submenu: [
            includes([config.ROLES.admin, config.ROLES.user],role) && {
                id: 1,
                title: 'Физические лица',
                path: '/clients/physical',
            },
            includes([config.ROLES.admin, config.ROLES.user],role) && {
                id: 2,
                title: 'Юридические лица',
                path: '/clients/juridical',
            },
            includes([config.ROLES.admin],role) && {
                id: 5,
                title: 'Тип человека',
                path: '/clients/person-type',
            }
        ]
    },
    includes([config.ROLES.admin],role) && {
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
            {
                id: 6,
                title: 'Комиссия и РПМ',
                path: '/agents/commission',
            },
            {
                id: 7,
                title: 'Подготовка актов выполненных работ',
                path: '/agents/report',
            },
            {
                id: 8,
                title: 'Управления актами выполненных работ',
                path: '/agents/report-control',
            },
        ]
    },
    includes([config.ROLES.admin],role) && {
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
    includes([config.ROLES.admin],role) && {
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
            {
                id: 33,
                title: 'Банк реквизиты филиалов',
                path: '/handbook/branch-bank-settings',
            },
        ]
    },
    includes([config.ROLES.admin],role) &&  {
        id: 3,
        title: 'Бухгалтерия',
        path: '/accounting',
        submenu: [
            {
                id: 1,
                title: 'Импорт платёжные документы',
                path: '/accounting/import-payment-documents',
            },
            {
                id: 2,
                title: 'Распределение',
                path: '/accounting/distribution',
            },
            {
                id: 3,
                title: 'Тип распределения',
                path: '/accounting/distribution-type',
            },
            {
                id: 4,
                title: 'К полису',
                path: '/accounting/policy',
            },
            {
                id: 55,
                title: 'Счета',
                path: '/accounting/account',
            },
            {
                id: 6,
                title: 'Transaction logs',
                path: '/accounting/transaction-logs',
            },

        ]
    },
    includes([config.ROLES.admin, config.ROLES.user],role) && {
        id: 2,
        title: 'БСО',
        path: '/bco',
        submenu: [
            includes([config.ROLES.admin],role) && {
                id: 11,
                title: 'БСО',
                path: '/bco',
            },
            includes([config.ROLES.admin],role) && {
                id: 1,
                title: 'Тип БСО',
                path: '/bco/type',
            },
            includes([config.ROLES.admin],role) && {
                id: 2,
                title: 'БСО статус полиса',
                path: '/bco/policy-status',
            },
            includes([config.ROLES.admin],role) && {
                id: 3,
                title: 'БСО статус',
                path: '/bco/status',
            },
            includes([config.ROLES.admin],role) && {
                id: 4,
                title: 'БСО язык',
                path: '/bco/language',
            },
            includes([config.ROLES.admin],role) && {
                id: 5,
                title: 'БСО blanks',
                path: '/accounting/bco-blanks',
            },
            includes([config.ROLES.admin, config.ROLES.user],role) && {
                id: 6,
                title: 'ACTS',
                path: '/accounting/act',
            },
            includes([config.ROLES.admin],role) && {
                id: 7,
                title: 'Act status',
                path: '/bco/act-status',
            },
            includes([config.ROLES.admin],role) && {
                id: 8,
                title: 'Warehouse',
                path: '/accounting/warehouse',
            }
        ]
    },
    includes([config.ROLES.admin,config.ROLES.endorsement],role) && {
        id: 2222,
        title: 'Индоссамент',
        path: '/endorsement',
    },
    includes([config.ROLES.admin,config.ROLES.osgop,config.ROLES.osgor, config.ROLES.user],role) && {
        id: 300,
        title: 'Страховой',
        path: '/insurance',
        submenu: [
            includes([config.ROLES.admin,config.ROLES.osgor, config.ROLES.user],role) &&{
                id: 1,
                title: 'ОСГОР',
                path: '/insurance/osgor',
            },
            includes([config.ROLES.admin,config.ROLES.osgop, config.ROLES.user],role) && {
                id: 2,
                title: 'ОСГОП',
                path: '/insurance/osgop',
            },
            includes([config.ROLES.admin],role) && {
                id: 3,
                title: 'ОСАГО',
                path: '/insurance/osago',
            },
            includes([config.ROLES.admin, config.ROLES.user],role) && {
                id: 4,
                title: 'СМР',
                path: '/insurance/smr',
            },
            includes([config.ROLES.admin],role) &&{
                id: 5,
                title: 'СМР Распределение',
                path: '/insurance/smr/distribute',
            }
        ]
    },

    includes([config.ROLES.admin],role) && {
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
        ]
    },
    includes([config.ROLES.admin],role) && {
        id: 222,
        title: 'Translations',
        path: '/handbook/translations',
    },
]
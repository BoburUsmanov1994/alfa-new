import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import AuthLayout from "../layouts/auth-layout";
import LoginPage from "../modules/auth/pages/LoginPage";
import SignUpPage from "../modules/auth/pages/SignUpPage";
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import NotFoundPage from "../modules/auth/pages/NotFoundPage";
import {OverlayLoader} from "../components/loader";
import AgreementsPage from "../modules/products/pages/AgreementsPage";
import AgreementCreatePage from "../modules/products/pages/AgreementCreatePage";
import EndorsementsStatusPage from "../modules/handbook/pages/EndorsementsStatusPage";
import PolicyStatusPage from "../modules/handbook/pages/PolicyStatusPage";
import PaymentStatusPage from "../modules/handbook/pages/PaymentStatusPage";
import EndorsementCreatePage from "../modules/policy/pages/EndorsementCreatePage";
import ImportPaymentDocumentsPage from "../modules/accounting/pages/ImportPaymentDocumentsPage";
import DistributionPage from "../modules/accounting/pages/DistributionPage";
import DistributionTypeContainer from "../modules/accounting/containers/DistributionTypeContainer";
import PolicyDistributionPage from "../modules/accounting/pages/PolicyDistributionPage";
import BCOLanguagePolicyPage from "../modules/handbook/pages/BCOLanguagePolicyPage";
import BCOPage from "../modules/handbook/pages/BCOPage";
import AddActPage from "../modules/handbook/pages/AddActPage";
import BCOJournalPage from "../modules/handbook/pages/BCOJournalPage";
import WarehousePage from "../modules/handbook/pages/WarehouselPage";
import AddPoliceBlankPage from "../modules/handbook/pages/AddPoliceBlankPage";
import UsersPage from "../modules/users/pages/UsersPage";
import ClientsPage from "../modules/clients/pages/ClientsPage";
import ClientCreatePage from "../modules/clients/pages/ClientCreatePage";
import BcoTypePage from "../modules/bco/pages/BcoTypePage";
import BcoBlankPage from "../modules/accounting/pages/PolicyBlankPage";
import BcoPage from "../modules/bco/pages/BcoPage";
import LogOutPage from "../modules/auth/pages/LogOutPage";
import InsuranceFormPage from "../modules/handbook/pages/InsuranceFormPage";
import JuridicalClientCreatePage from "../modules/clients/pages/JuridicalClientCreatePage";
import JuridicalClientsPage from "../modules/clients/pages/JuridicalClientsPage";
import VehicleTypePage from "../modules/handbook/pages/VehicleTypePage";
import PropertyTypePage from "../modules/handbook/pages/PropertyTypePage";
import PropertyRightTypePage from "../modules/handbook/pages/PropertyRightTypePage";
import AgriculturalTypePage from "../modules/handbook/pages/AgriculturalTypePage";
import MeasurementTypePage from "../modules/handbook/pages/MeasurementTypePage";
import BcoStatusPage from "../modules/bco/pages/BcoStatusPage";
import BcoLanguagePage from "../modules/bco/pages/BcoLanguagePage";
import BcoPolicyStatusPage from "../modules/bco/pages/BcoPolicyStatusPage";
import UserStatusPage from "../modules/users/pages/UserStatusPage";
import BankPage from "../modules/agents/pages/BankPage";
import BankCreatePage from "../modules/agents/pages/BankCreatePage";
import AccountPage from "../modules/accounting/pages/AccountPage";
import BcoActStatusPage from "../modules/bco/pages/BcoActStatusPage";
import TransactionLogsPage from "../modules/accounting/pages/TransactionLogsPage";
//lazy load
const TypeObjectPage = lazy(() => import("../modules/handbook/pages/TypeObjectPage"));
const ObjectPage = lazy(() => import("../modules/handbook/pages/ObjectPage"));
const TypePolicePage = lazy(() => import("../modules/handbook/pages/TypePolicePage"));
const TypeRiskPage = lazy(() => import("../modules/handbook/pages/TypeRiskPage"));
const RiskPage = lazy(() => import("../modules/handbook/pages/RiskPage"));
const RolePage = lazy(() => import("../modules/handbook/pages/RolePage"));
const InsuranceClassPage = lazy(() => import("../modules/handbook/pages/InsuranceClassPage"));
const InsuranceSubClassPage = lazy(() => import("../modules/handbook/pages/InsuranceSubClassPage"));
const SectorTypePage = lazy(() => import("../modules/handbook/pages/SectorTypePage"));
const PolicyFormatsPage = lazy(() => import("../modules/handbook/pages/PolicyFormatsPage"));
const InsurerTypePage = lazy(() => import("../modules/handbook/pages/InsurerTypePage"));
const ProductGroupsPage = lazy(() => import("../modules/products/pages/ProductGroupsPage"));
const ProductSubGroupsPage = lazy(() => import("../modules/products/pages/ProductSubGroupsPage"));
const ApplicationFormDocsPage = lazy(() => import("../modules/handbook/pages/ApplicationFormDocsPage"));
const ContractFormPage = lazy(() => import("../modules/handbook/pages/ContractFormPage"));
const AdditionalDocumentsPage = lazy(() => import("../modules/handbook/pages/AdditionalDocumentsPage"));
const SettlementClaimTypePage = lazy(() => import("../modules/handbook/pages/SettlementClaimTypePage"));
const RefundTypePage = lazy(() => import("../modules/handbook/pages/RefundTypePage"));
const FranchiseTypePage = lazy(() => import("../modules/handbook/pages/FranchiseTypePage"));
const ProductsPage = lazy(() => import("../modules/products/pages/ProductsPage"));
const PersonTypePage = lazy(() => import("../modules/clients/pages/PersonTypePage"));
const ProductStatusPage = lazy(() => import("../modules/products/pages/ProductStatusPage"));
const AgentsPage = lazy(() => import("../modules/agents/pages/AgentsPage"));
const ProductCreatePage = lazy(() => import("../modules/products/pages/ProductCreatePage"));
const PaymentTypePage = lazy(() => import("../modules/handbook/pages/PaymentTypePage"));
const FranchiseBasePage = lazy(() => import("../modules/handbook/pages/FranchiseBasePage"));
const ProductViewPage = lazy(() => import("../modules/products/pages/ProductViewPage"));
const ProductUpdatePage = lazy(() => import("../modules/products/pages/ProductUpdatePage"));
const AgentProductPage = lazy(() => import("../modules/products/pages/AgentProductPage"));
const TengeContractsPage = lazy(() => import("../modules/products/pages/TengeContractsPage"));
const TranslationsPage = lazy(() => import("../modules/handbook/pages/TranslationsPage"));
const CitizenshipPage = lazy(() => import("../modules/handbook/pages/CitizenshipPage"));
const GendersPage = lazy(() => import("../modules/handbook/pages/GendersPage"));
const PositionPage = lazy(() => import("../modules/handbook/pages/PositionPage"));
const DocumentTypePage = lazy(() => import("../modules/handbook/pages/DocumentTypePage"));
const BranchLevelPage = lazy(() => import("../modules/handbook/pages/BranchLevelPage"));
const BranchStatusPage = lazy(() => import("../modules/handbook/pages/BranchStatusPage"));
const BranchesPage = lazy(() => import("../modules/branches/pages/BranchesPage"));
const EmployeesPage = lazy(() => import("../modules/branches/pages/EmployeesPage"));
const EmployeeAddPage = lazy(() => import("../modules/branches/pages/EmployeeAddPage"));
const EmployeeViewPage = lazy(() => import("../modules/branches/pages/EmployeeViewPage"));
const BranchCreatePage = lazy(() => import("../modules/branches/pages/BranchCreatePage"));
const BranchViewPage = lazy(() => import("../modules/branches/pages/BranchViewPage"));
const BranchUpdatePage = lazy(() => import("../modules/branches/pages/BranchUpdatePage"));
const ManagerDocumentTypePage = lazy(() => import("../modules/handbook/pages/ManagerDocumentTypePage"));
const ReasonsPage = lazy(() => import("../modules/handbook/pages/ReasonsPage"));
const EndorsementstypePage = lazy(() => import("../modules/handbook/pages/EndorsementsTypePage"));
const PaymentCurrencyPage = lazy(() => import("../modules/handbook/pages/PaymentCurrencyPage"));

const DistrictsPage = lazy(() => import("../modules/handbook/pages/DistrictsPage"));
const RegionsPage = lazy(() => import("../modules/handbook/pages/RegionsPage"));
const AgentTypesPage = lazy(() => import("../modules/agents/pages/AgentTypesPage"));
const AgentRolesPage = lazy(() => import("../modules/agents/pages/AgentRolesPage"));
const AgentStatusPage = lazy(() => import("../modules/agents/pages/AgentStatusPage"));
const AgentCreatePage = lazy(() => import("../modules/agents/pages/AgentsCreatePage"));
const AgentUpdatePage = lazy(() => import("../modules/agents/pages/AgentUpdatePage"));
const AgentViewPage = lazy(() => import("../modules/agents/pages/AgentViewPage"));
const AgreementViewPage = lazy(() => import("../modules/products/pages/AgreementViewPage"));
const PolicyCreatePage = lazy(() => import("../modules/policy/pages/CreatePage"));


const OsgorListPage = lazy(() => import("../modules/insurance/osgor/pages/ListPage"));
const OsgorCreatePage = lazy(() => import("../modules/insurance/osgor/pages/CreatePage"));
const OsgorViewPage = lazy(() => import("../modules/insurance/osgor/pages/ViewPage"));


const Router = ({...rest}) => {
    return (
        <BrowserRouter>
            <Suspense fallback={<OverlayLoader/>}>
                <IsAuth>
                    <Routes>
                        <Route path={"/"} element={<MainLayout/>}>
                            <Route path={"dashboard"} index element={<DashboardPage/>}/>
                            <Route path={"products"}>
                                <Route index path={"all"} element={<ProductsPage/>}/>
                                <Route path={"product-groups"} element={<ProductGroupsPage/>}/>
                                <Route path={"product-subgroups"} element={<ProductSubGroupsPage/>}/>
                                <Route path={"product-status"} element={<ProductStatusPage/>}/>
                                <Route path={"create"} element={<ProductCreatePage/>}/>
                                <Route path={"view/:id"} element={<ProductViewPage/>}/>
                                <Route path={"update/:id"} element={<ProductUpdatePage/>}/>
                                <Route path={"agent-product"} element={<AgentProductPage/>}/>
                                <Route path={"tengebank-contracts"} element={<TengeContractsPage/>}/>
                            </Route>
                            <Route path={"agreements"}>
                                <Route index element={<AgreementsPage/>}/>
                                <Route path={"create"} element={<AgreementCreatePage/>}/>
                                <Route path={"view/:id"} element={<AgreementViewPage/>}/>
                            </Route>
                            <Route path={"clients"}>
                                <Route path={"person-type"} element={<PersonTypePage/>}/>
                                <Route path={"physical"} element={<ClientsPage/>}/>
                                <Route path={"juridical"} element={<JuridicalClientsPage/>}/>
                                <Route path={"physical/create"} element={<ClientCreatePage/>}/>
                                <Route path={"juridical/create"} element={<JuridicalClientCreatePage/>}/>
                            </Route>

                            <Route path={"accounts"}>
                                <Route path={"list"} element={<UsersPage/>}/>
                                <Route path={"role"} element={<RolePage/>}/>
                                <Route path={"status"} element={<UserStatusPage/>}/>
                            </Route>
                            <Route path={"agents"}>
                                <Route path={"insurance-agents"} element={<AgentsPage/>}/>
                                <Route path={"types"} element={<AgentTypesPage/>}/>
                                <Route path={"roles"} element={<AgentRolesPage/>}/>
                                <Route path={"status"} element={<AgentStatusPage/>}/>
                                <Route path={"create"} element={<AgentCreatePage/>}/>
                                <Route path={"update/:id"} element={<AgentUpdatePage/>}/>
                                <Route path={"view/:id"} element={<AgentViewPage/>}/>
                                <Route path={"bank"} element={<BankPage/>}/>
                                <Route path={"bank/create"} element={<BankCreatePage/>}/>
                            </Route>
                            <Route path={"accounting"}>
                                <Route path={"import-payment-documents"} element={<ImportPaymentDocumentsPage/>}/>
                                <Route path={"distribution"} element={<DistributionPage/>}/>
                                <Route path={"distribution-type"} element={<DistributionTypeContainer/>}/>
                                <Route path={"policy"} element={<PolicyDistributionPage/>}/>
                                <Route path={"act"} element={<BCOPage/>}/>
                                <Route path={"bco"} element={<BcoPage/>}/>
                                <Route path={"bco-journal"} element={<BCOJournalPage/>}/>
                                <Route path={"act/create"} element={<AddActPage/>}/>
                                <Route path={"warehouse"} element={<WarehousePage/>}/>
                                <Route path={"warehouse/create"} element={<AddPoliceBlankPage/>}/>
                                <Route path={"bco-type"} element={<BcoTypePage/>}/>
                                <Route path={"bco-blanks"} element={<BcoBlankPage/>}/>
                                <Route path={"account"} element={<AccountPage/>}/>
                                <Route path={"transaction-logs"} element={<TransactionLogsPage/>}/>
                            </Route>
                            <Route path={"branches"}>
                                <Route path={"list"} element={<BranchesPage/>}/>
                                <Route path={"employees"} element={<EmployeesPage/>}/>
                                <Route path={"position"} element={<PositionPage/>}/>
                                <Route path={"create"} element={<BranchCreatePage/>}/>
                                <Route path={"view/:id"} element={<BranchViewPage/>}/>
                                <Route path={"update/:id"} element={<BranchUpdatePage/>}/>
                                <Route path={"employee/create"} element={<EmployeeAddPage/>}/>
                                <Route path={"employee/view/:id"} element={<EmployeeViewPage/>}/>
                            </Route>
                            <Route path={"handbook"}>
                                <Route index element={<DistrictsPage/>}/>
                                <Route path={"districts"} element={<DistrictsPage/>}/>
                                <Route path={"regions"} element={<RegionsPage/>}/>
                                <Route path={"insurance-form"} element={<InsuranceFormPage/>}/>
                                <Route path={"object"} element={<ObjectPage/>}/>
                                <Route path={"object-type"} element={<TypeObjectPage/>}/>
                                <Route path={"police-type"} element={<TypePolicePage/>}/>
                                <Route path={"risk-type"} element={<TypeRiskPage/>}/>
                                <Route path={"risk"} element={<RiskPage/>}/>
                                <Route path={"insurance-classes"} element={<InsuranceClassPage/>}/>
                                <Route path={"insurance-subclasses"} element={<InsuranceSubClassPage/>}/>
                                <Route path={"sector-type"} element={<SectorTypePage/>}/>
                                <Route path={"policy-formats"} element={<PolicyFormatsPage/>}/>
                                <Route path={"insurer-type"} element={<InsurerTypePage/>}/>
                                <Route path={"application-form-docs"} element={<ApplicationFormDocsPage/>}/>
                                <Route path={"contract-form"} element={<ContractFormPage/>}/>
                                <Route path={"additional-documents"} element={<AdditionalDocumentsPage/>}/>
                                <Route path={"settlement-claim-type"} element={<SettlementClaimTypePage/>}/>
                                <Route path={"refund-type"} element={<RefundTypePage/>}/>
                                <Route path={"franchise-type"} element={<FranchiseTypePage/>}/>
                                <Route path={"payment-type"} element={<PaymentTypePage/>}/>
                                <Route path={"franchise-base"} element={<FranchiseBasePage/>}/>
                                <Route path={"translations"} element={<TranslationsPage/>}/>
                                <Route path={"citizenship"} element={<CitizenshipPage/>}/>
                                <Route path={"genders"} element={<GendersPage/>}/>
                                <Route path={"position"} element={<PositionPage/>}/>
                                <Route path={"document-types"} element={<DocumentTypePage/>}/>
                                <Route path={"branch-level"} element={<BranchLevelPage/>}/>
                                <Route path={"branch-status"} element={<BranchStatusPage/>}/>
                                <Route path={"manager-document-type"} element={<ManagerDocumentTypePage/>}/>
                                <Route path={"manager-document-type"} element={<ManagerDocumentTypePage/>}/>
                                <Route path={"reasons"} element={<ReasonsPage/>}/>
                                <Route path={"typeofendorsements"} element={<EndorsementstypePage/>}/>
                                <Route path={"endorsements-status"} element={<EndorsementsStatusPage/>}/>
                                <Route path={"payment-currency"} element={<PaymentCurrencyPage/>}/>
                                <Route path={"policy-status"} element={<PolicyStatusPage/>}/>
                                <Route path={"payment-status"} element={<PaymentStatusPage/>}/>
                                <Route path={"bco-language-policy"} element={<BCOLanguagePolicyPage/>}/>
                                <Route path={"vehicle-type"} element={<VehicleTypePage/>}/>
                                <Route path={"property-type"} element={<PropertyTypePage/>}/>
                                <Route path={"property-right-type"} element={<PropertyRightTypePage/>}/>
                                <Route path={"agricultural-type"} element={<AgriculturalTypePage/>}/>
                                <Route path={"measurement-type"} element={<MeasurementTypePage/>}/>
                                <Route path={"document-type"} element={<DocumentTypePage/>}/>
                            </Route>
                            <Route path={"policy"}>
                                <Route path={"create/:product_id"} element={<PolicyCreatePage/>}/>
                            </Route>
                            <Route path={"bco"}>
                                <Route index element={<BcoPage/>}/>
                                <Route path={"type"} element={<BcoTypePage/>}/>
                                <Route path={"status"} element={<BcoStatusPage/>}/>
                                <Route path={"language"} element={<BcoLanguagePage/>}/>
                                <Route path={"policy-status"} element={<BcoPolicyStatusPage/>}/>
                                <Route path={"act-status"} element={<BcoActStatusPage/>}/>
                            </Route>
                            <Route path={"insurance"}>
                                <Route path={"osgor"} element={<OsgorListPage/>}/>
                                <Route path={"osgor/create"} element={<OsgorCreatePage/>}/>
                                <Route path={"osgor/view/:form_id"} element={<OsgorViewPage/>}/>
                                <Route path={"osgop"} element={<OsgorListPage/>}/>
                                <Route path={"osgop/create"} element={<OsgorCreatePage/>}/>
                                <Route path={"osago"} element={<OsgorListPage/>}/>
                                <Route path={"osago/create"} element={<OsgorCreatePage/>}/>
                                <Route path={"smr"} element={<OsgorListPage/>}/>
                                <Route path={"smr/create"} element={<OsgorCreatePage/>}/>
                            </Route>
                            <Route path={"endorsement"}>
                                <Route path={"create/:product_id"} element={<EndorsementCreatePage/>}/>
                            </Route>
                            <Route path="/auth/logout" element={<LogOutPage/>}/>
                            <Route path={"auth/*"} element={<Navigate to={'/products/all'} replace/>}/>
                            <Route path={"/"} element={<Navigate to={'/products/all'} replace/>}/>
                            <Route path={"*"} element={<NotFoundPage/>}/>
                        </Route>

                    </Routes>
                </IsAuth>

                <IsGuest>
                    <Routes>
                        <Route path={"/auth"} element={<AuthLayout/>}>
                            <Route index element={<LoginPage/>}/>
                            <Route path={"sign-up"} element={<SignUpPage/>}/>
                        </Route>
                        <Route path={"*"} element={<Navigate to={'/auth'} replace/>}/>
                    </Routes>
                </IsGuest>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;
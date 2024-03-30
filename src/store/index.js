import create from 'zustand'
import {devtools, persist} from "zustand/middleware";
import config from "../config";
import storage from "../services/storage";
import {PERSON_TYPE} from "../constants";


let store = (set) => ({
    user: null,
    isAuthenticated: false,
    breadcrumbs: [],
    setUser: (user) => set(state => ({...state, user})),
    setAuth: (isAuthenticated) => set(state => ({...state, isAuthenticated})),
    setBreadcrumbs: (breadcrumbs) => set(state => ({...state, breadcrumbs}))
})

let settingsStore = (set) => ({
    token: null,
    darkMode: false,
    isMenuOpen: true,
    lang: storage.get('lang') || config.DEFAULT_APP_LANG,
    product: {},
    agreement: {},
    insurer: {type: PERSON_TYPE.person, openModal: false, data: null},
    beneficiary: {type: PERSON_TYPE.person, openModal: false, data: null},
    pledger: {type: PERSON_TYPE.person, openModal: false, data: null},
    pledgers: [],
    riskList: [],
    objects: [],
    commissions: [],
    setToken: (token) => set(state => ({...state, token})),
    setLang: (lang) => set(state => ({...state, lang})),
    setMode: () => set(state => ({...state, darkMode: !state.darkMode})),
    setOpenMenu: () => set(state => ({...state, isMenuOpen: !state.isMenuOpen})),
    setProduct: (attr) => set(state => ({product: {...state.product, ...attr}})),
    setAgreement: (attr) => set(state => ({agreement: {...state.agreement, ...attr}})),
    setInsurer: (attr) => set(state => ({insurer: {...state.insurer, ...attr}})),
    setPledger: (attr) => set(state => ({pledger: {...state.pledger, ...attr}})),
    setBeneficiary: (attr) => set(state => ({beneficiary: {...state.beneficiary, ...attr}})),
    resetProduct: () => set(state => ({...state, product: {}})),
    resetAgreement: () => set(state => ({...state, agreement: {}})),
    resetInsurer: () => set(state => ({...state, insurer: {type: 'physical', openModal: false, data: null}})),
    resetBeneficiary: () => set(state => ({...state, beneficiary: {type: 'physical', openModal: false, data: null}})),
    resetPledger: () => set(state => ({...state, pledger: {type: 'physical', openModal: false, data: null}})),
    addRiskList: (item) => set(state => ({...state, riskList: [...state.riskList, item]})),
    addPledgers: (item) => set(state => ({...state, pledgers: [...state.pledgers, item]})),
    addObjects: (item) => set(state => ({...state, objects: [...state.objects, item]})),
    addCommissions: (item) => set(state => ({...state, commissions: [...state.commissions, item]})),
    removeRiskList: (_id) => set(state => ({...state, riskList: state.riskList.filter(({id}) => id !== _id)})),
    removePledgers: (_id) => set(state => ({...state, pledgers: state.pledgers.filter(({id}) => id !== _id)})),
    removeObjects: (_id) => set(state => ({...state, objects: state.objects.filter(({id}) => id !== _id)})),
    removeCommissions: (_id) => set(state => ({...state, commissions: state.commissions.filter(({id}) => id !== _id)})),
    resetRiskList: () => set(state => ({...state, riskList: []})),
    resetPledgers: () => set(state => ({...state, pledgers: []})),
    resetObjects: () => set(state => ({...state, objects: []})),
    resetCommissions: () => set(state => ({...state, commissions: []})),
})


store = devtools(store);
settingsStore = devtools(settingsStore)
settingsStore = persist(settingsStore, {name: 'settings'});

export const useStore = create(store)
export const useSettingsStore = create(settingsStore)


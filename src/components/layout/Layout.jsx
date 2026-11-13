import {useEffect} from 'react';
import {Outlet,useLocation} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {useLocale} from '../../hooks/useLocale';
import {getMeta,applyMeta} from '../../utils/seo';
import Header from './Header';
import Footer from './Footer';
export default function Layout(){const {lang,t,dir}=useLocale();const {i18n}=useTranslation();const {pathname}=useLocation();useEffect(()=>{i18n.changeLanguage(lang);document.documentElement.lang=lang;document.documentElement.dir=dir;applyMeta(getMeta(pathname));window.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>document.getElementById('main')?.focus({preventScroll:true}));},[lang,dir,i18n,pathname]);return <div dir={dir} lang={lang}><a className="skip-link" href="#main">{t('common.skip')}</a><Header/><main id="main" tabIndex={-1}><Outlet/></main><Footer/></div>;}

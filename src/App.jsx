import {lazy,Suspense} from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';
import {MotionConfig} from 'motion/react';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetail from './pages/ServiceDetail';
import WorkPage from './pages/WorkPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFound from './pages/NotFound';
const ProjectDetail=lazy(()=>import('./pages/ProjectDetail'));
export default function App(){return <MotionConfig reducedMotion="user"><Suspense fallback={<div className="route-loading" aria-busy="true">Jreas Lab…</div>}><Routes><Route path="/" element={<Navigate to="/ar" replace/>}/>{['ar','en'].map(lang=><Route key={lang} path={`/${lang}`} element={<Layout/>}><Route index element={<Home/>}/><Route path="services" element={<ServicesPage/>}/><Route path="services/:slug" element={<ServiceDetail/>}/><Route path="work" element={<WorkPage/>}/><Route path="work/:slug" element={<ProjectDetail/>}/><Route path="about" element={<AboutPage/>}/><Route path="contact" element={<ContactPage/>}/><Route path="*" element={<NotFound/>}/></Route>)}<Route path="*" element={<Layout/>}><Route path="*" element={<NotFound/>}/></Route></Routes></Suspense></MotionConfig>;}

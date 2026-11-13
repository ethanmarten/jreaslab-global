import {PageHeading} from '../components/ui/Elements';
import {ServiceList} from '../components/sections/Services';
import Process from '../components/sections/Process';
import CallToAction from '../components/sections/CallToAction';
import {useLocale} from '../hooks/useLocale';
export default function ServicesPage(){const {t}=useLocale();return <><PageHeading eyebrow={t('nav.services')} title={t('services.title')} description={t('services.description')}/><div className="container page-content"><ServiceList/></div><Process/><CallToAction/></>;}

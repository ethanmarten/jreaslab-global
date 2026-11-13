import {PageHeading} from '../components/ui/Elements';
import {ProjectGrid} from '../components/sections/Work';
import CallToAction from '../components/sections/CallToAction';
import {useLocale} from '../hooks/useLocale';
export default function WorkPage(){const {t}=useLocale();return <><PageHeading eyebrow={t('nav.work')} title={t('work.title')} description={t('work.description')}/><div className="container page-content"><ProjectGrid filterable/></div><CallToAction/></>;}

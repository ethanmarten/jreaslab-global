import {PageHeading,Button} from '../components/ui/Elements';
import {useLocale} from '../hooks/useLocale';
export default function NotFound(){const {t,path}=useLocale();return <div className="not-found"><PageHeading eyebrow="404" title={t('common.notfound')}/><div className="container"><Button to={path()}>{t('common.return')}</Button></div></div>;}

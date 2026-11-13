import {Link} from 'react-router-dom';
import {useLocale} from '../../hooks/useLocale';
import {Arrow,Reveal} from '../ui/Elements';
export default function Intro(){const {t,path}=useLocale();return <section id="studio-intro" className="intro section container"><Reveal className="intro-side"><span className="eyebrow"><i/>{t('intro.eyebrow')}</span><div className="intro-symbol" aria-hidden="true"><span/><span/><span/></div></Reveal><Reveal className="intro-copy"><h2 className="multiline">{t('intro.title')}</h2><p>{t('intro.description')}</p><Link className="text-link" to={path('/about')}>{t('intro.link')}<Arrow/></Link><div className="principles">{t('intro.principles',{returnObjects:true}).map((p,i)=><span key={p}><b>0{i+1}</b>{p}</span>)}</div></Reveal></section>;}

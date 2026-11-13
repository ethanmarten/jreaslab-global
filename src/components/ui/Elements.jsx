import {Link} from 'react-router-dom';
import {ArrowUpLeft,ArrowUpRight} from 'lucide-react';
import {motion} from 'motion/react';
import {useLocale} from '../../hooks/useLocale';
export function Arrow({size=20}){const {lang}=useLocale();const Icon=lang==='ar'?ArrowUpLeft:ArrowUpRight;return <Icon size={size} aria-hidden="true"/>;}
export function Button({to,children,light=false,...props}){return <Link to={to} className={`button ${light?'button-light':''}`} {...props}><span>{children}</span><span className="button-icon"><Arrow/></span></Link>;}
export function Reveal({children,className=''}){return <motion.div className={`reveal ${className}`} initial={{y:18,opacity:1}} whileInView={{y:0,opacity:1}} viewport={{once:true,amount:0.08}} transition={{duration:.65}}>{children}</motion.div>;}
export function SectionHead({eyebrow,title,description,children}){return <div className="section-head"><div><span className="eyebrow"><i/>{eyebrow}</span><h2 className="multiline">{title}</h2></div><div className="section-head-aside">{description&&<p>{description}</p>}{children}</div></div>;}
export function PageHeading({eyebrow,title,description}){return <section className="page-heading container"><span className="eyebrow"><i/>{eyebrow}</span><h1 className="multiline">{title}</h1>{description&&<p>{description}</p>}</section>;}

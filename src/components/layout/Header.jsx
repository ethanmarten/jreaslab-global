import {useEffect,useRef,useState} from 'react';
import {Link,NavLink,useLocation} from 'react-router-dom';
import {Menu,X,Globe2} from 'lucide-react';
import {AnimatePresence,motion} from 'motion/react';
import {useLocale} from '../../hooks/useLocale';
import styles from './Header.module.css';
const items=['home','services','work','about','contact'];
export default function Header(){
 const {lang,t,path}=useLocale();const location=useLocation();const [open,setOpen]=useState(false);const [scrolled,setScrolled]=useState(false);const toggle=useRef();const panel=useRef();
 useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>30);onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);},[]);
 useEffect(()=>{if(!open)return;const old=document.body.style.overflow;document.body.style.overflow='hidden';const links=panel.current?.querySelectorAll('a');links?.[0]?.focus();function keys(e){if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}if(e.key==='Tab'){const all=[toggle.current,...links];const first=all[0],last=all.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}document.addEventListener('keydown',keys);return()=>{document.body.style.overflow=old;document.removeEventListener('keydown',keys);};},[open]);
 const other=location.pathname.replace(/^\/(ar|en)/,lang==='ar'?'/en':'/ar')+location.search;
 const nav=(mobile=false)=>items.map((item,i)=><NavLink key={item} end={item==='home'} to={path(item==='home'?'':`/${item}`)} onClick={()=>setOpen(false)} className={({isActive})=>isActive?styles.active:''}>{mobile&&<span className={styles.index}>0{i+1}</span>}{t(`nav.${item}`)}</NavLink>);
 return <header className={`${styles.header} ${scrolled?styles.scrolled:''}`}><div className={styles.bar}><Link to={path()} className={styles.logo} onClick={()=>setOpen(false)} aria-label="Jreas Lab"><img src="/images/logo-dark.svg" width="180" height="48" alt="Jreas Lab"/></Link><nav className={styles.desktop} aria-label={lang==='ar'?'التنقل الرئيسي':'Main navigation'}>{nav()}</nav><div className={styles.actions}><Link to={other} className={styles.language} lang={lang==='ar'?'en':'ar'} onClick={()=>setOpen(false)}><Globe2 size={16} aria-hidden="true"/>{lang==='ar'?'EN':'العربية'}</Link><button ref={toggle} type="button" className={styles.toggle} aria-label={t(open?'common.close':'common.menu')} aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(v=>!v)}>{open?<X/>:<Menu/>}</button></div></div><AnimatePresence>{open&&<motion.nav id="mobile-menu" ref={panel} className={styles.mobile} aria-label={t('common.menu')} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>{nav(true)}<a href="mailto:info@jreaslab.com">info@jreaslab.com</a></motion.nav>}</AnimatePresence></header>;
}

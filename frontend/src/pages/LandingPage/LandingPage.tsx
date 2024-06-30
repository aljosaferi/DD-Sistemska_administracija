import { useEffect } from 'react';
import Carousel from '../../components/Carousel/Carousel';
import Reveal from '../../components/Reveal/Reveal';
import { EmblaOptionsType } from 'embla-carousel'

import styles from './LandingPage.module.scss';
import '../../components/Carousel/embla.scss';
import NewsCard from '../../components/NewsCard/NewsCard';

const OPTIONS: EmblaOptionsType = { align: 'start', slidesToScroll: 'auto' }

function LandingPage() {

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      let scrollAmount = 0;
      let slideTimer = setInterval(function(){
          if(e.deltaY < 0) {
              window.scrollBy(0, -7);
          } else {
              window.scrollBy(0, 7);
          }
          scrollAmount += 7;
          if(scrollAmount >= Math.abs(e.deltaY)){
              window.clearInterval(slideTimer);
          }
      }, 1);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);


    return (
        <div className={styles['container']}>
            <section className={styles['first']}>
                <div className={styles['logo-text']}>
                    <Reveal direction='left'>
                        <h1>Študentska</h1>
                    </Reveal>
                    <Reveal direction='left' delay={0.3}>
                        <h1 className={styles["second-header"]}>Prehrana</h1>
                    </Reveal>
                </div>
                <div className={styles['image-container']}>
                    <Reveal direction='right' delay={0.15}>
                        <img src="/images/salad-bowl.png" alt="Skleda"/>
                    </Reveal>
                </div>
                <div className={styles['wave']}>
                    <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className={styles["shape-fill"]}/>
                    </svg>
                </div>
            </section>
            <section className={styles['news']}>
                <Reveal direction='left' duration={0.6} delay={0.2}>
                    <h1>Novice</h1>
                </Reveal>
                {/* <Reveal direction='left' duration={0.6} delay={0.4}> */}
                    <Carousel slides={[<NewsCard/>, <NewsCard/>, <NewsCard/>, <NewsCard/>, <NewsCard/>, <NewsCard/>]} options={OPTIONS} />
            </section>
        </div>
    )
}

export default LandingPage;
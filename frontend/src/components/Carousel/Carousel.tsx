import { useState, useEffect, useRef, } from 'react';
import { motion, useInView, useAnimation, AnimatePresence } from 'framer-motion';

import Reveal from '../Reveal/Reveal'
import Button from '../Button/Button';
import AddNews from '../NewsCard/AddNews/AddNews';

import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './CarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import Modal from '../Modal/Modal';

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [isOpenAddNews, setIsOpenAddNews] = useState(false)

  const initialSlideCount = (
    window.matchMedia("(min-width: 1451px)").matches ? 3 :
    window.matchMedia("(min-width: 1101px)").matches ? 2 :
    1
  );
  const [slideCount, setSlideCount] = useState(initialSlideCount);

  const closeAddNews = () => setIsOpenAddNews(false)
  const openAddNews = () => setIsOpenAddNews(true)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const ref = useRef(null)    
   const isInView = useInView(ref, { once: true });

   const mainControls = useAnimation();
   
   useEffect(() => {
        if(isInView) {
            mainControls.start("visible");
        } 
   }, [isInView])

  return (
    <section ref={ref} className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((SlideComponent, index) => (
            <div className="embla__slide" key={index}>
              {index < slideCount ?
                <motion.div
                  className='embla__slide__content'
                  variants={{
                    hidden: { 
                        opacity: 0, 
                        x: -75 
                    },
                    visible: { 
                        opacity: 1, 
                        x: 0
                    },
                  }}
                  initial="hidden"
                  animate={mainControls}
                  transition= {{
                      duration: 0.6,
                      delay: 0.3 + index * 0.15
                  }}
                >
                  {SlideComponent}
                </motion.div>
              :
                <div className="embla__slide__content">
                  {SlideComponent}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
      
      <div className="embla__controls">
        <Reveal delay={0.15}>
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="embla__add__news">
            <Button type='primary' padding="1rem" onClick={openAddNews}>
              Dodaj novico
            </Button>
          </div>
        </Reveal>
      </div>
      
      <AnimatePresence>
        {isOpenAddNews ?
          <Modal handleClose={closeAddNews}>
              <AddNews handleClose={closeAddNews}/>
          </Modal>
        :
          null
        }
      </AnimatePresence>
    </section>
  )
}

export default EmblaCarousel

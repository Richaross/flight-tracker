import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlightContext } from '../lib/context/FlightContext';
import { IMAGES, COLORS } from '../lib/constants';

export default function FlightAttendant() {
  const { isLoading, isSearching, hasResults } = useFlightContext();

  // Determine state
  let state = 'default';
  let bgImage = IMAGES.PENGUIN.DEFAULT;

  if (isLoading) {
    state = 'loading';
    bgImage = IMAGES.PENGUIN.THINKING; 
  } else if (isSearching && !hasResults) {
    state = 'error';
    bgImage = IMAGES.PENGUIN.ERROR;
  }

  // If we have results (searched && hasResults), this component might be hidden 
  if (isSearching && hasResults && !isLoading) {
      return null;
  }

  return (
    <div 
        className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-10 flex items-center overflow-hidden"
    >
      {/* 
        Turquoise Background Layer 
        This is always present behind the image. When an image fades out, 
        this color will be revealed before the new image fades in.
      */}
      <div className={`absolute inset-0 z-0 ${COLORS.BG_TURQUOISE_CLASS}`} />

      {/* Background Image with AnimatePresence */}
      <AnimatePresence mode="wait">
        <motion.div
           key={state}
           className="absolute inset-0 z-10"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.5 } }} // Add delay to let background show
           exit={{ opacity: 0, transition: { duration: 0.5 } }}
        >
          <Image
            src={bgImage}
            alt="Flight Attendant Penguin"
            fill
            className="object-cover object-right md:object-[66%_center]"
            priority
            unoptimized
          />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}

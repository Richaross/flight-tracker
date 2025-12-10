import Image from 'next/image';

export default function FlightAttendant({ loading, searched, hasResults }) {
  // Determine state
  let state = 'default';
  let bgImage = '/penguin-default.png';

  if (loading) {
    state = 'loading';
    // reusing default for now as loading gen failed, or we can use error if it makes more sense, 
    // but usually waiting is neutral. 
    bgImage = '/penguin-thinking.png'; 
  } else if (searched && !hasResults) {
    state = 'error';
    bgImage = '/penguin-error.png';
  }

  // If we have results (searched && hasResults), this component might be hidden 
  // or shown differently if the user wants it over the map? 
  // The request said: "background is shown over the map when there is no prompt yet"
  // "when there is no return after a search"
  // "appears when the search is loading"
  // So if results are found, this component should probably NOT be visible (map takes over).

  if (searched && hasResults && !loading) {
      return null;
  }

  return (
    <div 
        key={state} 
        className="absolute inset-x-0 bottom-0 top-0 pointer-events-none z-10 flex items-center overflow-hidden animate-fade-in"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
          <Image
            src={bgImage}
            alt="Flight Attendant Penguin"
            fill
            className="object-cover object-right md:object-[66%_center]"
            priority
            unoptimized
          />
      </div>


    </div>
  );
}

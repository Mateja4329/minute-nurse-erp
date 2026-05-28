// import React, { useEffect, useRef, useState } from 'react';

// const FadeInView = ({ children, delay = 0 }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const domRef = useRef(); // Referenca na pravi DOM element

//   useEffect(() => {
//     // IntersectionObserver follows the visibility of the element in the viewport
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         // when the element is visible in the viewport,
//         // set isVisible to true to trigger the fade-in animation
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//           // optinal: stop observing after the element has become visible
//           observer.unobserve(entry.target); 
//         }
//       });
//     }, {
//       threshold: 0.1 // Animation will trigger when 10% of the element is visible
//     });

//     const currentRef = domRef.current;
//     if (currentRef) observer.observe(currentRef);

//     // Clean up on component unmount
//     return () => {
//       if (currentRef) observer.unobserve(currentRef);
//     };
//   }, []);

//   return (
//     <div
//       ref={domRef}
//       className={`fade-on-scroll ${isVisible ? 'is-visible' : ''}`}
//       style={{ transitionDelay: `${delay}s` }}
//     >
//       {children}
//     </div>
//   );
// };

// export default FadeInView;

// disabled for now
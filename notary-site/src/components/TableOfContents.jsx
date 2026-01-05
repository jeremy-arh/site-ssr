'use client'

import { useState, useEffect } from 'react';

const TableOfContents = ({ content }) => {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Extract H2 headings from HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');

    const headingsList = Array.from(h2Elements).map((h2, index) => {
      const text = h2.textContent;
      const id = `heading-${index}`;
      return { id, text };
    });

    setHeadings(headingsList);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    // Observe all h2 elements with IDs
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id) => {
    // Find the heading in the headings list to get the index
    const headingIndex = headings.findIndex(h => h.id === id);
    
    if (headingIndex === -1) return;

    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      // First try to find by ID
      let element = document.getElementById(id);
      
      // If not found, find by index in blog content (more reliable)
      if (!element) {
        const contentElement = document.querySelector('.blog-content');
        if (contentElement) {
          const h2Elements = contentElement.querySelectorAll('h2');
          if (h2Elements[headingIndex]) {
            element = h2Elements[headingIndex];
            // Ensure the ID is set
            if (!element.id) {
              element.id = id;
            }
          }
        }
      }

      if (element) {
        // Calculate offset based on navbar height (48px mobile, 80px desktop)
        // Plus some padding for better spacing
        const isMobile = window.innerWidth < 768;
        const navbarHeight = isMobile ? 60 : 80;
        const offset = navbarHeight + 20; // Add extra padding
        
        // Get the element's position relative to the document
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        const offsetPosition = elementTop - offset;

        // Scroll to the position
        window.scrollTo({
          top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative values
          behavior: 'smooth'
        });

        // Update active state immediately for better UX
        setActiveId(id);
      }
    });
  };

  return (
    <aside className="mb-8 lg:sticky lg:top-32 lg:h-fit lg:mb-0">
      <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
          Table of Contents
        </h3>
        <nav>
          <ul className="space-y-2 md:space-y-3">
            {headings.map(({ id, text }) => (
              <li key={id}>
                <button
                  onClick={() => scrollToHeading(id)}
                  className={`text-left text-xs md:text-sm transition-all duration-200 hover:text-black ${
                    activeId === id
                      ? 'text-black font-semibold border-l-2 border-black pl-3'
                      : 'text-gray-600 border-l-2 border-transparent pl-3'
                  }`}
                >
                  {text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default TableOfContents;

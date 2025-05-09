// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add passive event listeners for better mobile performance
  const supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}
  
  // Optimize for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Countdown Timer
  function updateCountdown() {
    const releaseDate = new Date('May 26, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const difference = releaseDate - now;
    
    if (difference <= 0) {
      // Game has been released
      document.getElementById('days').textContent = '00';
      document.getElementById('hours').textContent = '00';
      document.getElementById('minutes').textContent = '00';
      document.getElementById('seconds').textContent = '00';
      return;
    }
    
    // Calculate time units
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    // Update the countdown display
    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }
  
  // Update the countdown every second
  updateCountdown();
  setInterval(updateCountdown, 1000);
  
  // Trailer Modal
  const modal = document.getElementById('trailer-modal');
  const closeModal = document.getElementById('close-modal');
  const trailerIframe = document.getElementById('trailer-iframe');
  
  // Trailer buttons
  const trailerButton1 = document.getElementById('trailer-button-1');
  const trailerButton2 = document.getElementById('trailer-button-2');
  
  // Trailer video IDs
  const trailer1ID = 'QdBZY2fkU-0';
  const trailer2ID = 'VQRLujxTm3c';
  
  // Open trailer modal
  function openTrailerModal(videoId) {
    trailerIframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1';
    modal.style.display = 'flex';
  }
  
  // Close trailer modal
  function closeTrailerModal() {
    trailerIframe.src = '';
    modal.style.display = 'none';
  }
  
  // Event listeners for trailer buttons with passive option for better mobile performance
  const eventOptions = supportsPassive ? { passive: true } : false;
  
  trailerButton1.addEventListener('click', function() {
    openTrailerModal(trailer1ID);
  }, eventOptions);
  
  trailerButton2.addEventListener('click', function() {
    openTrailerModal(trailer2ID);
  }, eventOptions);
  
  // Event listener for close button
  closeModal.addEventListener('click', closeTrailerModal, eventOptions);
  
  // Close modal when clicking outside content
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeTrailerModal();
    }
  }, eventOptions);
  
  // Add touch events for mobile
  if (isMobile) {
    // Improve touch target sizes for mobile
    const touchTargets = document.querySelectorAll('.trailer-button, .social-button, .calendar-button, .close-button');
    touchTargets.forEach(target => {
      target.style.minHeight = '44px';
      target.style.minWidth = '44px';
    });
    
    // Add touch event for modal close
    modal.addEventListener('touchend', function(e) {
      if (e.target === modal) {
        closeTrailerModal();
      }
    }, eventOptions);
  }
  
  // Close modal when pressing ESC key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeTrailerModal();
    }
  });
  
  // Calendar Button
  const calendarButton = document.getElementById('add-to-calendar-button');
  const calendarDropdown = document.getElementById('calendar-dropdown');
  
  // Toggle calendar dropdown with improved mobile handling
  calendarButton.addEventListener('click', function(e) {
    e.preventDefault();
    if (calendarDropdown.style.display === 'block') {
      calendarDropdown.style.display = 'none';
    } else {
      // Create calendar links if they don't exist
      if (calendarDropdown.children.length === 0) {
        createCalendarLinks();
      }
      
      // Position the dropdown better on mobile
      if (isMobile) {
        const buttonRect = calendarButton.getBoundingClientRect();
        const dropdownHeight = 220; // Approximate height
        
        // Check if there's enough space below the button
        if (window.innerHeight - buttonRect.bottom < dropdownHeight) {
          // Position above the button if not enough space below
          calendarDropdown.style.bottom = (window.innerHeight - buttonRect.top + 10) + 'px';
        } else {
          // Default position below the button
          calendarDropdown.style.bottom = '80px';
        }
      }
      
      calendarDropdown.style.display = 'block';
    }
  }, eventOptions);
  
  // Close dropdown when clicking/touching outside
  document.addEventListener('click', function(e) {
    if (!calendarDropdown.contains(e.target) && e.target !== calendarButton) {
      calendarDropdown.style.display = 'none';
    }
  }, eventOptions);
  
  if (isMobile) {
    document.addEventListener('touchend', function(e) {
      if (!calendarDropdown.contains(e.target) && e.target !== calendarButton) {
        calendarDropdown.style.display = 'none';
      }
    }, eventOptions);
  }
  
  // Create calendar links
  function createCalendarLinks() {
    // Event details
    const eventTitle = "GTA VI Release";
    const eventDescription = "Grand Theft Auto VI official release date";
    const eventStartDate = "20260526T000000Z";
    const eventEndDate = "20260526T235959Z";
    const eventLocation = "Worldwide";
    
    // Calendar services
    const calendarServices = [
      {
        name: "Google Calendar",
        url: "https://www.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(eventTitle) + "&dates=" + eventStartDate + "/" + eventEndDate + "&details=" + encodeURIComponent(eventDescription) + "&location=" + encodeURIComponent(eventLocation)
      },
      {
        name: "Apple Calendar",
        url: "data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:" + eventStartDate + "%0ADTEND:" + eventEndDate + "%0ASUMMARY:" + eventTitle + "%0ADESCRIPTION:" + eventDescription + "%0ALOCATION:" + eventLocation + "%0AEND:VEVENT%0AEND:VCALENDAR"
      },
      {
        name: "Outlook",
        url: "https://outlook.live.com/calendar/0/deeplink/compose?subject=" + encodeURIComponent(eventTitle) + "&startdt=" + eventStartDate + "&enddt=" + eventEndDate + "&body=" + encodeURIComponent(eventDescription) + "&location=" + encodeURIComponent(eventLocation)
      },
      {
        name: "Yahoo Calendar",
        url: "https://calendar.yahoo.com/?v=60&title=" + encodeURIComponent(eventTitle) + "&st=" + eventStartDate + "&et=" + eventEndDate + "&desc=" + encodeURIComponent(eventDescription) + "&in_loc=" + encodeURIComponent(eventLocation)
      }
    ];
    
    // Create links in dropdown
    calendarServices.forEach(service => {
      const link = document.createElement('a');
      link.href = service.url;
      link.className = 'calendar-link';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.innerHTML = `
        <svg class="calendar-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
          <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
          <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
        </svg>
        ${service.name}
      `;
      calendarDropdown.appendChild(link);
    });
  }
});
